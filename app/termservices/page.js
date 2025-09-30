"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { ShieldCheck, User, Lock, FileText, EyeOff, Slash, Repeat, Edit3 } from "lucide-react";

export default function TermsOfServicePage() {
  const { language, isRTL } = useLanguage();

  const cards = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      title: {
        en: "Acceptance of Terms",
        ar: "قبول الشروط",
      },
      content: {
        en: `By accessing and using Rajee, you agree to comply with these Terms of Service. These terms govern your usage, rights, and responsibilities on the platform. 
Failure to adhere may result in account suspension or termination. Users should review the terms periodically to stay informed of updates and changes.`,
        ar: `باستخدام منصة رجيع، فإنك توافق على الالتزام بشروط الخدمة هذه. تحكم هذه الشروط استخدامك وحقوقك ومسؤولياتك على المنصة. 
عدم الالتزام قد يؤدي إلى تعليق أو إنهاء حسابك. يجب على المستخدمين مراجعة الشروط بشكل دوري للبقاء على اطلاع على التحديثات والتغييرات.`,
      },
    },
    {
      icon: <User className="w-6 h-6 text-blue-500" />,
      title: { en: "User Responsibilities", ar: "مسؤوليات المستخدم" },
      content: {
        en: `Users are required to provide accurate information, avoid fraudulent activities, and respect other users. Harassment, hate speech, and illegal actions are strictly prohibited. Continuous monitoring of account activity is recommended. 
Users must also ensure content shared does not violate any laws or ethical standards, maintaining a safe and trustworthy community.`,
        ar: `يجب على المستخدمين تقديم معلومات دقيقة، وتجنب الأنشطة الاحتيالية، واحترام المستخدمين الآخرين. يُحظر بشدة المضايقات وخطاب الكراهية والأفعال غير القانونية. يُوصى بمراقبة نشاط الحساب باستمرار. 
يجب على المستخدمين أيضًا التأكد من أن المحتوى المشترك لا ينتهك أي قوانين أو معايير أخلاقية، للحفاظ على مجتمع آمن وموثوق.`,
      },
    },
    {
      icon: <Lock className="w-6 h-6 text-blue-500" />,
      title: { en: "Account Security", ar: "أمن الحساب" },
      content: {
        en: `You are responsible for maintaining the confidentiality of your login credentials. Do not share your password or account details. In case of unauthorized access, notify Rajee immediately. 
Rajee employs advanced security protocols to protect accounts. Users are encouraged to use strong passwords and enable two-factor authentication to enhance security.`,
        ar: `أنت مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك. لا تشارك كلمة المرور أو تفاصيل الحساب. في حالة الوصول غير المصرح به، يجب إعلام رجيع فورًا. 
تطبق رجيع بروتوكولات أمان متقدمة لحماية الحسابات. يُشجع المستخدمون على استخدام كلمات مرور قوية وتمكين المصادقة الثنائية لتعزيز الأمان.`,
      },
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      title: { en: "Content Guidelines", ar: "إرشادات المحتوى" },
      content: {
        en: `All content posted must be lawful and not violate any rights. Offensive, misleading, or harmful content is prohibited. Rajee reserves the right to review, remove, or block content violating these guidelines. 
Users are encouraged to report any content that seems suspicious, misleading, or violates community standards.`,
        ar: `يجب أن يكون جميع المحتوى المنشور قانونيًا ولا ينتهك أي حقوق. يُحظر المحتوى المسيء أو المضلل أو الضار. تحتفظ رجيع بالحق في مراجعة أو إزالة أو حظر المحتوى الذي ينتهك هذه الإرشادات. 
يُشجع المستخدمون على الإبلاغ عن أي محتوى يبدو مشبوهًا أو مضللًا أو ينتهك معايير المجتمع.`,
      },
    },
    {
      icon: <EyeOff className="w-6 h-6 text-blue-500" />,
      title: { en: "Privacy", ar: "الخصوصية" },
      content: {
        en: `We respect your privacy and handle personal data responsibly. Data is collected only for improving services, ensuring security, and providing a better user experience. 
Personal data will not be shared with third parties without consent, except as required by law. Users may request data access, corrections, or deletion.`,
        ar: `نحن نحترم خصوصيتك ونتعامل مع البيانات الشخصية بمسؤولية. يتم جمع البيانات فقط لتحسين الخدمات وضمان الأمان وتقديم تجربة مستخدم أفضل. 
لن يتم مشاركة البيانات الشخصية مع أطراف ثالثة دون موافقة، إلا إذا كان ذلك مطلوبًا قانونيًا. يمكن للمستخدمين طلب الوصول إلى بياناتهم أو تصحيحها أو حذفها.`,
      },
    },
    {
      icon: <Slash className="w-6 h-6 text-blue-500" />,
      title: { en: "Prohibited Activities", ar: "الأنشطة المحظورة" },
      content: {
        en: `Any activity that may harm other users, disrupt platform services, or violate laws is strictly prohibited. This includes spamming, phishing, impersonation, and spreading malware. 
Violations may result in immediate account suspension or legal consequences depending on severity.`,
        ar: `يُحظر بشدة أي نشاط قد يضر بالمستخدمين الآخرين أو يعطل خدمات المنصة أو ينتهك القوانين. يشمل ذلك البريد المزعج، الاحتيال الإلكتروني، انتحال الهوية، ونشر البرمجيات الضارة. 
قد تؤدي الانتهاكات إلى تعليق فوري للحساب أو اتخاذ إجراءات قانونية حسب خطورة المخالفة.`,
      },
    },
    {
      icon: <Repeat className="w-6 h-6 text-blue-500" />,
      title: { en: "Transaction Rules", ar: "قواعد المعاملات" },
      content: {
        en: `All transactions on Rajee must be conducted honestly and transparently. Users are responsible for the products or services they list, providing accurate descriptions, prices, and terms. 
Disputes should be resolved amicably. Fraudulent actions, scams, or manipulations are strictly forbidden, and Rajee may intervene to ensure fairness.`,
        ar: `يجب أن تتم جميع المعاملات على منصة رجيع بصدق وشفافية. يتحمل المستخدمون مسؤولية المنتجات أو الخدمات التي يدرجونها، مع تقديم وصف دقيق والأسعار والشروط. 
يجب حل النزاعات وديًا. تُحظر الأنشطة الاحتيالية أو الاحتيال أو التلاعب بشدة، وقد تتدخل رجيع لضمان العدالة.`,
      },
    },
    {
      icon: <Edit3 className="w-6 h-6 text-blue-500" />,
      title: { en: "Modification of Terms", ar: "تعديل الشروط" },
      content: {
        en: `Rajee reserves the right to modify these Terms of Service at any time. Users will be notified of changes, and continued use of the platform indicates acceptance of the updated terms. 
It's recommended to regularly check for updates to stay informed and compliant with the latest policies.`,
        ar: `تحتفظ رجيع بالحق في تعديل شروط الخدمة في أي وقت. سيتم إخطار المستخدمين بالتغييرات، ويشير استمرار استخدام المنصة إلى قبول الشروط المحدثة. 
يُوصى بمراجعة التحديثات بانتظام للبقاء على اطلاع والامتثال لأحدث السياسات.`,
      },
    },
  ];

  return (
    <div className={`max-w-7xl mx-auto p-6 ${isRTL ? "rtl" : "ltr"}`}>
      <h1 className="text-3xl font-bold text-center mb-8">
        {language === "ar" ? "شروط الخدمة - رجيع" : "Terms of Service - Rajee"}
      </h1>

      <div className="space-y-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-transform transform hover:scale-105 flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-3 mb-2">
              {card.icon}
              <h2 className="text-2xl font-semibold text-blue-900">
                {language === "ar" ? card.title.ar : card.title.en}
              </h2>
            </div>
            <p className="text-gray-800 whitespace-pre-line">
              {language === "ar" ? card.content.ar : card.content.en}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
