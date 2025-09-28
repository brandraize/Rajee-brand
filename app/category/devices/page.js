"use client";

import { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useAppToast } from "../../../hooks/useAppToast";

export default function BlockedDevicesPage() {
  const { isRTL } = useLanguage();
  const { blockedSection } = useAppToast();

  useEffect(() => {
    blockedSection();
  }, [blockedSection]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-100 p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
            {isRTL ? "هذا القسم غير متاح" : "This section is not available"}
          </h1>
          <p className="text-gray-600 mb-6" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
            {isRTL 
              ? "نعتذر، هذا القسم غير متاح حالياً. يرجى تصفح الأقسام المتاحة الأخرى."
              : "Sorry, this section is not currently available. Please browse other available sections."
            }
          </p>
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
          >
            {isRTL ? "العودة للرئيسية" : "Back to Home"}
          </a>
        </div>
      </div>
    </div>
  );
}
