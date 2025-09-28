"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuthSimple } from "../../../hooks/useAuthSimple";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const { signIn, loading } = useAuthSimple();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Redirect is now handled automatically in useAuthSimple

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 ${isRTL ? 'font-cairo' : 'font-inter'}`}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header Section */}
          <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'مرحباً بعودتك' : 'Welcome Back'}
            </h1>
            <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'سجل دخولك للمتابعة' : 'Sign in to your account to continue'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'عنوان البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className={`flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
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

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'كلمة المرور' : 'Password'}
              </label>
              <div className={`flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Lock className={`w-5 h-5 text-gray-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
                  required
                  className={`w-full outline-none text-gray-900 placeholder-gray-500 bg-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label={showPassword ? (isRTL ? "إخفاء كلمة المرور" : "Hide password") : (isRTL ? "إظهار كلمة المرور" : "Show password")}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isRTL ? 'جاري تسجيل الدخول...' : 'Signing you in...'}
                </div>
              ) : (
                isRTL ? 'سجل دخولك إلى حسابك' : 'Sign In to Your Account'
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
                  {isRTL ? 'جديد على منصتنا؟' : 'New to our platform?'}
                </span>
              </div>
            </div>
          </div>

          <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="text-gray-600 mb-4">
              {isRTL ? 'ليس لديك حساب بعد؟' : "Don't have an account yet?"}
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              {isRTL ? 'إنشاء حسابك' : 'Create Your Account'}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}