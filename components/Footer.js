'use client';

import Link from 'next/link';
import { useLanguage } from '../app/context/LanguageContext';
import { Mail, Phone, MapPin, Twitter, Instagram, Youtube, Facebook, Heart } from 'lucide-react';

export default function Footer() {
  const { t, isRTL } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
                {isRTL ? 'رجيع' : 'Rajee'}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
              {isRTL 
                ? 'منصة رجيع للبيع والشراء - مكانك الآمن لبيع وشراء البضائع المستعملة والجديدة' 
                : 'Rajee Marketplace - Your safe place to buy and sell new and used goods'
              }
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isRTL ? 'الرئيسية' : 'Home'}
                </Link>
              </li>
              <li>
                <Link href="/category/electrical-tools" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isRTL ? 'أدوات كهربائية' : 'Electrical tools'}
                </Link>
              </li>
              <li>
                <Link href="/category/construction-equipment" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isRTL ? 'معدات بناء' : 'Construction equipment'}
                </Link>
              </li>
              <li>
                <Link href="/category/iron-tools" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isRTL ? 'حديد' : 'Iron'}
                </Link>
              </li>
              <li>
                <Link href="/category/plastic-tools" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isRTL ? 'بلاستيك' : 'Plastic'}
                </Link>
              </li>
              <li>
                <Link href="/category/old-electronics" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isRTL ? 'الكترونيات قديمة' : 'Old electronics'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
              {isRTL ? 'الدعم' : 'Support'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isRTL ? 'مركز المساعدة' : 'Help Center'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isRTL ? 'اتصل بنا' : 'Contact Us'}
                </Link>
              </li>
              <li>
                <Link href="/safetycenter" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isRTL ? 'مركز الأمان' : 'Safety Center'}
                </Link>
              </li>
              <li>
                <Link href="/issue" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isRTL ? 'الإبلاغ عن مشكلة' : 'Report Issue'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
              {isRTL ? 'تواصل معنا' : 'Contact Info'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">support@rajee.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">+966 50 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">
                  {isRTL ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
                © {currentYear} {isRTL ? 'رجيع' : 'Rajee'}. {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacypolicy" className="text-gray-400 hover:text-white transition-colors">
                {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                {isRTL ? 'شروط الاستخدام' : 'Terms of Service'}
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                {isRTL ? 'ملفات تعريف الارتباط' : 'Cookie Policy'}
              </Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs flex items-center justify-center space-x-1">
              <span>{isRTL ? 'صُنع بـ' : 'Made with'}</span>
              <Heart className="w-3 h-3 text-red-500 fill-current" />
              <span>{isRTL ?  'برعاية BrandRaize' : 'by BrandRaize'}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}