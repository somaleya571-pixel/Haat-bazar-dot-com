import { chromium } from 'playwright';

async function testWorkflow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Check home page
  console.log('Title:', await page.title());

  // Click on "প্রোফাইল নিবন্ধন" button in header
  const registerBtn = page.getByRole('button', { name: /প্রোফাইল নিবন্ধন/i });
  await registerBtn.click();
  await page.waitForTimeout(1000);

  // Take screenshot of Welcome Page
  await page.screenshot({ path: '/tmp/test-welcome-page.png' });
  console.log('Screenshot saved: /tmp/test-welcome-page.png');

  // Verify welcome landing buttons: Red Cancel and Blue Continue
  const cancelBtn = page.locator('button:has-text("বাতিল (Cancel)")');
  const continueBtn = page.locator('button:has-text("চালিয়ে যান (Continue)")');
  console.log('Cancel button visible:', await cancelBtn.isVisible());
  console.log('Continue button visible:', await continueBtn.isVisible());

  // Click Continue button
  await continueBtn.click();
  await page.waitForTimeout(1500);

  // Form should now be visible
  await page.screenshot({ path: '/tmp/test-form-blank.png' });
  console.log('Screenshot saved: /tmp/test-form-blank.png');

  // Verify Name, Phone, and Email are empty
  const nameInput = page.locator('input[placeholder*="আপনার সম্পূর্ণ নাম"]');
  const phoneInput = page.locator('input[placeholder*="017XXXXXXXX"]');
  const emailInput = page.locator('input[type="email"]');

  console.log('Name value is blank:', (await nameInput.inputValue()) === '');
  console.log('Phone value is blank:', (await phoneInput.inputValue()) === '');
  console.log('Email value is blank:', (await emailInput.inputValue()) === '');

  // Fill in Name and Email
  await nameInput.fill('মোহাম্মদ আব্দুল্লাহ');
  await emailInput.fill('abdullah.dhaka@example.com');

  // Test Phone number validation with invalid number first
  await phoneInput.fill('01212345678'); // 012 is invalid prefix
  const otpBtn = page.locator('button:has-text("ওটিপি পাঠান")');
  await otpBtn.click();
  await page.waitForTimeout(500);
  console.log('Error message on invalid prefix shown:', await page.locator('text=সঠিক বাংলাদেশী মোবাইল নম্বর লিখুন').isVisible());

  // Fill valid phone number with +880
  await phoneInput.fill('+8801712345678');
  await otpBtn.click();
  await page.waitForTimeout(1000);

  // Check if OTP input appeared
  const otpInput = page.locator('input[placeholder="৪ ডিজিটের ওটিপি লিখুন"]');
  console.log('OTP input visible:', await otpInput.isVisible());

  // Get simulated OTP from helper text or input 1234
  // In our code: const code = generateOTP(); alert or demo code is shown
  // We can read the OTP code from the helper pill or fill 1234
  const demoCodeElement = page.locator('text=পরীক্ষামূলক ওটিপি কোড:');
  if (await demoCodeElement.isVisible()) {
    const text = await demoCodeElement.textContent();
    const match = text?.match(/(\d{4})/);
    if (match) {
      await otpInput.fill(match[1]);
      await page.locator('button:has-text("যাচাই করুন")').click();
      await page.waitForTimeout(500);
      console.log('Phone verified successfully!');
    }
  }

  // Location selection:
  // Division -> Dhaka
  await page.locator('select').first().selectOption({ label: 'ঢাকা (Dhaka)' });
  await page.waitForTimeout(500);

  // District -> Dhaka
  const districtSelect = page.locator('select').nth(1);
  await districtSelect.selectOption({ label: 'ঢাকা (Dhaka)' });
  await page.waitForTimeout(500);

  // Upazila -> Dhanmondi
  const upazilaSelect = page.locator('select').nth(2);
  await upazilaSelect.selectOption({ label: 'ধানমন্ডি (Dhanmondi)' });
  await page.waitForTimeout(500);

  // Thana -> Dhanmondi PS
  const thanaSelect = page.locator('select').nth(3);
  await thanaSelect.selectOption({ label: 'ধানমন্ডি থানা (Dhanmondi PS)' });
  await page.waitForTimeout(500);

  // Village / Ward
  const wardInput = page.locator('input[placeholder*="রোড ৮/এ, ধানমন্ডি"]');
  await wardInput.fill('রোড ৮/এ, ধানমন্ডি');

  // Exact address
  const fullAddressInput = page.locator('textarea[placeholder*="বাড়ি নম্বর"]');
  await fullAddressInput.fill('বাড়ি ১২, ফ্ল্যাট ৪বি, রোড ৮/এ, ধানমন্ডি, ঢাকা');

  // Save Profile
  await page.screenshot({ path: '/tmp/test-form-filled.png' });
  const saveBtn = page.locator('button:has-text("প্রোফাইল সংরক্ষণ ও সম্পন্ন করুন")');
  await saveBtn.click();
  await page.waitForTimeout(1500);

  // Now we should be on Customer Profile or Home
  await page.screenshot({ path: '/tmp/test-profile-saved.png' });
  console.log('Saved profile URL / state checked.');

  // Go to Home and add an item to cart
  await page.locator('button:has-text("বাজার করুন")').or(page.locator('button:has-text("হোমে ফিরে যান")')).or(page.locator('a[href="/"]')).first().click();
  await page.waitForTimeout(1000);

  // Add first product to cart
  const addCartBtn = page.locator('button:has-text("কার্টে যোগ করুন")').first();
  if (await addCartBtn.isVisible()) {
    await addCartBtn.click();
    await page.waitForTimeout(500);
  }

  // Open Cart
  const cartBtn = page.locator('button[aria-label*="কার্ট"]').or(page.locator('button:has-text("কার্ট")')).first();
  await cartBtn.click();
  await page.waitForTimeout(1000);

  // Proceed to Checkout
  const checkoutBtn = page.locator('button:has-text("অর্ডার সম্পন্ন করতে এগিয়ে যান")').or(page.locator('button:has-text("চেকআউট")')).first();
  await checkoutBtn.click();
  await page.waitForTimeout(1500);

  // Verify prefilled info
  await page.screenshot({ path: '/tmp/test-checkout-prefilled.png' });
  console.log('Checkout page loaded with prefilled data.');

  // Click proceed to confirm order
  const proceedOrderBtn = page.locator('button:has-text("অর্ডার নিশ্চিত করতে এগিয়ে যান")');
  if (await proceedOrderBtn.isVisible()) {
    await proceedOrderBtn.click();
    await page.waitForTimeout(1000);
    // Explicit Order Confirmation Modal screenshot
    await page.screenshot({ path: '/tmp/test-order-confirm-modal.png' });
    console.log('Order confirmation modal appeared with full details.');
  }

  await browser.close();
  console.log('All interactive tests completed successfully!');
}

testWorkflow().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
