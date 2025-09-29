"use client";

import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { AlertTriangle, Info, Send } from "lucide-react";

export default function ReportIssuePage() {
  const { language, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openGuidelines, setOpenGuidelines] = useState(false);

  const issueOptions = [
    { value: "fraud", label: { en: "Fraud", ar: "احتيال" } },
    { value: "spam", label: { en: "Spam", ar: "سبام" } },
    { value: "wrongCategory", label: { en: "Wrong Category", ar: "الفئة غير صحيحة" } },
    { value: "harassment", label: { en: "Harassment", ar: "مضايقة" } },
    { value: "other", label: { en: "Other", ar: "أخرى" } },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSubmitted(false);

    try {
      const response = await fetch("/api/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit report");

      setSubmitted(true);
      setFormData({ name: "", email: "", issueType: "", description: "" });
    } catch (err) {
      setErrorMsg(language === "ar" ? "فشل إرسال البلاغ. حاول مرة أخرى." : "Failed to submit report. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 relative ${isRTL ? "rtl" : "ltr"}`}>
      <h1 className="text-3xl font-bold text-center mb-8">
        {language === "ar" ? "الإبلاغ عن مشكلة - رجيع" : "Report an Issue - Rajee"}
      </h1>

      {/* Form */}
      <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">
          {language === "ar" ? "تفاصيل البلاغ" : "Report Details"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder={language === "ar" ? "الاسم" : "Name"}
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"}
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <select
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">
              {language === "ar" ? "اختر نوع المشكلة" : "Select Issue Type"}
            </option>
            {issueOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {language === "ar" ? opt.label.ar : opt.label.en}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            rows={5}
            placeholder={language === "ar" ? "وصف المشكلة" : "Issue Description"}
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-105"
          >
            <Send className="w-5 h-5" />
            {loading
              ? language === "ar"
                ? "جاري الإرسال..."
                : "Submitting..."
              : language === "ar"
              ? "إرسال البلاغ"
              : "Submit Report"}
          </button>
        </form>

        {submitted && (
          <p className="text-green-600 font-semibold mt-4 text-center">
            {language === "ar"
              ? "تم إرسال البلاغ بنجاح."
              : "Your report has been submitted successfully."}
          </p>
        )}
        {errorMsg && (
          <p className="text-red-600 font-semibold mt-4 text-center">{errorMsg}</p>
        )}
      </div>

      {/* Guidelines Accordion */}
      <div className="mt-6 border rounded-2xl shadow-lg bg-gradient-to-r from-indigo-50 to-indigo-100">
        <button
          onClick={() => setOpenGuidelines(!openGuidelines)}
          className="w-full flex items-center justify-between px-4 py-3 font-semibold text-indigo-900"
        >
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" />
            {language === "ar" ? "إرشادات" : "Guidelines"}
          </div>
          {openGuidelines ? "▲" : "▼"}
        </button>
        {openGuidelines && (
          <div className="px-4 py-3 text-gray-700">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                {language === "ar"
                  ? "يرجى تقديم معلومات دقيقة وصحيحة."
                  : "Please provide accurate and truthful information."}
              </li>
              <li>
                {language === "ar"
                  ? "سيتم التعامل مع جميع البلاغات بسرية تامة."
                  : "All reports will be handled confidentially."}
              </li>
              <li>
                {language === "ar"
                  ? "يمكن متابعة البلاغ عبر البريد الإلكتروني."
                  : "You can follow up on your report via email."}
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Flowing subtle background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-200 via-blue-50 to-indigo-200 opacity-20 animate-[pulse_10s_ease-in-out_infinite] rounded-3xl"></div>
    </div>
  );
}
