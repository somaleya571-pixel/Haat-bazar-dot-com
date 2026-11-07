import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  UserCheck, 
  Shield, 
  Key, 
  Mail, 
  Phone, 
  CheckCircle, 
  LogOut, 
  Save, 
  Lock,
  Award
} from 'lucide-react';
import { CloudinaryImageUploader } from '../../components/CloudinaryImageUploader';
import { FormFooter } from '../../components/FormFooter';

export const AdminProfilePage: React.FC = () => {
  const { adminProfile, updateAdminProfile, logoutAdmin, showToast, navigateTo } = useShop();

  const [name, setName] = useState(adminProfile.name);
  const [email, setEmail] = useState(adminProfile.email);
  const [phone, setPhone] = useState(adminProfile.phone);
  const [bio, setBio] = useState(adminProfile.bio);
  const [avatar, setAvatar] = useState(adminProfile.avatar);
  const [isOnline, setIsOnline] = useState(adminProfile.status === 'Online');

  // Track dynamic isDirty state for Save/Clear buttons
  const isDirty =
    name !== adminProfile.name ||
    email !== adminProfile.email ||
    phone !== adminProfile.phone ||
    bio !== adminProfile.bio ||
    avatar !== adminProfile.avatar ||
    isOnline !== (adminProfile.status === 'Online');

  const handleClearProfile = () => {
    setName(adminProfile.name);
    setEmail(adminProfile.email);
    setPhone(adminProfile.phone);
    setBio(adminProfile.bio);
    setAvatar(adminProfile.avatar);
    setIsOnline(adminProfile.status === 'Online');
    showToast('প্রোফাইল ফর্মের পরিবর্তনসমূহ রিসেট করা হয়েছে');
  };

  // Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({
      name,
      email,
      phone,
      bio,
      avatar,
      status: isOnline ? 'Online' : 'Offline',
    });
    showToast('Administrator profile details updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.');
      return;
    }
    showToast('Admin password changed successfully!');
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    logoutAdmin();
    navigateTo('home');
  };

  const permissionsMatrix = [
    { module: 'Dashboard Statistics', superAdmin: true, orderManager: true, productManager: true, supportSpecialist: false },
    { module: 'Product Catalog & Pricing', superAdmin: true, orderManager: false, productManager: true, supportSpecialist: false },
    { module: 'Order Processing & Status', superAdmin: true, orderManager: true, productManager: false, supportSpecialist: true },
    { module: 'Courier Assignment & Rates', superAdmin: true, orderManager: true, productManager: false, supportSpecialist: false },
    { module: 'Customer Management & Bans', superAdmin: true, orderManager: false, productManager: false, supportSpecialist: false },
    { module: 'Coupon Code Creation', superAdmin: true, orderManager: false, productManager: true, supportSpecialist: false },
    { module: 'Sales Financial Reports', superAdmin: true, orderManager: false, productManager: false, supportSpecialist: false },
    { module: 'bKash / Nagad System Setup', superAdmin: true, orderManager: false, productManager: false, supportSpecialist: false },
    { module: 'Support Tickets & Helpdesk', superAdmin: true, orderManager: true, productManager: false, supportSpecialist: true },
  ];

  return (
    <div className="space-y-6 viewport-padding-safe pb-24 sm:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#17231B] flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#006B35]" />
            Admin Profile & Access Control
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Manage your credentials, security access level, and active session status.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-sm transition-colors border border-rose-200"
        >
          <LogOut className="w-4 h-4" />
          End Session & Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-emerald-100 shadow-sm mx-auto"
              />
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>
            <h2 className="text-xl font-bold text-[#17231B] mt-3">{name}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F7EC] text-[#006B35] border border-emerald-300 mt-1">
              <Shield className="w-3.5 h-3.5" /> {adminProfile.role}
            </div>
            <p className="text-xs text-slate-500 mt-2 italic max-w-xs mx-auto">
              "{bio}"
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" /> Email:
              </span>
              <span className="font-semibold text-slate-900">{email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" /> Phone:
              </span>
              <span className="font-semibold text-slate-900">{phone}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-slate-400" /> Status:
              </span>
              <span className={`font-bold ${isOnline ? 'text-emerald-700' : 'text-slate-500'}`}>
                {isOnline ? 'Online (Available)' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            >
              <Key className="w-4 h-4 text-slate-500" /> Change Security Password
            </button>
          </div>
        </div>

        {/* Right Column: Edit Profile & Permissions */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-[#17231B] text-base border-b border-slate-100 pb-3">
              Edit Account Credentials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
                />
              </div>
            </div>

            {/* Cloudinary Direct Image Upload for Admin Profile */}
            <div className="pt-1">
              <CloudinaryImageUploader
                label="অ্যাডমিন প্রোফাইল ছবি (Cloudinary Direct Upload)"
                currentImageUrl={avatar}
                onImageUploaded={(url) => setAvatar(url)}
                aspectRatio="square"
                helperText="সরাসরি Cloudinary ক্লাউডে ছবি আপলোড করুন অথবা ক্যামেরা/ফাইল সিলেক্ট করুন।"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-1">Bio / Role Description</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isOnlineCheckbox"
                checked={isOnline}
                onChange={(e) => setIsOnline(e.target.checked)}
                className="w-4 h-4 accent-[#006B35] rounded cursor-pointer"
              />
              <label htmlFor="isOnlineCheckbox" className="text-xs font-semibold text-slate-700 dark:text-gray-300 cursor-pointer">
                অপারেটর ড্যাশবোর্ডে অনলাইন (Online) হিসেবে প্রদর্শন করুন
              </label>
            </div>

            {/* Redesigned Form Footer with Dynamically Activated Save & Clear Buttons */}
            <FormFooter
              onClear={handleClearProfile}
              isDirty={isDirty}
              saveText="প্রোফাইল সংরক্ষণ করুন (Save)"
              clearText="রিসেট করুন (Clear)"
            />
          </form>

          {/* Permissions Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#17231B] text-sm">Role-Based Access Control (RBAC) Matrix</h3>
                <p className="text-xs text-slate-500">Security permissions for administrative roles in Haat Bazar</p>
              </div>
              <span className="text-xs font-mono font-bold bg-[#E8F7EC] text-[#006B35] px-2.5 py-1 rounded-lg">
                Your Role: {adminProfile.role}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">System Capability</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Super Admin</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Order Mgr</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Product Mgr</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {permissionsMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{item.module}</td>
                      <td className="py-2.5 px-3 text-center">
                        {item.superAdmin ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {item.orderManager ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {item.productManager ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {item.supportSpecialist ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-[#17231B] text-sm flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#006B35]" /> Change Password
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B35] text-white rounded-lg text-xs font-bold"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
