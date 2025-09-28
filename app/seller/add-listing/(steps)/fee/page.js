'use client';

import { useRouter } from 'next/navigation';
import { usePostWizard } from '../../layout';
import { useLanguage } from '../../../../context/LanguageContext';
import { ArrowLeft, CheckCircle, AlertCircle, CreditCard, Clock, Shield } from 'lucide-react';

export default function FeeAgreementPage() {
  const { agreed, setAgreed, type } = usePostWizard();
  const { isRTL } = useLanguage();
  const router = useRouter();

  const handleContinue = () => {
    if (agreed) {
      router.push('/seller/add-listing/city');
    }
  };

  const handleBack = () => {
    router.push('/seller/add-listing/type');
  };

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
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
              <span className="text-sm font-medium text-blue-600">{isRTL ? 'الرسوم' : 'Fees'}</span>
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
            {isRTL ? 'اتفاقية الرسوم' : 'Fee Agreement'}
          </h1>
          <p className={`text-lg text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'يرجى قراءة شروط الخدمة والموافقة عليها' : 'Please read and agree to our service terms'}
          </p>
        </div>

        {/* Fee Agreement Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className={`flex items-center text-gray-600 hover:text-gray-800 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'العودة' : 'Back'}
          </button>

          {/* Fee Information */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'رسوم الخدمة' : 'Service Fee'}
                  </h3>
                  <p className={`text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL 
                      ? 'نحن نطبق رسوم خدمة بنسبة 1% من قيمة البيع عند اكتمال المعاملة بنجاح.'
                      : 'We apply a 1% service fee on the sale value when the transaction is completed successfully.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'موعد الدفع' : 'Payment Terms'}
                  </h3>
                  <p className={`text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL 
                      ? 'يجب دفع الرسوم خلال 10 أيام من استلام المبلغ من المشتري.'
                      : 'The fee must be paid within 10 days of receiving payment from the buyer.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'حماية المشتري' : 'Buyer Protection'}
                  </h3>
                  <p className={`text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL 
                      ? 'الرسوم تساعدنا في توفير حماية أفضل للمشترين وضمان جودة الخدمة.'
                      : 'The fee helps us provide better buyer protection and ensure service quality.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="border-t pt-6">
            <label className={`flex items-start space-x-4 cursor-pointer ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className={`text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL 
                    ? 'أوافق على دفع رسوم الخدمة البالغة 1% من قيمة البيع خلال 10 أيام من استلام المبلغ من المشتري.'
                    : 'I agree to pay the 1% service fee within 10 days of receiving payment from the buyer.'
                  }
                </p>
                <p className={`text-sm text-gray-500 mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL 
                    ? 'بالموافقة على هذا الاتفاق، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.'
                    : 'By agreeing to this, you accept our Terms of Service and Privacy Policy.'
                  }
                </p>
              </div>
            </label>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end pt-6">
            <button
              onClick={handleContinue}
              disabled={!agreed}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                agreed
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isRTL ? 'متابعة' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


