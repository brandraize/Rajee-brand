'use client';

import { useRouter } from 'next/navigation';
import { usePostWizard } from '../../layout';
import { useLanguage } from '../../../../context/LanguageContext';
import { ChevronRight, Car, Wrench, Truck, Bike, Home, Smartphone, Shirt, Book, Gamepad2, Heart, Briefcase } from 'lucide-react';

const TYPES = [
  { 
    id: 'electrical-tools', 
    label: { en: 'Electrical Tools', ar: 'الأدوات الكهربائية' },
    icon: Wrench,
  
  },
  { 
    id: 'construction-equipment', 
    label: { en: 'Construction Equipment', ar: 'معدات البناء' },
    icon: Truck,
  
  },
  { 
    id: 'iron-tools', 
    label: { en: 'Iron Tools', ar: 'الأدوات الحديدية' },
    icon: Wrench,
   
  },
  { 
    id: 'plastic-tools', 
    label: { en: 'Plastic Tools', ar: 'الأدوات البلاستيكية' },
    icon: Wrench,
  
  },
  { 
    id: 'old-electronics', 
    label: { en: 'Old Electronics', ar: 'الإلكترونيات المستعملة' },
    icon: Smartphone,
 
  },
  {
    id: 'fashion',
    label: { en: 'Fashion', ar: 'أزياء' },
    icon: Shirt,
  
  },
  {
    id: 'furniture',
    label: { en: 'Furniture', ar: 'أثاث' },
    icon: Home,
   
  },
  {
    id: 'cars',
    label: { en: 'Cars', ar: 'سيارات' },
    icon: Car,
   
  }
];

export default function SelectTypePage() {
  const { type, setType } = usePostWizard();
  const { isRTL } = useLanguage();
  const router = useRouter();

  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
    router.push('/seller/add-listing/fee');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
              <span className="text-sm font-medium text-blue-600">{isRTL ? 'اختر النوع' : 'Select Type'}</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">2</div>
              <span className="text-sm font-medium text-gray-500">{isRTL ? 'الرسوم' : 'Fees'}</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <span className="text-sm font-medium text-gray-500">{isRTL ? 'الموقع' : 'Location'}</span>
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
            {isRTL ? 'اختر نوع الإعلان' : 'Select Listing Type'}
          </h1>
          <p className={`text-lg text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'اختر الفئة التي تناسب منتجاتك' : 'Choose the category that best fits your items'}
          </p>
        </div>

        {/* Type Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TYPES.map((typeItem) => {
            const IconComponent = typeItem.icon;
            const isSelected = type === typeItem.id;
            
            return (
              <button
                key={typeItem.id}
                onClick={() => handleTypeSelect(typeItem.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`flex items-start space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-3 rounded-lg ${
                    isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? typeItem.label.ar : typeItem.label.en}
                    </h3>
                 
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        {type && (
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/seller/add-listing/fee')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {isRTL ? 'متابعة' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


