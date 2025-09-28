"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { digitalSafetyGuidelines } from "../context/LanguageContext";
import { ChevronDown, ChevronUp } from "lucide-react"; // Lucide icons

export default function DigitalSafetyAccordion() {
  const { language, t } = useLanguage();
  const [openKey, setOpenKey] = useState(null);

  const handleToggle = (key) => {
    setOpenKey(openKey === key ? null : key);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      <h2 className="text-4xl font-bold text-blue-600 text-center mb-6">
        {language === "ar" ? "إرشادات السلامة الرقمية" : "Digital Safety Guidelines"}
      </h2>

      {digitalSafetyGuidelines.map((item) => {
        const isOpen = openKey === item.key;
        return (
          <div
            key={item.key}
            className="border rounded-lg shadow-md overflow-hidden"
          >
            <button
              onClick={() => handleToggle(item.key)}
              className="w-full flex justify-between items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold hover:from-indigo-600 hover:to-blue-500 transition-all"
            >
              <span>{language === "ar" ? item.titleAr : item.titleEn}</span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            <div
              className={`px-4 py-3 text-gray-700 bg-gray-50 transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <p className="whitespace-pre-line">
                {language === "ar" ? item.contentAr : item.contentEn}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
