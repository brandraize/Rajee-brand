"use client";

import { createContext, useContext, useState, useEffect } from "react";




const LanguageContext = createContext();
export const digitalSafetyGuidelines = [
  {
    key: "humanExploitation",
    titleAr: "الحماية من استغلال البشر (الاتجار بالبشر والمتاجرة بالأعضاء)",
    titleEn: "Protection from Human Exploitation (Human Trafficking & Organ Trade)",
    contentAr: `نعمل على حماية الأفراد من جميع أشكال الاستغلال، بما في ذلك الاتجار بالبشر والمتاجرة بالأعضاء. 
نحن نقدم الموارد التقنية والتوعوية لمساعدة الضحايا ونمنع استخدام المنصة لأي أنشطة مخالفة للقوانين المحلية والدولية.
للتبليغ عن أي محتوى مخالف:
- الإبلاغ من صفحة الإعلان
- الإبلاغ عبر "اتصل بنا"
- التواصل مع هيئة حقوق الإنسان: Info@ncct.gov.sa`,
    contentEn: `We work to protect individuals from all forms of exploitation, including human trafficking and organ trade. 
We provide technical and educational resources to assist victims and prevent any use of the platform for illegal activities.
To report violating content:
- Report via the advertisement page
- Report through "Contact Us"
- Contact the Human Rights Commission: Info@ncct.gov.sa`,
  },
  {
    key: "harassment",
    titleAr: "الحماية من المضايقة أو الإساءة (العنصرية والكراهية والتهديد)",
    titleEn: "Protection from Harassment or Abuse (Racism, Hate & Threats)",
    contentAr: `نحن لا نسمح بأي شكل من أشكال التمييز أو التهديد أو التنمر على المنصة. 
في حال تعرضك لأي إساءة:
- رفع بلاغ عبر "اتصل بنا"
- تقديم شكوى لدى الجهات الأمنية`,
    contentEn: `We do not allow any form of discrimination, threat, or bullying on the platform.
If you experience abuse:
- File a report via "Contact Us"
- Submit a complaint to the security authorities`,
  },
  {
    key: "childProtection",
    titleAr: "حماية الطفل",
    titleEn: "Child Protection",
    contentAr: `نعمل على حماية حقوق الأطفال ومنع أي استغلال أو تنمر أو استخدام كلمات مسيئة تقلل من كرامتهم.
للتبليغ عن أي انتهاك لحقوق الطفل:
- التواصل مع وزارة الموارد البشرية والتنمية الاجتماعية: https://hrsd.gov.sa
- التواصل مع هيئة حقوق الإنسان: https://www.hrc.gov.sa`,
    contentEn: `We protect children’s rights and prevent exploitation, bullying, or use of offensive language that harms their dignity.
To report any child rights violation:
- Ministry of Human Resources and Social Development: https://hrsd.gov.sa
- Human Rights Commission: https://www.hrc.gov.sa`,
  },
  {
    key: "womenProtection",
    titleAr: "حماية الفتيات والسيدات",
    titleEn: "Girls and Women Protection",
    contentAr: `نضمن أن تشعر الفتيات والسيدات بالأمان عند استخدام المنصة للتجارة والتواصل. 
لتجنب المضايقات:
- عدم مشاركة أي محتوى شخصي
- عدم مشاركة رقم الهاتف أو التواصل خارج المنصة
- حظر أي شخص يسبب شعور بعدم الأمان
- الإبلاغ عن أي مضايقة`,
    contentEn: `We ensure girls and women feel safe using the platform for commerce and communication.
To prevent harassment:
- Do not share personal content
- Do not share your phone number or communicate outside the platform
- Block anyone who makes you feel unsafe
- Report any harassment`,
  },
  {
    key: "fraudProtection",
    titleAr: "الحماية من الاحتيال",
    titleEn: "Fraud Protection",
    contentAr: `نحرص على بيئة آمنة خالية من الاحتيال:
- منع إرسال الروابط داخل الإعلانات أو الرسائل
- التحذير من التواصل خارج المنصة
- الإبلاغ عن المحتالين عبر الإعلان أو الرسائل الخاصة أو "اتصل بنا"
- التعامل مباشرة مع البلاغات وإيقاف الحسابات المخالفة
طرق تفادي الاحتيال:
- المبايعة وجهًا لوجه أو استخدام تطبيق آمن مثل "وفي"
- عدم الإعلان عن منتجات لا تملكها
- عدم مشاركة أي بيانات حساسة أو كلمات مرور`,
    contentEn: `We ensure a safe, fraud-free environment:
- No links in ads or messages
- Warn against off-platform communication
- Report fraudsters via the ad, private messages, or "Contact Us"
- Directly handle reports and suspend offending accounts
How to avoid fraud:
- Conduct face-to-face transactions or use a safe app like "Wafi"
- Do not advertise products you do not own
- Do not share sensitive information or passwords`,
  },
];

