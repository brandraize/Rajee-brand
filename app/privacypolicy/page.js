"use client";

import { useLanguage } from "../context/LanguageContext";

const privacySections = [
  {
    key: "title",
    titleAr: "سياسة الخصوصية - رجيع",
    titleEn: "Privacy Policy - Rajee",
    contentAr: `مرحبًا بكم في منصة رجيع. تحرص المنصة على حماية خصوصيتك وضمان استخدام آمن للمنصة لجميع المستخدمين. الرجاء قراءة السياسات بعناية لفهم كيفية معالجة بياناتك.`,
    contentEn: `Welcome to Rajee. We prioritize protecting your privacy and ensuring a safe platform experience for all users. Please read the policies carefully to understand how your data is handled.`,
  },
  {
    key: "intro",
    titleAr: "مقدمة",
    titleEn: "Introduction",
    contentAr: `نحن ملتزمون بحماية خصوصيتك وضمان حماية بياناتك الشخصية. 
نستخدم بياناتك لتقديم تجربة أفضل على المنصة ومساعدة المستخدمين على التفاعل بأمان.`,
    contentEn: `We are committed to protecting your privacy and safeguarding your personal data. 
We use your data to provide a better platform experience and help users interact safely.`,
  },
  {
    key: "infoCollection",
    titleAr: "جمع المعلومات",
    titleEn: "Information Collection",
    contentAr: `نقوم بجمع المعلومات الشخصية عند تسجيل الحساب، إضافة الإعلانات، أو التواصل مع المستخدمين الآخرين. 
قد تشمل هذه المعلومات الاسم، البريد الإلكتروني، رقم الهاتف، ومعلومات الإعلان.`,
    contentEn: `We collect personal information when creating an account, adding listings, or communicating with other users. 
This may include your name, email address, phone number, and listing information.`,
  },
  {
    key: "infoUse",
    titleAr: "استخدام المعلومات",
    titleEn: "Use of Information",
    contentAr: `نستخدم المعلومات لتحسين خدماتنا، التواصل معك بشأن حسابك وإعلاناتك، وضمان سلامة المنصة. 
كما نستخدمها لمنع أي نشاط غير قانوني أو محاولات احتيال وحماية المجتمع الرقمي.`,
    contentEn: `We use the information to improve our services, communicate with you regarding your account and listings, and ensure platform safety. 
It is also used to prevent illegal activities or fraud attempts and protect the digital community.`,
  },
  {
    key: "infoShare",
    titleAr: "مشاركة المعلومات",
    titleEn: "Information Sharing",
    contentAr: `لا نشارك بياناتك مع جهات تجارية خارجية لأغراض تسويقية. 
قد نشارك المعلومات مع السلطات القانونية عند الضرورة وفقًا للقوانين واللوائح المعمول بها.`,
    contentEn: `We do not share your data with external commercial parties for marketing purposes. 
Information may be shared with legal authorities when necessary according to applicable laws and regulations.`,
  },
  {
    key: "security",
    titleAr: "حماية البيانات",
    titleEn: "Data Security",
    contentAr: `نستخدم أفضل الممارسات التقنية والأمنية لحماية بياناتك من الوصول أو الاستخدام غير المصرح به. 
يتضمن ذلك تشفير البيانات، مراقبة الأنشطة المشبوهة، وإجراءات للحد من أي تهديدات.`,
    contentEn: `We use industry-standard security practices to protect your data from unauthorized access or use. 
This includes data encryption, monitoring for suspicious activity, and measures to mitigate potential threats.`,
  },
  {
    key: "cookies",
    titleAr: "ملفات تعريف الارتباط",
    titleEn: "Cookies",
    contentAr: `نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم على المنصة، مثل تذكر تفضيلاتك وتحليل الأداء. 
يمكنك إدارة أو رفض ملفات تعريف الارتباط عبر إعدادات المتصفح.`,
    contentEn: `We use cookies to enhance the user experience on the platform, such as remembering preferences and analyzing performance. 
You can manage or reject cookies through your browser settings.`,
  },
  {
    key: "analytics",
    titleAr: "التحليلات والأداء",
    titleEn: "Analytics & Performance",
    contentAr: `نقوم بتحليل استخدام المنصة لتحسين الأداء، اكتشاف المشاكل الفنية، وتقديم تجربة سلسة للمستخدمين. 
البيانات المستخدمة للتحليلات تكون مجهولة الهوية ولا تربط بالمستخدم مباشرة.`,
    contentEn: `We analyze platform usage to improve performance, detect technical issues, and provide a smooth user experience. 
Analytics data is anonymized and not directly linked to individual users.`,
  },
  {
    key: "contact",
    titleAr: "اتصل بنا",
    titleEn: "Contact Us",
    contentAr: `لأي استفسارات بخصوص الخصوصية أو حماية بياناتك، يمكنك التواصل معنا عبر البريد الإلكتروني: support@rajeee.com 
أو الاتصال بالهاتف: +966 50 123 4567`,
    contentEn: `For any privacy-related inquiries or data protection questions, contact us via email: support@rajeee.com 
or phone: +966 50 123 4567`,
  },
];

export default function PrivacyCards() {
  const { language } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        {language === "ar" ? "سياسة الخصوصية - رجيع" : "Privacy Policy - Rajee"}
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {privacySections.map((section, idx) => (
          <div
            key={section.key}
            className={`group relative p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 text-white`}
            style={{
              background: idx % 2 === 0
                ? 'linear-gradient(to right, #6b7280, #374151)' // soft gray-blue
                : 'linear-gradient(to right, #4b5563, #1f2937)', // soft dark gray
            }}
          >
            <h3 className="text-xl font-bold mb-3">
              {language === "ar" ? section.titleAr : section.titleEn}
            </h3>
            <p className="text-sm opacity-90 whitespace-pre-line">
              {language === "ar" ? section.contentAr : section.contentEn}
            </p>

            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 rounded-xl transition duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
