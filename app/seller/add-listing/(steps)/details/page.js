'use client';

import { useRouter } from 'next/navigation';
import { usePostWizard } from '../../layout';
import { useLanguage } from '../../../../context/LanguageContext';
import { usePostForm } from '../../../../../hooks/usePostForm';
import { useAuth } from '../../../../../hooks/useAuth';
import { useToast } from '../../../../../hooks/use-toast.js';
import { ArrowLeft, CheckCircle, Plus, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const CONDITIONS = [
  { value: 'new', label: { en: 'New', ar: 'جديد' } },
  { value: 'like-new', label: { en: 'Like New', ar: 'جديد تقريباً' } },
  { value: 'excellent', label: { en: 'Excellent', ar: 'ممتاز' } },
  { value: 'good', label: { en: 'Good', ar: 'جيد' } },
  { value: 'fair', label: { en: 'Fair', ar: 'مقبول' } },
];

const CATEGORIES = [
  { value: 'electrical-tools', label: { en: 'Electrical Tools', ar: 'الأدوات الكهربائية' } },
  { value: 'construction-equipment', label: { en: 'Construction Equipment', ar: 'معدات البناء' } },
  { value: 'iron-tools', label: { en: 'Iron Tools', ar: 'الأدوات الحديدية' } },
  { value: 'plastic-tools', label: { en: 'Plastic Tools', ar: 'الأدوات البلاستيكية' } },
  { value: 'old-electronics', label: { en: 'Old Electronics', ar: 'الإلكترونيات المستعملة' } },
  { value: 'fashion', label: { en: 'Fashion', ar: 'أزياء' } },
  { value: 'furniture', label: { en: 'Furniture', ar: 'أثاث' } },
  { value: 'cars', label: { en: 'Cars', ar: 'سيارات' } },
];

export default function DetailsPage() {
  const { type, province, city, images, agreed } = usePostWizard();
  const { isRTL } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
const [showDraftPrompt, setShowDraftPrompt] = useState(false);
useEffect(() => {
  const draft = localStorage.getItem('listingDraft');
  if (draft) {
    setShowDraftPrompt(true); // Show prompt instead of loading immediately
  }
}, []);
const loadDraft = () => {
  const draft = localStorage.getItem('listingDraft');
  if (draft) {
    try {
      setState(JSON.parse(draft));
    } catch {
      localStorage.removeItem('listingDraft');
    }
  }
  setShowDraftPrompt(false);
};

const discardDraft = () => {
  localStorage.removeItem('listingDraft');
  setShowDraftPrompt(false);
};

  const {
    state,
    setState,
    addProduct,
    updateProduct,
    removeProduct,
    canSubmit,
    submit,
    setImages,
    submitting,
    MIN_PRODUCTS,
    MIN_IMAGES,
  } = usePostForm();

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem('listingDraft');
    if (draft) {
      try {
        setState(JSON.parse(draft));
      } catch {
        localStorage.removeItem('listingDraft');
      }
    }
  }, [setState]);

  // Set images from wizard and default category
  useEffect(() => {
    if (images && images.length > 0) {
      setImages(images);
    }

    if (type && !state.category) {
      setState(prev => ({ ...prev, category: type }));
    }

    if (city && !state.location) {
      setState(prev => ({ ...prev, location: city.name.en} ));
    }
  }, [images, setImages, type, state.category, city, state.location, setState]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'تسجيل الدخول مطلوب',
        description: 'يجب تسجيل الدخول أولاً',
        variant: 'destructive',
      });
      return;
    }

    const result = await submit(selectedFiles);

    if (result?.success) {
      setSelectedFiles([]);
      localStorage.removeItem('listingDraft');
      if (result.redirect) {
        router.push(result.redirect);
      }
    }
  };

  const handleBack = () => {
    router.push('/seller/add-listing/images');
  };
  {/*   const handlePremiumPurchase = () => {
    setShowPremiumModal(false);
    toast({
      title: isRTL ? 'تم شراء الباقة' : 'Package Purchased',
      description: isRTL ? 'يمكنك الآن نشر إعلانك المميز' : 'You can now publish your premium listing',
    });
    // Integrate with payment/premium API here
  }; */}

 

  const handleSaveDraft = () => {
    localStorage.setItem('listingDraft', JSON.stringify(state));
    toast({
      title: isRTL ? 'تم الحفظ كمسودة' : 'Saved as Draft',
      description: isRTL ? 'يمكنك المتابعة لاحقاً' : 'You can continue later',
    });
  };

 const handleDelete = () => {
  // Clear state
  setState({
    title: '',
    description: '',
    price: '',
    category: '',
    products: [],
    location: '',
  });
  setSelectedFiles([]);

  // Remove saved draft
  localStorage.removeItem('listingDraft');

  // Show toast
  toast({
    title: isRTL ? 'تم حذف الإعلان' : 'Listing Deleted',
    description: isRTL ? 'تم مسح جميع البيانات' : 'All form data cleared',
    variant: 'destructive',
  });

  // Redirect to start new post
  router.push('/seller/add-listing/type');
};

  // Redirect checks
  useEffect(() => {
    if (!agreed) {
      router.push('/seller/add-listing/fee');
      return;
    }
    if (!city) {
      router.push('/seller/add-listing/city');
      return;
    }
    if (!images || images.length < 3) {
      router.push('/seller/add-listing/images');
      return;
    }
  }, [agreed,  city, images, router]);

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
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-green-600">{isRTL ? 'الصور' : 'Images'}</span>
            </div>
            <div className="w-8 h-0.5 bg-green-500"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">5</div>
              <span className="text-sm font-medium text-blue-600">{isRTL ? 'التفاصيل' : 'Details'}</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'تفاصيل الإعلان' : 'Listing Details'}
          </h1>
          <p className={`text-lg text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'أدخل تفاصيل منتجاتك وأكمل إعلانك' : 'Enter your product details and complete your listing'}
          </p>
        </div>

        {/* Details Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className={`flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'العودة' : 'Back'}
          </button>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {isRTL ? 'عنوان الإعلان *' : 'Listing Title *'}
              </label>
              <input
                type="text"
                placeholder={isRTL ? 'أدخل عنوان جذاب للإعلان' : 'Enter an attractive listing title'}
                value={state.title}
                onChange={(e) => setState({ ...state, title: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {isRTL ? 'وصف الإعلان *' : 'Listing Description *'}
              </label>
              <textarea
                placeholder={isRTL ? 'أدخل وصف مفصل عن منتجاتك' : 'Enter detailed description of your items'}
                value={state.description}
                onChange={(e) => setState({ ...state, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {isRTL ? 'السعر الإجمالي *' : 'Total Price *'}
                </label>
                <input
                  type="number"
                  placeholder={isRTL ? 'السعر بالريال السعودي' : 'Price in Saudi Riyal'}
                  value={state.price}
                  onChange={(e) => setState({ ...state, price: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {isRTL ? 'الفئة *' : 'Category *'}
                </label>
                <select
                  value={state.category}
                  onChange={(e) => setState({ ...state, category: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">{isRTL ? 'اختر الفئة' : 'Select Category'}</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {isRTL ? category.label.ar : category.label.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {isRTL ? 'الموقع *' : 'Location *'}
              </label>
              <input
                type="text"
          value={isRTL ? city?.name?.ar || '' : city?.name?.en || ''}


                disabled
                className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {/* Products Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {isRTL ? 'المنتجات' : 'Products'}
                </h3>
                <button
                  type="button"
                  onClick={addProduct}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'إضافة منتج' : 'Add Product'}
                </button>
              </div>

              <div className="space-y-3">
                {state.products.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700">
                        {isRTL ? `منتج ${index + 1}` : `Product ${index + 1}`}
                      </h4>
                      {state.products.length > MIN_PRODUCTS && (
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isRTL ? 'اسم المنتج *' : 'Product Name *'}
                        </label>
                        <input
                          type="text"
                          placeholder={isRTL ? 'أدخل اسم المنتج' : 'Enter product name'}
                          value={item.name}
                          onChange={(e) => updateProduct(index, { name: e.target.value })}
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isRTL ? 'الحالة *' : 'Condition *'}
                        </label>
                        <select
                          value={item.condition}
                          onChange={(e) => updateProduct(index, { condition: e.target.value })}
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">{isRTL ? 'اختر الحالة' : 'Select Condition'}</option>
                          {CONDITIONS.map((cond) => (
                            <option key={cond.value} value={cond.value}>
                              {isRTL ? cond.label.ar : cond.label.en}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isRTL ? 'السعر الأصلي *' : 'Original Price *'}
                        </label>
                        <input
                          type="number"
                          placeholder={isRTL ? 'السعر بالريال' : 'Price in SAR'}
                          value={item.originalPrice}
                          onChange={(e) => updateProduct(index, { originalPrice: e.target.value })}
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {state.products.length < MIN_PRODUCTS && (
                <p className="text-sm text-red-600">
                  {isRTL ? `الحد الأدنى ${MIN_PRODUCTS} منتجات مطلوبة` : `Minimum ${MIN_PRODUCTS} products required`}
                </p>
              )}
            </div>

            {/* Submit Buttons Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {isRTL ? 'العودة' : 'Back'}
              </button>

              <div className="flex flex-wrap gap-3">
                {/* Premium Publish     <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => setShowPremiumModal(true)}
                  className="px-6 py-3 rounded-lg font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                >
                  {isRTL ? 'نشر مميز' : 'Premium Publish'}
                </button>*/}
            

                {/* Publish Free */}
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    canSubmit && !submitting
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {isRTL ? 'جارٍ النشر...' : 'Publishing...'}
                    </>
                  ) : (
                    isRTL ? 'نشر مجاني' : 'Publish Free'
                  )}
                </button>

                {/* Save Draft */}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-6 py-3 rounded-lg font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                >
                  {isRTL ? 'حفظ كمسودة' : 'Save Draft'}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  {isRTL ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isRTL ? 'اختر الباقة' : 'Choose a Package'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isRTL
                ? 'احصل على المزيد من المشاهدات مع باقة النشر المميز.'
                : 'Get more views with a premium publishing package.'}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between border p-3 rounded-lg">
                <span>{isRTL ? 'باقة 7 أيام' : '7 Days Package'}</span>
                <span className="font-medium">50 SAR</span>
              </div>
              <div className="flex items-center justify-between border p-3 rounded-lg">
                <span>{isRTL ? 'باقة 30 يوم' : '30 Days Package'}</span>
                <span className="font-medium">150 SAR</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
          
              <button
                onClick={handlePremiumPurchase}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                {isRTL ? 'شراء' : 'Buy Package'}
              </button>
           
            </div> 
          </div>
        </div>
      )}
      {showDraftPrompt && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
      <h2 className="text-lg font-bold mb-4">
        {isRTL ? 'مسودة موجودة' : 'Draft Found'}
      </h2>
      <p className="mb-6">
        {isRTL
          ? 'هل تريد استعادة المسودة السابقة؟'
          : 'Do you want to restore the previous draft?'}
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={discardDraft}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          {isRTL ? 'تجاهل' : 'Discard'}
        </button>
        <button
          onClick={loadDraft}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isRTL ? 'استعادة' : 'Restore'}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
