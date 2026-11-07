import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  Laptop,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BrandLogo } from '../../components/BrandLogo';
import {
  MASTER_ADMIN_PASSWORD,
  AUTHORIZED_SUPER_ADMIN_EMAILS,
} from '../../utils/session';

interface AdminLoginPageProps {
  conflictReason?: string | null;
  onClearConflict?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  conflictReason,
  onClearConflict,
}) => {
  const { loginAdmin, navigateTo } = useShop();

  const [email, setEmail] = useState<string>('tanzilahammed130@gmail.com');
  const [password, setPassword] = useState<string>(MASTER_ADMIN_PASSWORD);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rate Limiting / Lockout protection
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutSeconds > 0) {
      timer = setTimeout(() => {
        setLockoutSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [lockoutSeconds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setIsLoading(true);
    setErrorMessage(null);

    // Simulate cryptographic verification delay for security
    setTimeout(() => {
      const result = loginAdmin(email, password, 'Super Admin');
      if (result.success) {
        if (onClearConflict) onClearConflict();
      } else {
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        if (attempts >= 5) {
          setLockoutSeconds(30);
          setErrorMessage(
            'অতিরিক্ত ব্যর্থ চেষ্টার কারণে সুরক্ষা লক সক্রিয় হয়েছে। অনুগ্রহ করে ৩০ সেকেন্ড অপেক্ষা করুন।'
          );
        } else {
          setErrorMessage(
            result.error ||
              `ভুল ক্রেডেনশিয়াল! (অবশিষ্ট সুযোগ: ${5 - attempts} বার)`
          );
        }
      }
      setIsLoading(false);
    }, 400);
  };

  const handleReturnToStore = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-[#0B1E13] to-[#040C07] text-white flex flex-col justify-between p-4 sm:p-6 selection:bg-emerald-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/15">
            <BrandLogo variant="admin" size="sm" />
          </div>
          <div className="hidden sm:block">
            <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase block">
              Haat Bazar Core Management
            </span>
            <span className="text-xs text-slate-300 font-medium">
              সুপার অ্যাডমিন ও ওনার গেটওয়ে
            </span>
          </div>
        </div>

        <button
          onClick={handleReturnToStore}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white rounded-xl text-xs font-semibold backdrop-blur-md border border-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>গ্রাহক মার্কেটপ্লেসে ফিরুন</span>
        </button>
      </header>

      {/* Main Login Box */}
      <main className="max-w-md w-full mx-auto my-8">
        {/* Previous Session Invalidation Alert (Single Session Conflict) */}
        {conflictReason && (
          <div className="mb-6 bg-rose-950/80 border-2 border-rose-500/80 rounded-2xl p-4.5 text-rose-100 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/30 flex items-center justify-center shrink-0 mt-0.5 border border-rose-400/50">
                <AlertTriangle className="w-4 h-4 text-rose-300 animate-pulse" />
              </div>
              <div className="flex-1 text-xs">
                <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                  <span>সেশন সমাপ্তকরণ বিজ্ঞপ্তি (Session Terminated)</span>
                  <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-mono uppercase">
                    Security Policy
                  </span>
                </h4>
                <p className="text-rose-200/90 leading-relaxed">
                  {conflictReason}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-rose-500/30 text-rose-300">
                  <span>পুনরায় সংযোগ নিতে নিচে আবার লগইন করুন।</span>
                  {onClearConflict && (
                    <button
                      onClick={onClearConflict}
                      className="hover:underline font-bold cursor-pointer"
                    >
                      বিজ্ঞপ্তি বন্ধ করুন
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/95 dark:bg-slate-900/95 text-gray-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 backdrop-blur-xl relative overflow-hidden">
          {/* Decorative Security Watermark */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-600 mb-3 shadow-sm">
              <ShieldCheck className="w-7 h-7 text-[#006B35] dark:text-emerald-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              সুপার অ্যাডমিন লগইন
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              প্রাইভেট রুট: <code className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-mono font-bold">/owner</code>
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-[#006B35] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>একক-সেশন সুরক্ষা সক্রিয় (Strict Single-Session)</span>
            </div>
          </div>

          {/* Form Error Banner */}
          {errorMessage && (
            <div className="mb-5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl p-3 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                সুপার অ্যাডমিন ইমেইল / ইউজার আইডি
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tanzilahammed130@gmail.com"
                  required
                  disabled={lockoutSeconds > 0 || isLoading}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006B35] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              {/* Quick account selector chips */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-[10px]">
                <span className="text-gray-400 dark:text-gray-500 shrink-0">
                  অনুমোদিত অ্যাকাউন্ট:
                </span>
                {AUTHORIZED_SUPER_ADMIN_EMAILS.slice(0, 2).map((acc) => (
                  <button
                    key={acc}
                    type="button"
                    onClick={() => setEmail(acc)}
                    className={`px-2 py-0.5 rounded-md border text-[10px] font-mono transition-all cursor-pointer ${
                      email === acc
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300 font-bold'
                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-emerald-300'
                    }`}
                  >
                    {acc.split('@')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  অ্যাডমিন মাস্টার সিকিউরিটি কী (Password)
                </label>
                <button
                  type="button"
                  onClick={() => setPassword(MASTER_ADMIN_PASSWORD)}
                  className="text-[10px] text-[#006B35] dark:text-emerald-400 hover:underline font-bold cursor-pointer"
                >
                  মাস্টার পাসওয়ার্ড বসান
                </button>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="অ্যাডমিন সিকিউরিটি পাসওয়ার্ড"
                  required
                  disabled={lockoutSeconds > 0 || isLoading}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006B35] focus:border-transparent transition-all disabled:opacity-50 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড প্রদর্শন করুন'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || lockoutSeconds > 0}
              className="w-full py-3 bg-[#006B35] hover:bg-[#005229] active:scale-98 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>সেশন ভেরিফাই ও ইনিশিয়ালাইজ হচ্ছে...</span>
                </>
              ) : lockoutSeconds > 0 ? (
                <>
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>লকড: {lockoutSeconds} সেকেন্ড অপেক্ষা করুন</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>সুপার অ্যাডমিন হিসেবে প্রবেশ করুন (Enter Panel)</span>
                </>
              )}
            </button>
          </form>

          {/* Single Session Policy Explanation */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800 space-y-2">
            <h3 className="text-[11px] font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-emerald-600" />
              <span>একক সক্রিয় সেশন নীতি (Single-Session Architecture):</span>
            </h3>
            <ul className="text-[10px] text-gray-500 dark:text-gray-400 space-y-1 list-disc pl-4 leading-relaxed">
              <li>
                যেকোনো মুহূর্তে শুধুমাত্র <strong>একটি বৈধ সেশন</strong> সক্রিয় থাকবে।
              </li>
              <li>
                অন্য কোনো ব্রাউজার, ট্যাব বা নতুন ডিভাইস থেকে লগইন করা হলে তৎক্ষণাৎ পূর্বের সেশন <strong>টার্মিনেট</strong> হবে।
              </li>
              <li>
                অননুমোদিত কোনো ইউজার এই প্যানেলের ডেটা বা ব্যাকএন্ডে প্রবেশ করতে পারবে না।
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-[11px] py-2">
        <p>
          Haat Bazar (.com) — Bangladesh E-Commerce Central Owner Terminal. Secure Enterprise Access.
        </p>
      </footer>
    </div>
  );
};
