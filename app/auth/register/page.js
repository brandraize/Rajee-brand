'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuthSimple } from '../../../hooks/useAuthSimple';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const { t, isRTL } = useLanguage();
  const { signUp, loading, validateForm } = useAuthSimple();

  // Normalize phone number
 function normalizePhoneNumber(phone) {
  if (!phone) return '';

  phone = phone.trim();

  if (phone.startsWith('+')) {
    return phone; // already international format
  }

  if (phone.startsWith('0')) {
    return '+966' + phone; // keep the 0 and prefix +966
  }

  return '+' + phone; // fallback for other numbers
}


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const validation = validateForm(formData.email, formData.password, formData.name);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    const normalizedPhone = normalizePhoneNumber(formData.phone);

    // Optional: validate phone number length and characters
    if (normalizedPhone && normalizedPhone.length > 30) {
      alert('Phone number is too long!');
      return;
    }

    // Optional: regex to validate phone number format (basic check)
    const phoneRegex = /^\+\d{7,15}$/;
    if (normalizedPhone && !phoneRegex.test(normalizedPhone)) {
      alert('Invalid phone number format!');
      return;
    }

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: normalizedPhone,
          // Removed userType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register user');
      }

      alert('Account created successfully!');
   window.location.href = '/auth/login';

      // Redirect logic here if needed
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center py-12 px-4 ${isRTL ? 'font-cairo' : 'font-inter'}`}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'إنشاء حساب' : 'Create Account'}
            </h1>
            <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'انضم إلى منصتنا وابدأ رحلتك' : 'Join our platform and start your journey'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <div className={`flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                <User className={`w-5 h-5 text-gray-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  required
                  className={`w-full outline-none text-gray-900 placeholder-gray-500 bg-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'عنوان البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className={`flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className={`w-5 h-5 text-gray-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={isRTL ? 'أدخل عنوان بريدك الإلكتروني' : 'Enter your email address'}
                  required
                  className={`w-full outline-none text-gray-900 placeholder-gray-500 bg-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label htmlFor="phone" className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'رقم الهاتف' : 'Phone Number'} <span className="text-gray-400">{isRTL ? '(اختياري)' : '(Optional)'}</span>
              </label>
              <div className={`flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className={`w-5 h-5 text-gray-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <input
  id="phone"
  type="text"
  name="phone"
  value={formData.phone}
  onChange={(e) => {
    let value = e.target.value;

    // Remove all invalid chars (anything but digits and +)
    value = value.replace(/[^+\d]/g, '');

    // Only allow + at start
    if (value.indexOf('+') > 0) {
      value = value.replace(/\+/g, '');
    }

    // Limit to max 15 characters
    if (value.length > 15) {
      value = value.slice(0, 15);
    }

    setFormData({
      ...formData,
      phone: value,
    });
  }}
  placeholder={isRTL ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
  className={`w-full outline-none text-gray-900 placeholder-gray-500 bg-transparent ${isRTL ? 'text-right' : 'text-left'}`}
/>

              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'كلمة المرور' : 'Password'}
              </label>
              <div className={`flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Lock className={`w-5 h-5 text-gray-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isRTL ? 'أنشئ كلمة مرور قوية' : 'Create a strong password'}
                  required
                  className={`w-full outline-none text-gray-900 placeholder-gray-500 bg-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label={showPassword ? (isRTL ? 'إخفاء كلمة المرور' : 'Hide password') : (isRTL ? 'إظهار كلمة المرور' : 'Show password')}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              </label>
              <div className={`flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Lock className={`w-5 h-5 text-gray-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={isRTL ? 'أكد كلمة المرور' : 'Confirm your password'}
                  required
                  className={`w-full outline-none text-gray-900 placeholder-gray-500 bg-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isRTL ? 'جاري إنشاء حسابك...' : 'Creating your account...'}
                </div>
              ) : (
                isRTL ? 'إنشاء حسابك' : 'Create Your Account'
              )}
            </button>


             {/* Forgot Password Link */}
  <div className={`text-sm mt-2 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
    <a
      href="/forgotPass"  // or your actual forgot password page route
      className="text-green-600 hover:underline cursor-pointer"
    >
      {isRTL ? 'هل نسيت كلمة المرور؟' : 'Forgot Password?'}
    </a>
  </div>
          </form>


          {/* Divider */}
          <div className="mt-8 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
                </span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="text-gray-600 mb-4">
              {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200"
            >
              {isRTL ? 'سجل دخول بدلاً من ذلك' : 'Sign In Instead'}
            </Link>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className={`text-sm font-semibold text-green-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'ماذا يحدث بعد ذلك؟' : 'What happens next?'}
            </h3>
            <div className={`text-xs text-green-700 space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p>• {isRTL ? 'سيتم إنشاء حسابك فوراً' : 'Your account will be created instantly'}</p>
              <p>• {isRTL ? 'ستتم إعادة توجيهك إلى المنصة الرئيسية' : "You'll be redirected to the main platform"}</p>
              <p>• {isRTL ? 'ابدأ الاستكشاف والتواصل مع الآخرين' : 'Start exploring and connecting with others'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
