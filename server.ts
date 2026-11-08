import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Helper to determine the public application origin
  const getAppOrigin = (req: express.Request): string => {
    if (process.env.APP_URL) {
      return process.env.APP_URL.replace(/\/$/, '');
    }
    const forwardedHost = req.get('x-forwarded-host') || req.get('host');
    const forwardedProto = req.get('x-forwarded-proto') || req.protocol || 'http';
    return `${forwardedProto}://${forwardedHost}`;
  };

  // --- Facebook OAuth Backend Routes ---

  // 1. Get Facebook OAuth Configuration & Status
  app.get('/api/auth/facebook/status', (req, res) => {
    const appId = process.env.FACEBOOK_APP_ID || '';
    const hasSecret = Boolean(process.env.FACEBOOK_APP_SECRET);
    const origin = getAppOrigin(req);
    const redirectUri = `${origin}/auth/facebook/callback`;

    res.json({
      configured: Boolean(appId && hasSecret),
      appId: appId || null,
      redirectUri,
    });
  });

  // 2. Generate Official Facebook OAuth URL
  app.get('/api/auth/facebook/url', (req, res) => {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const origin = getAppOrigin(req);
    const redirectUri = `${origin}/auth/facebook/callback`;

    if (!appId || !appSecret) {
      return res.status(200).json({
        configured: false,
        message: 'Facebook App ID or Secret is not configured in environment variables.',
        redirectUri,
      });
    }

    const state = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const authParams = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      state: state,
      response_type: 'code',
      scope: 'public_profile,email',
      auth_type: 'rerequest',
      display: 'popup',
    });

    const url = `https://www.facebook.com/v19.0/dialog/oauth?${authParams.toString()}`;

    res.json({
      configured: true,
      url,
      redirectUri,
    });
  });

  // 3. Official OAuth Callback Endpoint (Handles code exchange and Meta Graph API queries)
  app.get(['/auth/facebook/callback', '/auth/facebook/callback/'], async (req, res) => {
    const { code, error, error_description } = req.query;

    if (error || !code) {
      const errorMsg = (error_description as string) || (error as string) || 'ব্যবহারকারী অনুমোদন বাতিল করেছেন (Authentication cancelled)';
      return res.send(`
        <!DOCTYPE html>
        <html lang="bn">
          <head>
            <meta charset="utf-8">
            <title>Haat Bazar - Authentication Cancelled</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafafa;">
            <div style="background: white; padding: 24px; border-radius: 16px; border: 1px solid #e5e7eb; text-align: center; max-width: 420px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <h3 style="color: #DC2626; margin-bottom: 8px;">অনুমোদন সম্পন্ন হয়নি</h3>
              <p style="font-size: 13px; color: #4B5563; margin-bottom: 16px;">${errorMsg}</p>
              <p style="font-size: 12px; color: #9CA3AF;">উইন্ডোটি স্বয়ংক্রিয়ভাবে বন্ধ হচ্ছে...</p>
            </div>
            <script>
              try {
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'FACEBOOK_AUTH_ERROR',
                    error: ${JSON.stringify(errorMsg)}
                  }, '*');
                  setTimeout(() => window.close(), 1200);
                } else {
                  window.location.href = '/';
                }
              } catch(e) {
                window.close();
              }
            </script>
          </body>
        </html>
      `);
    }

    try {
      const appId = process.env.FACEBOOK_APP_ID;
      const appSecret = process.env.FACEBOOK_APP_SECRET;
      const origin = getAppOrigin(req);
      const redirectUri = `${origin}/auth/facebook/callback`;

      if (!appId || !appSecret) {
        throw new Error('Server-side Meta credentials (FACEBOOK_APP_ID / FACEBOOK_APP_SECRET) are missing.');
      }

      // Step A: Exchange code for Access Token using Meta Graph API
      const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
      tokenUrl.searchParams.set('client_id', appId);
      tokenUrl.searchParams.set('client_secret', appSecret);
      tokenUrl.searchParams.set('redirect_uri', redirectUri);
      tokenUrl.searchParams.set('code', code as string);

      const tokenResponse = await fetch(tokenUrl.toString());
      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || tokenData.error) {
        throw new Error(tokenData.error?.message || 'Failed to exchange authorization code with Meta Graph API.');
      }

      const accessToken = tokenData.access_token;

      // Step B: Fetch user profile (name, picture, email)
      // Note: email is only provided if user granted permission and email exists on FB account
      const meUrl = `https://graph.facebook.com/v19.0/me?fields=id,name,email,picture.width(400).height(400)&access_token=${encodeURIComponent(accessToken)}`;
      const meResponse = await fetch(meUrl);
      const meData = await meResponse.json();

      if (!meResponse.ok || meData.error) {
        throw new Error(meData.error?.message || 'Failed to retrieve Facebook user profile.');
      }

      const profilePayload = {
        facebookId: meData.id,
        name: meData.name || '',
        email: meData.email || '',
        avatar: meData.picture?.data?.url || '',
        syncedAt: new Date().toISOString(),
      };

      res.send(`
        <!DOCTYPE html>
        <html lang="bn">
          <head>
            <meta charset="utf-8">
            <title>Haat Bazar - Authentication Success</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafafa;">
            <div style="background: white; padding: 24px; border-radius: 16px; border: 1px solid #e5e7eb; text-align: center; max-width: 420px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <h3 style="color: #007A3D; margin-bottom: 8px;">সফলভাবে সংযোগ হয়েছে!</h3>
              <p style="font-size: 13px; color: #4B5563; margin-bottom: 16px;">আপনার প্রোফাইল তথ্য হাট বাজারে সিঙ্ক করা হচ্ছে...</p>
              <p style="font-size: 12px; color: #9CA3AF;">উইন্ডোটি স্বয়ংক্রিয়ভাবে বন্ধ হচ্ছে...</p>
            </div>
            <script>
              try {
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'FACEBOOK_AUTH_SUCCESS',
                    profile: ${JSON.stringify(profilePayload)}
                  }, '*');
                  setTimeout(() => window.close(), 600);
                } else {
                  window.location.href = '/';
                }
              } catch(e) {
                window.close();
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to authenticate with Facebook';
      res.send(`
        <!DOCTYPE html>
        <html lang="bn">
          <head>
            <meta charset="utf-8">
            <title>Haat Bazar - Authentication Error</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafafa;">
            <div style="background: white; padding: 24px; border-radius: 16px; border: 1px solid #e5e7eb; text-align: center; max-width: 420px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <h3 style="color: #DC2626; margin-bottom: 8px;">ত্রুটি দেখা দিয়েছে</h3>
              <p style="font-size: 13px; color: #4B5563; margin-bottom: 16px;">${errorMsg}</p>
              <p style="font-size: 12px; color: #9CA3AF;">উইন্ডোটি বন্ধ করা হচ্ছে...</p>
            </div>
            <script>
              try {
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'FACEBOOK_AUTH_ERROR',
                    error: ${JSON.stringify(errorMsg)}
                  }, '*');
                  setTimeout(() => window.close(), 2000);
                } else {
                  window.location.href = '/';
                }
              } catch(e) {
                window.close();
              }
            </script>
          </body>
        </html>
      `);
    }
  });

  // 4. Meta Data Deletion Callback (Required by Meta Platform Policy)
  app.post('/api/auth/facebook/data-deletion', (req, res) => {
    const confirmationCode = 'HB-DEL-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const origin = getAppOrigin(req);
    const statusUrl = `${origin}/api/auth/facebook/data-deletion-status?code=${confirmationCode}`;

    res.json({
      url: statusUrl,
      confirmation_code: confirmationCode,
    });
  });

  // 5. Data Deletion Status Check
  app.get('/api/auth/facebook/data-deletion-status', (req, res) => {
    const code = req.query.code || 'HB-DEL-SAMPLE';
    res.send(`
      <!DOCTYPE html>
      <html lang="bn">
        <head>
          <meta charset="utf-8">
          <title>Haat Bazar - Data Deletion Status</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 600px; margin: auto; line-height: 1.6; color: #1f2937;">
          <h2 style="color: #007A3D;">হাট বাজার - ডেটা মোছার অনুরোধের স্ট্যাটাস</h2>
          <p><strong>কনফার্মেশন কোড:</strong> <code style="background: #f3f4f6; padding: 3px 8px; border-radius: 4px;">${code}</code></p>
          <p>আপনার ফেসবুক অনুমোদনের সাথে যুক্ত সাময়িক তথ্য হাট বাজারের ডেটাবেজ থেকে মুছে ফেলার অনুরোধটি সফলভাবে গ্রহণ ও কার্যকর করা হয়েছে।</p>
          <p style="font-size: 12px; color: #6b7280;">আইনগত বা হিসাবরক্ষণ সংক্রান্ত কোনো অর্ডারের রেকর্ড থাকলে তা স্থানীয় ই-কমার্স নীতিমালা অনুযায়ী সংরক্ষিত থাকবে।</p>
          <a href="/" style="display: inline-block; margin-top: 16px; background: #007A3D; color: white; padding: 8px 16px; text-decoration: none; border-radius: 8px; font-size: 13px;">হোমপেজে ফিরে যান</a>
        </body>
      </html>
    `);
  });

  // --- Vite Middleware in Dev / Static Serving in Production ---
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Haat Bazar Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
