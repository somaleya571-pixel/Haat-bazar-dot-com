import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { BrandLogo } from '../../components/BrandLogo';
import { 
  Globe, 
  Image as ImageIcon, 
  Megaphone, 
  FileText, 
  Save, 
  CheckCircle,
  Truck
} from 'lucide-react';
import { CloudinaryImageUploader } from '../../components/CloudinaryImageUploader';
import { FormFooter } from '../../components/FormFooter';

export const AdminWebsitePage: React.FC = () => {
  const { websiteSettings, updateWebsiteSettings, showToast } = useShop();

  const [activeTab, setActiveTab] = useState<'branding' | 'announcement' | 'banners' | 'policies'>('branding');

  // Branding
  const [logoUrl, setLogoUrl] = useState(websiteSettings.logoUrl);
  const [footerNotice, setFooterNotice] = useState(websiteSettings.footerNotice);
  const isBrandingDirty = logoUrl !== websiteSettings.logoUrl || footerNotice !== websiteSettings.footerNotice;
  const handleClearBranding = () => {
    setLogoUrl(websiteSettings.logoUrl);
    setFooterNotice(websiteSettings.footerNotice);
    showToast('ব্র্যান্ডিং সেটিংস রিসেট করা হয়েছে');
  };

  // Announcement
  const [announcementActive, setAnnouncementActive] = useState(websiteSettings.announcementActive);
  const [announcementText, setAnnouncementText] = useState(websiteSettings.announcementText);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(websiteSettings.freeDeliveryThreshold);
  const isAnnouncementDirty =
    announcementActive !== websiteSettings.announcementActive ||
    announcementText !== websiteSettings.announcementText ||
    Number(freeDeliveryThreshold) !== Number(websiteSettings.freeDeliveryThreshold);
  const handleClearAnnouncement = () => {
    setAnnouncementActive(websiteSettings.announcementActive);
    setAnnouncementText(websiteSettings.announcementText);
    setFreeDeliveryThreshold(websiteSettings.freeDeliveryThreshold);
    showToast('অ্যানাউন্সমেন্ট সেটিংস রিসেট করা হয়েছে');
  };

  // Banners
  const [heroBannerUrl, setHeroBannerUrl] = useState(websiteSettings.heroBannerUrl);
  const isBannerDirty = heroBannerUrl !== websiteSettings.heroBannerUrl;
  const handleClearBanner = () => {
    setHeroBannerUrl(websiteSettings.heroBannerUrl);
    showToast('ব্যানার সেটিংস রিসেট করা হয়েছে');
  };

  // Policies
  const [termsContent, setTermsContent] = useState(websiteSettings.termsContent);
  const [privacyContent, setPrivacyContent] = useState(websiteSettings.privacyContent);
  const isPoliciesDirty =
    termsContent !== websiteSettings.termsContent ||
    privacyContent !== websiteSettings.privacyContent;
  const handleClearPolicies = () => {
    setTermsContent(websiteSettings.termsContent);
    setPrivacyContent(websiteSettings.privacyContent);
    showToast('পলিসি সেটিংস রিসেট করা হয়েছে');
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteSettings({
      logoUrl,
      footerNotice
    });
    showToast('Branding and logo settings saved! Customer panel updated.');
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteSettings({
      announcementActive,
      announcementText,
      freeDeliveryThreshold: Number(freeDeliveryThreshold)
    });
    showToast('Announcement ticker settings saved!');
  };

  const handleSaveBanners = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteSettings({ heroBannerUrl });
    showToast('Hero banner updated!');
  };

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteSettings({
      termsContent,
      privacyContent
    });
    showToast('Legal terms & privacy guidelines saved!');
  };

  return (
    <div className="space-y-6 viewport-padding-safe pb-28 sm:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#17231B] flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#006B35]" />
            Website & Content Management
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Manage your official replaceable logo, homepage hero banners, live announcement bar, and policies.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 flex-wrap">
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'branding'
              ? 'bg-[#006B35] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Logo & Branding Identity
        </button>
        <button
          onClick={() => setActiveTab('announcement')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'announcement'
              ? 'bg-[#006B35] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Announcement Bar & Free Delivery
        </button>
        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'banners'
              ? 'bg-[#006B35] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          Homepage Hero Banner
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'policies'
              ? 'bg-[#006B35] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Returns & Legal Policies
        </button>
      </div>

      {/* Tab 1: Branding & Replaceable Logo */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="font-bold text-[#17231B] text-base">Replaceable Logo Component</h2>
              <p className="text-xs text-slate-500 mt-1">
                The logo component is fully decoupled and dynamic. Enter any uploaded image URL or keep default official Haat Bazar identity.
              </p>
            </div>

            {/* Live Preview Box */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Live Logo Preview (Header & Navigation):
                </span>
                <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block shadow-xs">
                  <BrandLogo size="lg" showSlogan={true} />
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1 max-w-sm">
                <div className="flex items-center gap-1.5 font-bold text-[#006B35]">
                  <CheckCircle className="w-4 h-4" /> Synchronized Across All Pages
                </div>
                <p>
                  Any updates here immediately take effect on the customer storefront header, navigation drawer, admin panel sidebar, and invoice printouts.
                </p>
              </div>
            </div>

            {/* Cloudinary Direct Logo Uploader */}
            <div className="pt-2">
              <CloudinaryImageUploader
                label="অফিশিয়াল লোগো আপলোড (Cloudinary Direct Upload)"
                currentImageUrl={logoUrl}
                onImageUploaded={(url) => setLogoUrl(url)}
                aspectRatio="square"
                helperText="সরাসরি Cloudinary ক্লাউডে হাট বাজারের নতুন লোগো আপলোড করুন।"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-1">
                  Logo Asset URL / Path
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/assets/official_haat_bazar_logo.png"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#006B35]"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setLogoUrl('/assets/haat_bazar_official_logo.png')}
                    className="text-[11px] text-[#006B35] font-semibold hover:underline cursor-pointer"
                  >
                    Reset to Official Logo
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => setLogoUrl('/assets/aistudio/Bangladeshi_Marketplace_Grocery_Banner_af4d101b.png')}
                    className="text-[11px] text-[#006B35] font-semibold hover:underline cursor-pointer"
                  >
                    Use Full Banner Header
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-1">
                  Footer Brand Notice
                </label>
                <input
                  type="text"
                  value={footerNotice}
                  onChange={(e) => setFooterNotice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
                />
              </div>
            </div>

            {/* Dynamic Form Footer */}
            <FormFooter
              onClear={handleClearBranding}
              isDirty={isBrandingDirty}
              saveText="ব্র্যান্ড ও লোগো সংরক্ষণ করুন (Save)"
              clearText="রিসেট করুন (Clear)"
            />
          </div>
        </form>
      )}

      {/* Tab 2: Announcement & Threshold */}
      {activeTab === 'announcement' && (
        <form onSubmit={handleSaveAnnouncement} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-[#17231B] text-base">Top Announcement Bar</h2>
              <p className="text-xs text-slate-500">
                Display promo ticker at the very top of the customer storefront.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-semibold text-slate-600">
                {announcementActive ? 'Active' : 'Hidden'}
              </span>
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="w-5 h-5 accent-[#006B35] rounded"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Announcement Text (Bengali / English)
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Free Delivery Order Threshold (৳)
              </label>
              <input
                type="number"
                min="0"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Orders with cart subtotal higher than this amount qualify for 100% free delivery.
              </p>
            </div>
          </div>

          {/* Dynamic Form Footer */}
          <FormFooter
            onClear={handleClearAnnouncement}
            isDirty={isAnnouncementDirty}
            saveText="অ্যানাউন্সমেন্ট সংরক্ষণ করুন (Save)"
            clearText="রিসেট করুন (Clear)"
          />
        </form>
      )}

      {/* Tab 3: Banners */}
      {activeTab === 'banners' && (
        <form onSubmit={handleSaveBanners} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm space-y-6">
          <div>
            <h2 className="font-bold text-[#17231B] dark:text-white text-base">Homepage Hero Banner</h2>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Control the main hero banner displayed on the customer landing page.
            </p>
          </div>

          {/* Cloudinary Direct Banner Upload */}
          <div className="pt-1">
            <CloudinaryImageUploader
              label="হিরো ব্যানার আপলোড (Cloudinary Direct Banner Upload)"
              currentImageUrl={heroBannerUrl}
              onImageUploaded={(url) => setHeroBannerUrl(url)}
              aspectRatio="banner"
              helperText="সরাসরি Cloudinary ক্লাউডে হোমপেজের প্রশস্ত হিরো ব্যানার আপলোড করুন।"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-1">Hero Banner Image URL</label>
            <input
              type="text"
              value={heroBannerUrl}
              onChange={(e) => setHeroBannerUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
            />
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-700 shadow-2xs">
            <img src={heroBannerUrl} alt="Hero Banner" className="w-full h-48 sm:h-64 object-cover" />
          </div>

          {/* Dynamic Form Footer */}
          <FormFooter
            onClear={handleClearBanner}
            isDirty={isBannerDirty}
            saveText="ব্যানার আপডেট করুন (Save Banner)"
            clearText="রিসেট করুন (Clear)"
          />
        </form>
      )}

      {/* Tab 4: Policies */}
      {activeTab === 'policies' && (
        <form onSubmit={handleSavePolicies} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm space-y-6">
          <div>
            <h2 className="font-bold text-[#17231B] dark:text-white text-base">Legal Policies & Terms of Service</h2>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Define customer satisfaction policies, terms of service, and privacy notices.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-1">Terms & Conditions Content</label>
            <textarea
              rows={5}
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-1">Privacy Policy Notice Content</label>
            <textarea
              rows={5}
              value={privacyContent}
              onChange={(e) => setPrivacyContent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
            />
          </div>

          {/* Dynamic Form Footer */}
          <FormFooter
            onClear={handleClearPolicies}
            isDirty={isPoliciesDirty}
            saveText="পলিসি সংরক্ষণ করুন (Save Policies)"
            clearText="রিসেট করুন (Clear)"
          />
        </form>
      )}
    </div>
  );
};
