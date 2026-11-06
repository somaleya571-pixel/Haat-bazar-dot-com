import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface SearchableDropdownProps {
  label: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  placeholder = 'নির্বাচন করুন...',
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options independently
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative space-y-1" ref={dropdownRef}>
      <label className="block text-xs font-bold text-gray-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {/* Button trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            setSearchTerm('');
          }
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs text-left transition-all bg-white ${
          disabled
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : error
            ? 'border-rose-400 ring-2 ring-rose-100'
            : isOpen
            ? 'border-[#007A3D] ring-2 ring-emerald-100'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <span className={value ? 'font-bold text-gray-900' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}

      {/* Dropdown panel */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Independent Search input */}
          <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="সার্চ করুন..."
              autoFocus
              className="w-full text-xs bg-transparent border-none outline-hidden focus:ring-0 text-gray-800"
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-48 divide-y divide-gray-50">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-gray-400">
                কোনো অপশন খুঁজে পাওয়া যায়নি
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt === value;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-emerald-50 transition-colors ${
                      isSelected ? 'bg-emerald-50 font-bold text-[#007A3D]' : 'text-gray-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#007A3D]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
