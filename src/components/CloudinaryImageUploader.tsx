import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  Settings2, 
  Loader2, 
  ExternalLink,
  Camera,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';

interface CloudinaryImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
  aspectRatio?: 'square' | 'banner' | 'auto';
  className?: string;
  helperText?: string;
}

const STORAGE_KEY_CLOUD_NAME = 'hb_cloudinary_cloud_name';
const STORAGE_KEY_UPLOAD_PRESET = 'hb_cloudinary_upload_preset';

export const CloudinaryImageUploader: React.FC<CloudinaryImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  label = 'ছবি আপলোড করুন (Cloudinary Direct Upload)',
  aspectRatio = 'square',
  className = '',
  helperText = 'JPG, PNG, WebP সমর্থিত। সরাসরি ক্লাউডিনারি ক্লাউডে আপলোড হবে।',
}) => {
  // Cloudinary credentials (customizable by user or defaulted)
  const [cloudName, setCloudName] = useState(() => {
    return safeStorage.getItem(STORAGE_KEY_CLOUD_NAME) || 'haatbazar-media';
  });
  const [uploadPreset, setUploadPreset] = useState(() => {
    return safeStorage.getItem(STORAGE_KEY_UPLOAD_PRESET) || 'haatbazar_unsigned';
  });

  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveCloudinaryConfig = (newCloud: string, newPreset: string) => {
    setCloudName(newCloud);
    setUploadPreset(newPreset);
    safeStorage.setItem(STORAGE_KEY_CLOUD_NAME, newCloud);
    safeStorage.setItem(STORAGE_KEY_UPLOAD_PRESET, newPreset);
    setStatusMessage('ক্লাউডিনারি কনফিগারেশন সংরক্ষিত হয়েছে!');
    setTimeout(() => setStatusMessage(null), 3000);
    setIsConfigOpen(false);
  };

  const uploadFileToCloudinary = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন');
      return;
    }

    // Instant local preview via FileReader
    const localReader = new FileReader();
    localReader.onload = () => {
      if (typeof localReader.result === 'string') {
        setPreviewUrl(localReader.result);
      }
    };
    localReader.readAsDataURL(file);

    setIsUploading(true);
    setUploadProgress(20);
    setStatusMessage('ক্লাউডিনারিতে আপলোড হচ্ছে...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset.trim() || 'haatbazar_unsigned');

      setUploadProgress(50);

      // Attempt Direct Cloudinary REST API upload
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName.trim() || 'haatbazar-media'}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      setUploadProgress(85);

      if (response.ok) {
        const data = await response.json();
        const uploadedUrl = data.secure_url || data.url;
        setPreviewUrl(uploadedUrl);
        onImageUploaded(uploadedUrl);
        setUploadProgress(100);
        setStatusMessage('ক্লাউডিনারি ক্লাউডে সরাসরি আপলোড সম্পন্ন!');
      } else {
        // Fallback for unconfigured or restricted presets: keep base64 preview and let user continue
        console.warn('Cloudinary upload returned non-200. Using high-res data URL.');
        if (typeof localReader.result === 'string') {
          onImageUploaded(localReader.result);
        }
        setUploadProgress(100);
        setStatusMessage('ছবি প্রস্তুত (লোকাল প্রিভিউ সিঙ্ক সক্রিয়)');
      }
    } catch (err) {
      console.warn('Cloudinary upload network error, using local buffer:', err);
      if (typeof localReader.result === 'string') {
        onImageUploaded(localReader.result);
      }
      setUploadProgress(100);
      setStatusMessage('ছবি সংযুক্ত করা হয়েছে (অফলাইন মোড)');
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setStatusMessage(null);
      }, 3500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFileToCloudinary(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFileToCloudinary(file);
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrlInput.trim()) return;
    setPreviewUrl(manualUrlInput.trim());
    onImageUploaded(manualUrlInput.trim());
    setManualUrlInput('');
    setStatusMessage('ছবির লিঙ্ক সফলভাবে সেট করা হয়েছে!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const aspectClass =
    aspectRatio === 'banner'
      ? 'h-36 sm:h-44 w-full'
      : aspectRatio === 'square'
      ? 'w-32 h-32 sm:w-36 sm:h-36'
      : 'w-full h-48';

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Header with Title & Cloudinary Config Toggle */}
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
          <UploadCloud className="w-4 h-4 text-[#006B35]" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className="text-gray-400 hover:text-[#006B35] dark:hover:text-emerald-400 p-1 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
          title="Cloudinary সেটিংস পরিবর্তন করুন"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Cloudinary সেটিংস</span>
        </button>
      </div>

      {/* Cloudinary Preset Configuration Drawer */}
      {isConfigOpen && (
        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#006B35] dark:text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Cloudinary API সেটিংস
            </span>
            <button
              type="button"
              onClick={() => setIsConfigOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-600 dark:text-gray-300 font-semibold block mb-0.5">
                Cloud Name
              </label>
              <input
                type="text"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="उदा: haatbazar-media"
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-600 dark:text-gray-300 font-semibold block mb-0.5">
                Upload Preset (Unsigned)
              </label>
              <input
                type="text"
                value={uploadPreset}
                onChange={(e) => setUploadPreset(e.target.value)}
                placeholder="उदा: haatbazar_unsigned"
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => saveCloudinaryConfig(cloudName, uploadPreset)}
              className="px-3 py-1 bg-[#006B35] hover:bg-[#005228] text-white font-bold rounded-lg text-xs transition-colors"
            >
              সেটিংস সেভ করুন
            </button>
          </div>
        </div>
      )}

      {/* Main Upload Dropzone & Preview Box */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Dropzone Container */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative ${aspectClass} rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all overflow-hidden group ${
            isDragOver
              ? 'border-[#006B35] bg-emerald-50/70 dark:bg-emerald-950/40'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 hover:bg-emerald-50/40 dark:hover:bg-gray-800 hover:border-[#006B35]'
          }`}
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Uploaded preview"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white shadow-md text-xs font-bold"
                  title="নতুন ছবি নির্বাচন করুন"
                >
                  <RefreshCw className="w-4 h-4 text-[#006B35]" />
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-md text-xs font-bold"
                  title="ছবি মুছে ফেলুন"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-gray-500 dark:text-gray-400 p-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-[#006B35] dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                ছবি ড্রপ করুন বা ক্লিক করুন
              </span>
              <span className="text-[10px] text-gray-400">
                Cloudinary Direct Upload
              </span>
            </div>
          )}

          {/* Uploading Spinner Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center gap-2 text-white p-3">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-xs font-bold">আপলোড হচ্ছে {uploadProgress}%</span>
              <div className="w-3/4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & URL Input Option */}
        <div className="flex-1 w-full space-y-2 text-xs">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3.5 py-2 bg-[#006B35] hover:bg-[#005228] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>ডিভাইস থেকে ছবি আপলোড</span>
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-3 py-2 border border-rose-300 hover:bg-rose-50 text-rose-600 rounded-xl font-semibold transition-colors"
              >
                রিমুভ
              </button>
            )}
          </div>

          {/* Alternative direct URL input */}
          <form onSubmit={handleManualUrlSubmit} className="flex gap-1.5 pt-1">
            <input
              type="url"
              value={manualUrlInput}
              onChange={(e) => setManualUrlInput(e.target.value)}
              placeholder="অথবা সরাসরি ছবির ইমেজ URL লিংক পেস্ট করুন..."
              className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:border-[#006B35] outline-hidden"
            />
            <button
              type="submit"
              disabled={!manualUrlInput.trim()}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold transition-colors disabled:opacity-40"
            >
              সেট করুন
            </button>
          </form>

          {/* Helper or Status message */}
          {statusMessage ? (
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          ) : (
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{helperText}</p>
          )}
        </div>
      </div>
    </div>
  );
};
