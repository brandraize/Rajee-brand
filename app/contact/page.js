'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useLanguage } from '../context/LanguageContext';

export default function ContactUs() {
  const { t, isRTL } = useLanguage();

  const dir = isRTL ? 'rtl' : 'ltr';
  const align = isRTL ? 'text-right' : 'text-left';
  const font = isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} style={{ fontFamily: font }} className="min-h-screen bg-gray-50 flex flex-col">

      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center">
        <Image
          src="/images/contact.jpg" // ✅ from /public/images
          alt="Contact Cover"
          fill
          className="object-cover rounded-none"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            {t('contactUs')}
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            {isRTL
              ? "نحن هنا للرد على جميع استفساراتك ودعمك على مدار الساعة."
              : "We’re here to answer your queries and support you 24/7."}
          </p>
        </div>
      </section>

      {/* Intro Text inside Card */}
      <section className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
        <Card className="shadow-xl rounded-2xl">
          <CardContent className={`p-8 text-lg text-gray-700 ${align}`}>
            <p className="mb-3">
              {isRTL
                ? 'نحن نرحب بأي استفسارات أو ملاحظات لديك. هدفنا هو خدمتك بشكل أفضل.'
                : 'We welcome any inquiries or feedback you may have. Our goal is to serve you better.'}
            </p>
            <p className="mb-3">
              {isRTL
                ? 'لا تتردد في التواصل معنا عبر أي من الوسائل التالية.'
                : 'Feel free to reach out to us through any of the methods below.'}
            </p>
            <p className="mb-3">
              {isRTL
                ? 'نحن متواجدون على مدار الساعة للإجابة على استفساراتك.'
                : 'We’re available around the clock to answer your questions.'}
            </p>
            <p>
              {isRTL
                ? 'هدفنا هو تقديم أفضل تجربة ممكنة لك.'
                : 'Our mission is to provide you with the best experience possible.'}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Contact Section */}
      <section className="py-20 max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10">

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-md rounded-2xl hover:shadow-xl transition">
            <CardContent className="flex items-center gap-4 p-6">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <a
                href={
                  isRTL
                    ? 'https://wa.me/966501234567?text=مرحبا،%20أحتاج%20مساعدة.'
                    : 'https://wa.me/966501234567?text=Hello,%20I%20need%20help.'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                +966 50 123 4567 {isRTL ? '(واتساب)' : '(WhatsApp)'}
              </a>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-2xl hover:shadow-xl transition">
            <CardContent className="flex items-center gap-4 p-6">
              <Mail className="w-6 h-6 text-blue-600" />
              <a
                href="mailto:support@rajee.com"
                className="text-blue-600 hover:underline"
              >
                support@rajee.com {isRTL ? '(البريد الإلكتروني)' : '(Email)'}
              </a>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-2xl hover:shadow-xl transition">
            <CardContent className="flex items-center gap-4 p-6">
              <Phone className="w-6 h-6 text-gray-600" />
              <a href="tel:+966501234567" dir={isRTL ? 'rtl' : 'ltr'}>
                +966 50 123 4567 {isRTL ? '(الهاتف)' : '(Phone)'}
              </a>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-2xl hover:shadow-xl transition">
            <CardContent className="flex items-center gap-4 p-6">
              <MapPin className="w-6 h-6 text-red-600" />
              <span>
                {isRTL
                  ? 'الرياض، المملكة العربية السعودية'
                  : 'Riyadh, Saudi Arabia'}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-8 space-y-6">

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={isRTL ? 'اسمك' : 'Your Name'}
                required
                className="rounded-xl"
              />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={isRTL ? 'بريدك الإلكتروني' : 'Your Email'}
                required
                className="rounded-xl"
              />
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={isRTL ? 'الموضوع' : 'Subject'}
                required
                className="rounded-xl"
              />
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={isRTL ? 'رسالتك' : 'Your Message'}
                rows={5}
                required
                className="rounded-xl"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
                <span>
                  {loading
                    ? (isRTL ? 'جارٍ الإرسال...' : 'Sending...')
                    : (isRTL ? 'إرسال الرسالة' : 'Send Message')}
                </span>
              </Button>
            </form>

            {success && (
              <p className="text-green-600 text-center">
                {isRTL
                  ? 'تم إرسال رسالتك بنجاح!'
                  : 'Your message was sent successfully!'}
              </p>
            )}

            {error && (
              <p className="text-red-600 text-center">
                {isRTL
                  ? `حدث خطأ: ${error}`
                  : `An error occurred: ${error}`}
              </p>
            )}

            <p className="text-sm text-gray-500 text-center">
              {isRTL
                ? 'فريق الدعم لدينا يرد على جميع الرسائل خلال 24 ساعة.'
                : 'Our support team responds to all messages within 24 hours.'}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
