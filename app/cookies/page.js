"use client";

import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Cookie, ShieldCheck, Eye, Settings, Edit } from "lucide-react";

export default function CookiesPolicyPage() {
  const { language, isRTL } = useLanguage();
  const [openKey, setOpenKey] = useState(null);

  const handleToggle = (key) => {
    setOpenKey(openKey === key ? null : key);
  };

  const cards = [
    {
      title: { en: "What Are Cookies?", ar: "ما هي الكوكيز؟" },
      content: {
        en: `Cookies are small files stored on your device that help Rajee enhance your experience, remember preferences, and improve services. They may also be used for analytics and marketing purposes.`,
        ar: `الكوكيز هي ملفات صغيرة تُخزن على جهازك تساعد منصة رجيع على تحسين تجربتك، وتذكر تفضيلاتك، وتحسين الخدمات. يمكن استخدامها أيضًا لأغراض التحليل والتسويق.`,
      },
      icon: <Cookie className="w-6 h-6 text-blue-600" />,
    },
    {
      title: { en: "Policy Updates", ar: "تحديثات السياسة" },
      content: {
        en: `Rajee may update this Cookies Policy from time to time. Users will be notified of any significant changes, and continued use of the platform constitutes acceptance of the updated policy.`,
        ar: `قد تقوم منصة رجيع بتحديث سياسة الكوكيز من وقت لآخر. سيتم إخطار المستخدمين بأي تغييرات مهمة، ويشير استمرار استخدام المنصة إلى قبول السياسة المحدثة.`,
      },
      icon: <Edit className="w-6 h-6 text-blue-600" />,
    },
    {
      title: { en: "Types of Cookies", ar: "أنواع الكوكيز" },
      content: {
        en: `We use session cookies (temporary) and persistent cookies (stored longer). Functional cookies enable core platform functionality. Analytical cookies help us understand user interactions. Marketing cookies may show personalized ads.`,
        ar: `نستخدم الكوكيز المؤقتة (جلسة) والمستمرة (تخزين طويل). الكوكيز الوظيفية تمكّن الوظائف الأساسية للمنصة. الكوكيز التحليلية تساعدنا على فهم تفاعل المستخدمين. كوكيز التسويق قد تعرض إعلانات مخصصة.`,
      },
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    },
    {
      title: { en: "Managing Cookies", ar: "إدارة الكوكيز" },
      content: {
        en: `Users can manage or disable cookies via their browser settings. However, disabling certain cookies may affect platform functionality and user experience.`,
        ar: `يمكن للمستخدمين إدارة أو تعطيل الكوكيز من خلال إعدادات المتصفح الخاصة بهم. ومع ذلك، قد يؤثر تعطيل بعض الكوكيز على وظائف المنصة وتجربة المستخدم.`,
      },
      icon: <Settings className="w-6 h-6 text-blue-600" />,
    },
    {
      title: { en: "Third-Party Cookies", ar: "كوكيز الطرف الثالث" },
      content: {
        en: `Some cookies are placed by third-party services for analytics, advertising, or social media integrations. We do not control these cookies, and users should review third-party policies.`,
        ar: `بعض الكوكيز يتم وضعها بواسطة خدمات الطرف الثالث لأغراض التحليل أو الإعلانات أو تكامل وسائل التواصل الاجتماعي. نحن لا نتحكم في هذه الكوكيز، ويجب على المستخدمين مراجعة سياسات الطرف الثالث.`,
      },
      icon: <Eye className="w-6 h-6 text-blue-600" />,
    },
    {
      title: { en: "Consent", ar: "الموافقة" },
      content: {
        en: `By continuing to use Rajee, users consent to the use of cookies as described in this policy. Users can withdraw consent at any time via browser settings.`,
        ar: `باستمرارك في استخدام منصة رجيع، فإنك توافق على استخدام الكوكيز كما هو موضح في هذه السياسة. يمكن للمستخدمين سحب موافقتهم في أي وقت عبر إعدادات المتصفح.`,
      },
      icon: <Cookie className="w-6 h-6 text-blue-600" />,
    },
    {
      title: { en: "Contact Us", ar: "تواصل معنا" },
      content: {
        en: `For any questions regarding this Cookies Policy, please contact our support team at support@rajee.com or call +966 50 123 4567.`,
        ar: `لأي أسئلة تتعلق بسياسة الكوكيز هذه، يرجى التواصل مع فريق الدعم عبر support@rajee.com أو الاتصال على +966 50 123 4567.`,
      },
      icon: <Edit className="w-6 h-6 text-blue-600" />,
    },
  ];

  return (
    <div className={`max-w-7xl mx-auto p-6 ${isRTL ? "rtl" : "ltr"} relative`}>
      <h1 className="text-3xl font-bold text-center mb-10">
        {language === "ar"
          ? "سياسة الكوكيز - رجيع"
          : "Cookies Policy - Rajee"}
      </h1>

      <div className="space-y-6">
        {cards.map((card, index) => {
          const isOpen = openKey === index;
          return (
            <div
              key={index}
              className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-transform transform hover:scale-105 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4 text-blue-900">
                {card.icon}
                <h2 className="text-2xl font-semibold">
                  {language === "ar" ? card.title.ar : card.title.en}
                </h2>
              </div>
              <p className="text-gray-800 whitespace-pre-line">
                {language === "ar" ? card.content.ar : card.content.en}
              </p>
            </div>
          );
        })}
      </div>

      {/* Flowing background effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-200 via-blue-50 to-indigo-200 opacity-20 animate-[pulse_10s_ease-in-out_infinite] rounded-3xl"></div>
    </div>
  );
}
