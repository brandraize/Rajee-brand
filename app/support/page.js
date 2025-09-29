'use client';
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function CallCenterPage() {
  const { t, isRTL } = useLanguage();
  const dir = isRTL ? "rtl" : "ltr";
  const font = isRTL ? "Cairo, sans-serif" : "Inter, sans-serif";
  const align = isRTL ? "text-right" : "text-left";

  return (
    <div
      className="min-h-screen flex flex-col"
      dir={dir}
      style={{ fontFamily: font }}
    >
      {/* Hero Section with overlay text */}
      <section className="relative w-full h-[90vh] flex items-center justify-center">
        <Image
          src="/images/customer.jpg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Main Centered Text */}
        <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
  {t("customerSupport")}
</h1>
  <p className="text-lg md:text-xl text-white/90">
            {isRTL
              ? "نحن هنا للرد على جميع استفساراتك ودعمك على مدار الساعة."
              : "We’re here to answer your queries and support you 24/7."}
          </p>
         
        </div>

       
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* WhatsApp */}
          <a
            href={
              isRTL
                ? "https://wa.me/966501234567?text=مرحبا،%20أحتاج%20مساعدة."
                : "https://wa.me/966501234567?text=Hello,%20I%20need%20help."
            }
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center text-center"
          >
            <MessageCircle className="w-8 h-8 text-green-600 mb-3" />
            <p className="font-semibold text-gray-800">
              {isRTL ? "واتساب" : "WhatsApp"}
            </p>
            <p className="text-gray-600 text-sm mt-1">+966 50 123 4567</p>
          </a>

          {/* Email */}
          <a
            href="mailto:support@rajee.com"
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center text-center"
          >
            <Mail className="w-8 h-8 text-blue-600 mb-3" />
            <p className="font-semibold text-gray-800">
              {isRTL ? "البريد الإلكتروني" : "Email"}
            </p>
            <p className="text-gray-600 text-sm mt-1">support@rajee.com</p>
          </a>

          {/* Phone */}
          <a
            href="tel:+966501234567"
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center text-center"
          >
            <Phone className="w-8 h-8 text-gray-600 mb-3" />
            <p className="font-semibold text-gray-800">
              {isRTL ? "الهاتف" : "Phone"}
            </p>
            <p className="text-gray-600 text-sm mt-1">+966 50 123 4567</p>
          </a>

          {/* Address */}
          <a
            href="https://www.google.com/maps?q=Riyadh,Saudi+Arabia"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center text-center"
          >
            <MapPin className="w-8 h-8 text-red-600 mb-3" />
            <p className="font-semibold text-gray-800">
              {isRTL ? "العنوان" : "Address"}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {isRTL ? "الرياض، السعودية" : "Riyadh, Saudi Arabia"}
            </p>
          </a>
        </div>
      </section>

      {/* Footer */}
     
    </div>
  );
}
