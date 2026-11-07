import React from 'react';
import { Save, RotateCcw, Check, Loader2, Sparkles } from 'lucide-react';

interface FormFooterProps {
  onSave?: () => void;
  onClear: () => void;
  isDirty: boolean;
  isSubmitting?: boolean;
  saveText?: string;
  clearText?: string;
  saveDisabled?: boolean;
  clearDisabled?: boolean;
  className?: string;
  saveButtonType?: 'submit' | 'button';
  extraLeftContent?: React.ReactNode;
}

export const FormFooter: React.FC<FormFooterProps> = ({
  onSave,
  onClear,
  isDirty,
  isSubmitting = false,
  saveText = 'সংরক্ষণ করুন (Save)',
  clearText = 'রিসেট / মুছে ফেলুন (Clear)',
  saveDisabled = false,
  clearDisabled = false,
  className = '',
  saveButtonType = 'submit',
  extraLeftContent,
}) => {
  const handleClearClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clearDisabled || isSubmitting) return;
    onClear();
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    if (saveButtonType === 'button' && onSave) {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <div
      className={`pt-5 pb-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}
    >
      {/* Left side content (e.g. dirty status or custom message) */}
      <div className="flex items-center gap-2 text-xs">
        {extraLeftContent ? (
          extraLeftContent
        ) : (
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            {isDirty ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-800 animate-pulse">
                <Sparkles className="w-3 h-3" />
                অসংরক্ষিত পরিবর্তন রয়েছে (Unsaved Changes)
              </span>
            ) : (
              <span className="text-[11px] text-gray-400">
                তথ্য হালনাগাদ রয়েছে (Up to date)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right side distinct Save and Clear actions that activate dynamically */}
      <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
        {/* Distinct Clear Button: Activates dynamically when form has inputs or is dirty */}
        <button
          type="button"
          onClick={handleClearClick}
          disabled={clearDisabled || isSubmitting || !isDirty}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            isDirty && !clearDisabled && !isSubmitting
              ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 shadow-2xs'
              : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-60'
          }`}
          title={isDirty ? 'ফর্মের সকল তথ্য রিসেট করুন' : 'কোনো পরিবর্তন নেই'}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isDirty ? 'text-gray-500 dark:text-gray-400' : ''}`} />
          <span>{clearText}</span>
        </button>

        {/* Distinct Save Button: High-visibility emerald button with dynamic pulse when dirty */}
        <button
          type={saveButtonType}
          onClick={handleSaveClick}
          disabled={saveDisabled || isSubmitting || !isDirty}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
            isDirty && !saveDisabled && !isSubmitting
              ? 'bg-[#006B35] hover:bg-[#005228] text-white shadow-md hover:shadow-lg active:scale-98 ring-2 ring-emerald-400/40'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>সংরক্ষণ হচ্ছে...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saveText}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
