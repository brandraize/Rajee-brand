'use client';

import Link from 'next/link';
import { Upload, ArrowLeft, X, RotateCcw, CheckCircle } from 'lucide-react';
import { useStorageUpload } from '../../../../../hooks/useStorageUpload';
import { auth } from '../../../../../configuration/firebase-config';
import { useToast } from '../../../../../hooks/use-toast.js';
import { useRouter } from 'next/navigation';
import { usePostWizard } from '../../layout';
import { useLanguage } from '../../../../context/LanguageContext';
import { useEffect } from 'react';

export default function ImagesPage() {
  const upload = useStorageUpload();
  const { setImages } = usePostWizard();
  const { toast } = useToast();
  const router = useRouter();
  const { isRTL } = useLanguage();

  useEffect(() => {
    const successfulUploads = upload.items.filter(item => item.status === 'success' && item.url);
    if (successfulUploads.length > 0) {
      const urls = successfulUploads.map(item => item.url);
      setImages(urls);
    }
  }, [upload.items, setImages]);
  const ensureAuth = () => {
    const current = auth.currentUser;
    if (!current) {
      toast({ title: 'Login required', description: 'Please login to upload images', variant: 'destructive' });
      router.push('/auth/login');
      return false;
    }
    return true;
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length) {
      if (!ensureAuth()) return;

      const fileArray = Array.from(files);
      upload.addFiles(fileArray);

      await upload.startUpload();
    }
  };
  const prevent = (e) => e.preventDefault();
  const handleSelect = async (e) => {
    if (e.target.files && e.target.files.length) {
      if (!ensureAuth()) return;

      const files = Array.from(e.target.files);
      upload.addFiles(files);

      await upload.startUpload();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-green-600">{isRTL ? 'اختر النوع' : 'Select Type'}</span>
            </div>
            <div className="w-8 h-0.5 bg-green-500"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-green-600">{isRTL ? 'الرسوم' : 'Fees'}</span>
            </div>
            <div className="w-8 h-0.5 bg-green-500"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-green-600">{isRTL ? 'الموقع' : 'Location'}</span>
            </div>
            <div className="w-8 h-0.5 bg-green-500"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
              <span className="text-sm font-medium text-blue-600">{isRTL ? 'الصور' : 'Images'}</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">5</div>
              <span className="text-sm font-medium text-gray-500">{isRTL ? 'التفاصيل' : 'Details'}</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'رفع الصور' : 'Upload Images'}
          </h1>
          <p className={`text-lg text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'ارفع صور منتجاتك (الحد الأدنى 3 صور)' : 'Upload images of your products (minimum 3 images)'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/seller/add-listing/city')} className="text-gray-600 hover:text-gray-800"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-2xl font-semibold">{isRTL ? 'رفع الصور' : 'Upload Images'}</h2>
            </div>
            {upload.items.length > 0 && (
              <button
                onClick={() => {
                  upload.reset();
                  setImages([]);
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                {isRTL ? 'مسح الكل' : 'Clear All'}
              </button>
            )}
          </div>

      <div className="bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded-lg inline-flex items-center">
        <span>{isRTL ? 'الصورة الأولى ستكون صورة الإعلان الرئيسية' : 'The first image will be used as the post thumbnail and main preview'}</span>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={prevent}
        onDragEnter={prevent}
        className="border-2 border-dashed border-gray-300 rounded-xl min-h-[160px] flex flex-col items-center justify-center text-gray-500"
      >
        <Upload className="w-6 h-6 text-blue-500 mb-2" />
        <div className="mb-3">{isRTL ? 'اسحب وأفلت الصور هنا' : 'Drag and drop'}</div>

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
            {isRTL ? 'اختر صورة واحدة' : 'Choose Single Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSelect}
              disabled={upload.items.some(item => item.status === 'uploading')}
            />
          </label>

          <label className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600">
            {isRTL ? 'اختر عدة صور' : 'Choose Multiple Images'}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleSelect}
              disabled={upload.items.some(item => item.status === 'uploading')}
            />
          </label>
        </div>

        <div className="text-xs text-gray-400 mt-2 text-center">
          {isRTL ? 'image/jpeg, image/png, image/webp حتى 10 ميجابايت لكل صورة (حد أقصى 100 صورة)' : 'image/jpeg, image/png, image/webp up to 10MB each (max 100 files)'}
        </div>
      </div>

      {/* Upload Status */}
      {upload.items.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                {isRTL
                  ? `تم رفع ${upload.items.filter(item => item.status === 'success').length} من ${upload.items.length} صورة`
                  : `Uploaded ${upload.items.filter(item => item.status === 'success').length} of ${upload.items.length} images`
                }
              </span>
            </div>
            {upload.items.some(item => item.status === 'uploading') && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700">
                  {isRTL ? 'جارٍ الرفع...' : 'Uploading...'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {upload.items.map((it)=> (
          <div key={it.id} className="border rounded-lg overflow-hidden bg-gray-50">
            <div className="relative h-28 flex items-center justify-center">
              {it.url ? (
                <img src={it.url} alt="img" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">{Math.round(it.progress)}%</div>
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <button
                onClick={() => upload.removeItem(it.id)}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-gray-700 hover:text-red-600"
                disabled={it.status === 'uploading'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {it.status !== 'success' && (
              <div className="h-1 bg-gray-200">
                <div className="h-1 bg-blue-500 transition-all duration-300" style={{ width: `${it.progress}%` }} />
              </div>
            )}
            {it.status === 'error' && (
              <button onClick={async ()=> { await upload.startUpload(); }} className="w-full text-xs text-red-600 py-1 flex items-center justify-center gap-1">
                <RotateCcw className="w-3 h-3" /> {isRTL ? 'إعادة المحاولة' : 'Retry'}
              </button>
            )}
          </div>
        ))}
      </div>

          <div className="flex items-center justify-end pt-2">
            <Link href={upload.urls.length >= 3 ? '/seller/add-listing/details' : '#'} className={`px-6 py-3 rounded-lg text-white font-medium ${upload.urls.length >= 3 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}>
              {isRTL ? 'متابعة' : 'Continue'} »
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