const translations = {
  en: {
    // Header
    login: "Login",
    register: "Register",
    addListing: "Add Listing",
    search: "Search for bundles...",
    categories: "Categories",

    // Navigation
    home: "Home",
    "electrical-tools": "Electrical Tools",
    "construction-equipment": "Construction Equipment",
    "iron-tools": "Iron Tools",
    "plastic-tools": "Plastic Tools",
    "old-electronics": "Old Electronics",
    "fashion": "Fashion",
    "furniture": "Furniture",
    "cars": "Cars",

    // Homepage
    featuredBundles: "Featured Bundles",
    newBundles: "New Bundles",
    browseAll: "Browse All",

    // Listing
    bundleOf: "Bundle of",
    items: "items",
    seller: "Seller",
    location: "Location",
    contactSeller: "Contact Seller",
    addToWishlist: "Add to Wishlist",
    reportListing: "Report Listing",

    // Dashboard
    myListings: "My Listings",
    myOrders: "My Orders",
    wishlist: "Wishlist",
    messages: "Messages",
    settings: "Settings",

    // Forms
    title: "Title",
    description: "Description",
    price: "Price",
    category: "Category",
    uploadImages: "Upload Images",
    minimumThreeItems: "You must add at least 3 items to create a bundle",
    addItem: "Add Item",
    removeItem: "Remove Item",

    // Footer
    aboutUs: "About Us",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    contactUs: "Contact Us",
    followUs: "Follow Us",

    Main: "Main",
    Cars: "Cars",
    Devices: "Devices",
    "Livestock and Animals": "Livestock & Animals",
    Furniture: "Furniture",
    Search: "Search",
    Services: "Services",
    "More Sections": "More Sections",
    searchGoods: "Search for goods...",
    all: "All",
    selectCategory: "Select Category",
    login: "Login",
    addPost: "Add your post +",
settings: 'Settings',
    editProfile: 'Edit your profile',
    selectSetting: 'Select a setting on the left to edit your information.',
    loadingUser: 'Loading user data...',
    pleaseLogin: 'Please log in to access your settings.',
    noUserData: 'No user data found.',
    deleteAccountConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
    deleteAccount: 'Delete Account',
    error: 'Error',
    electronics:  "Electronics",
    bundleOf: "Bundle of",
    items: "items",
    reportListing: "Report Listing",
chooseReason: "Choose a reason",
 profileImage: "Change Profile Image",
      coverImage: "Change Cover Image",
      name: "Change Name",
      email: "Change Email",
      phone: "Change Phone",
      password: "Change Password",
      
  "changeProfileImage": "Change Profile Image",
  "changeCoverImage": "Change Cover Image",
  "changeName": "Change Name",
  "changeEmail": "Change Email",
  "changePhone": "Change Phone",
  "changePassword": "Change Password",
  "settings": "Settings",
  "loadingUser": "Loading user...",
  "pleaseLogin": "Please log in to continue.",
  "noUserData": "No user data available.",
  "failedFetchUser": "Failed to fetch user data.",
  "failedUpdateProfile": "Failed to update profile.",
  "userNotAuthenticated": "User not authenticated.",
  "deleteAccountConfirm": "Are you sure you want to delete your account? This action cannot be undone.",
  "failedDeleteAccount": "Failed to delete account.",
  "deleteAccount": "Delete Account",
  "editProfile": "Edit Profile",
  "selectSetting": "Select a setting to edit.",

cancel: "Cancel",
submit: "Submit",
"report.fraud": "Fraud",
"report.spam": "Spam",
"report.wrongCategory": "Wrong Category",
"report.sent": "Report submitted successfully",
"report.error": "Something went wrong. Please try again.",
   "customerSupport": "Customer Support"
  },
  ar: {
    // Header
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    addListing: "إضافة عرض",
    search: "البحث عن العروض...",
    categories: "الفئات",
profileImage: "تغيير الصورة الشخصية",
      coverImage: "تغيير صورة الغلاف",
      name: "تغيير الاسم",
      email: "تغيير البريد الإلكتروني",
      phone: "تغيير رقم الهاتف",
      password: "تغيير كلمة المرور",
    // Navigation
    home: "الرئيسية",
    "electrical-tools": "الأدوات الكهربائية",
    "construction-equipment": "معدات البناء",
    "iron-tools": "الأدوات الحديدية",
    "plastic-tools": "الأدوات البلاستيكية",
    "old-electronics": "الإلكترونيات المستعملة",
    "fashion": "أزياء",
    "furniture": "أثاث",
    "cars": "سيارات",
"twitter": "تويتر",
  "facebook": "فيسبوك",
  "instagram": "إنستغرام",
  "Change Profile Image": "تغيير الصورة الشخصية",
  "Change Cover Image": "تغيير صورة الغلاف",
  "Change Name": "تغيير الاسم",
  "Change Email": "تغيير البريد الإلكتروني",
  "Change Phone": "تغيير رقم الهاتف",
  "Change Password": "تغيير كلمة المرور",
  "settings": "الإعدادات",
  "loadingUser": "جاري تحميل المستخدم...",
  "pleaseLogin": "يرجى تسجيل الدخول للمتابعة.",
  "noUserData": "لا توجد بيانات للمستخدم.",
  "failedFetchUser": "فشل في جلب بيانات المستخدم.",
  "failedUpdateProfile": "فشل في تحديث الملف الشخصي.",
  "userNotAuthenticated": "المستخدم غير مصرح له.",
  "deleteAccountConfirm": "هل أنت متأكد أنك تريد حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.",
  "failedDeleteAccount": "فشل في حذف الحساب.",
  "deleteAccount": "حذف الحساب",
  "editProfile": "تعديل الملف الشخصي",
  "selectSetting": "اختر إعدادًا للتعديل.",


    // Homepage
    featuredBundles: "العروض المميزة",
    newBundles: "العروض الجديدة",
    browseAll: "تصفح الكل",

    // Listing
    bundleOf: "عرض من",
    items: "عناصر",
    seller: "البائع",
    location: "الموقع",
    contactSeller: "تواصل مع البائع",
    addToWishlist: "إضافة للمفضلة",
    reportListing: "بلاغ عن العرض",

    // Dashboard
    myListings: "عروضي",
    myOrders: "طلباتي",
    wishlist: "المفضلة",
    messages: "الرسائل",
    settings: "الإعدادات",

    // Forms
    title: "العنوان",
    description: "الوصف",
    price: "السعر",
    category: "الفئة",
    uploadImages: "رفع الصور",
    minimumThreeItems: "يجب إضافة 3 عناصر على الأقل لإنشاء عرض",
    addItem: "إضافة عنصر",
    removeItem: "إزالة عنصر",
    addProduct: "إضافة منتج",
    chooseImages: "اختر الصور",
    publishListing: "نشر الإعلان",
    minimumImages: "الحد الأدنى 3 صور",
    minimumProducts: "الحد الأدنى 3 منتجات",
    productName: "اسم المنتج",
    condition: "الحالة",
    originalPrice: "السعر الأصلي",
    selectCondition: "اختر الحالة",
    enterProductName: "أدخل اسم المنتج",
    priceInSAR: "السعر بالريال",
    cityOrArea: "المدينة أو المنطقة",
    enterListingTitle: "أدخل عنوان الإعلان",
    enterDetailedDescription: "أدخل وصف مفصل للإعلان",
    selectCategory: "اختر الفئة",
    publishing: "جارٍ النشر...",
    cancel: "إلغاء",

    // Footer
    aboutUs: "من نحن",
    termsOfService: "شروط الخدمة",
    privacyPolicy: "سياسة الخصوصية",
    contactUs: "تواصل معنا",
    followUs: "تابعنا",

    Main: "الرئيسية",
    Cars: "السيارات",
    Devices: "الأجهزة",
    "Livestock and Animals": "المواشي والحيوانات",
    Furniture: "الأثاث",
    Search: "بحث",
    Services: "الخدمات",
    "More Sections": "المزيد",
    searchGoods: "ابحث عن السلع...",
    all: "الكل",
    selectCategory: "اختر القسم",
    login: "تسجيل الدخول",
    addPost: "أضف إعلانك +",

    electronics: "إلكترونيات",
    bundleOf: "مجموعة من",
    items: "عناصر",
    reportListing: "الإبلاغ عن إعلان",
chooseReason: "اختر سبب البلاغ",
cancel: "إلغاء",
submit: "إرسال",
"report.fraud": "احتيال",
"report.spam": "سبام",
"report.wrongCategory": "الفئة غير صحيحة",
"report.sent": "تم إرسال البلاغ بنجاح",
"report.error": "حدث خطأ، حاول مرة أخرى",
 "customerSupport": "خدمة العملاء",

  CustomerMessages: 'رسائل العملاء',
  loadingMessages: 'جارٍ تحميل الرسائل...',
  noMessagesFound: 'لا توجد رسائل من العملاء.',
  failedToFetchMessages: 'فشل في جلب الرسائل',
  name: 'الاسم',
  email: 'البريد الإلكتروني',
  subject: 'الموضوع',
  message: 'الرسالة',
  reply: 'الرد',
  replyToEmail: 'الرد على البريد الإلكتروني',
  date: 'التاريخ',
   settings: 'الإعدادات',
    editProfile: 'تعديل ملفك الشخصي',
    selectSetting: 'اختر إعدادًا من اليسار لتعديل معلوماتك.',
    loadingUser: 'جارٍ تحميل بيانات المستخدم...',
    pleaseLogin: 'يرجى تسجيل الدخول للوصول إلى الإعدادات الخاصة بك.',
    noUserData: 'لم يتم العثور على بيانات المستخدم.',
    deleteAccountConfirm: 'هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.',
    deleteAccount: 'حذف الحساب',
    error: 'خطأ',
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("ar");
  const [isRTL, setIsRTL] = useState(true);

  useEffect(() => {
    // Only run on client side to avoid SSR issues
    if (typeof window !== 'undefined' && document) {
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language, isRTL]);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    setIsRTL(newLang === "ar");
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
