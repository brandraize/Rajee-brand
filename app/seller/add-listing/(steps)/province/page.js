'use client';

import { useRouter } from 'next/navigation';
import { usePostWizard } from '../../layout';
import { useLanguage } from '../../../../context/LanguageContext';
import { ArrowLeft, CheckCircle, MapPin } from 'lucide-react';
import { useEffect } from 'react';

const PROVINCES = [
  { id: 'riyadh', name: { en: 'Riyadh Area', ar: 'منطقة الرياض' }, cities: 15 },
  { id: 'makkah', name: { en: 'Makkah Area', ar: 'منطقة مكة المكرمة' }, cities: 12 },
  { id: 'eastern', name: { en: 'Eastern Region', ar: 'المنطقة الشرقية' }, cities: 8 },
  { id: 'qassim', name: { en: 'Qassim Area', ar: 'منطقة القصيم' }, cities: 6 },
  { id: 'aseer', name: { en: 'Aseer Area', ar: 'منطقة عسير' }, cities: 7 },
  { id: 'madinah', name: { en: 'Madinah Area', ar: 'منطقة المدينة المنورة' }, cities: 5 },
  { id: 'tabuk', name: { en: 'Tabuk Area', ar: 'منطقة تبوك' }, cities: 4 },
  { id: 'hail', name: { en: 'Hail Area', ar: 'منطقة حائل' }, cities: 3 },
  { id: 'northern', name: { en: 'Northern Borders', ar: 'منطقة الحدود الشمالية' }, cities: 2 },
  { id: 'jazan', name: { en: 'Jazan Area', ar: 'منطقة جازان' }, cities: 6 },
  { id: 'najran', name: { en: 'Najran Area', ar: 'منطقة نجران' }, cities: 3 },
  { id: 'baha', name: { en: 'Al Baha Area', ar: 'منطقة الباحة' }, cities: 4 },
  { id: 'jouf', name: { en: 'Al Jouf Area', ar: 'منطقة الجوف' }, cities: 3 }
];

export default function ProvincePage() {
  const { province, setProvince, agreed } = usePostWizard();
  const { isRTL } = useLanguage();
  const router = useRouter();

  const handleProvinceSelect = (selectedProvince) => {
    setProvince(selectedProvince);
    router.push('/seller/add-listing/city');
  };

  const handleBack = () => {
    router.push('/seller/add-listing/fee');
  };

  // Handle redirect in useEffect to avoid SSR issues
  useEffect(() => {
    if (!agreed) {
      router.push('/seller/add-listing/fee');
    }
  }, [agreed, router]);

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
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <span className="text-sm font-medium text-blue-600">{isRTL ? 'الموقع' : 'Location'}</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">4</div>
              <span className="text-sm font-medium text-gray-500">{isRTL ? 'الصور' : 'Images'}</span>
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
            {isRTL ? 'اختر المنطقة' : 'Select Province'}
          </h1>
          <p className={`text-lg text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'اختر المنطقة التي تقع فيها منتجاتك' : 'Choose the province where your items are located'}
          </p>
        </div>

        {/* Province Selection */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className={`flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'العودة' : 'Back'}
          </button>

          {/* Province Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROVINCES.map((provinceItem) => {
              const isSelected = province === provinceItem.id;
              
              return (
                <button
                  key={provinceItem.id}
                  onClick={() => handleProvinceSelect(provinceItem.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-gray-900 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? provinceItem.name.ar : provinceItem.name.en}
                      </h3>
                      <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL 
                          ? `${provinceItem.cities} مدينة متاحة`
                          : `${provinceItem.cities} cities available`
                        }
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          {province && (
            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/seller/add-listing/city')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {isRTL ? 'متابعة' : 'Continue'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


