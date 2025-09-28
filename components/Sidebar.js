"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../app/context/LanguageContext";
import { useNavigation } from "../hooks/useNavigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, X, ChevronDown, Search, Plus, Minus } from "lucide-react";

export default function Sidebar() {
  const { t, isRTL } = useLanguage();
  const { getFilteredCategoriesList } = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [quickNavigateExpanded, setQuickNavigateExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
const [searchQuery, setSearchQuery] = useState(params.get('q') || '');
const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [q, setQ] = useState("");

  // Sync from URL
  useEffect(() => {
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
    setCondition(params.get("condition") || "");
    setQ(params.get("q") || "");
  }, [params]);

  const hasAnyFilter = useMemo(() => {
    return Boolean(minPrice || maxPrice || condition || q);
  }, [minPrice, maxPrice, condition, q]);

  const currentCategorySlug = useMemo(() => {
    const parts = (pathname || "").split("/").filter(Boolean);
    return (parts[0] === "category" && parts[1]) ? parts[1] : "Main";
  }, [pathname]);
const handleApply = () => {
  const params = new URLSearchParams();

  if (minPrice) params.set('min', minPrice);
  if (maxPrice) params.set('max', maxPrice);
  if (condition) params.set('condition', condition);

  router.push(`${pathname}?${params.toString()}`);

  // Optional: Close the drawer if applicable
  if (typeof setIsDrawerOpen === 'function') {
    setIsDrawerOpen(false);
  }
};
  const pushWithFilters = (slug) => {
    const search = new URLSearchParams();
    if (minPrice) search.set("minPrice", String(minPrice));
    if (maxPrice) search.set("maxPrice", String(maxPrice));
    if (condition) search.set("condition", String(condition));
    if (q) search.set("q", String(q));
    const query = search.toString();
    const dest = `/category/${slug}${query ? `?${query}` : ""}`;
    router.push(dest);
  };

const handleSearch = () => {
  if (!searchQuery) return;
  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
};

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setCondition("");
    setQ("");
    router.push(`/`);
  };
  const quickMap = [
    { label: isRTL ? 'أدوات كهربائية' : 'Electrical tools', slug: 'electrical-tools' },
    { label: isRTL ? 'معدات بناء' : 'Construction equipment', slug: 'construction-equipment' },
    { label: isRTL ? 'حديد' : 'Iron', slug: 'iron-tools' },
    { label: isRTL ? 'بلاستيك' : 'Plastic', slug: 'plastic-tools' },
    { label: isRTL ? 'الكترونيات قديمة' : 'Old electronics', slug: 'old-electronics' },
  ];

  const carCategories = [
    { name: "قطع غيار وملحقات", label: "Parts and Accessories", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/parts.svg" },
    { name: "شاحنات ومعدات ثقيلة", label: "Trucks and Heavy Equipment", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/truck.svg" },
    { name: "دبابات", label: "Motorcycles", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/quad-car.svg" },
    { name: "سيارات تراثية", label: "Classic Cars", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/heritage-car.svg" },
    { name: "مصدوم", label: "Crashed Cars", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/crash-car.svg" },
    { name: "للتنازل", label: "Car For Lease", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/car-loan.svg" },
  ];

  const deviceBrands = [
    { name: "ابل Apple", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/apple-icon.svg" },
    { name: "سامسونج Samsung", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/samsung-icon.svg" },
    { name: "كانون Canon", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/canon-icon.svg" },
    { name: "سوني Sony", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/sony-icon.svg" },
    { name: "مايكروسوفت Microsoft", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/microsoft-logo.svg" },
    { name: "نوكيا Nokia", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/nokia-icon.svg" },
    { name: "ال جي LG", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/lg-logo.svg" },
    { name: "أرقام مميزة", label: "Unique numbers" },
  ];

  const animalCategories = [
    { name: "غنم", label: "Sheep", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/sheep.svg" },
    { name: "ببغاء", label: "Parrot", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/parrot.svg" },
    { name: "حمام", label: "Birds", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/birds.svg" },
    { name: "قطط", label: "Cats", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/cat.svg" },
    { name: "دجاج", label: "Chicken", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/chicken.svg" },
    { name: "ماعز", label: "Goat", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/goat.svg" },
    { name: "أبل", label: "Camel", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/camel.svg" },
    { name: "خيل", label: "Horse", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/horse.svg" },
    { name: "كلاب", label: "Dog", logo: "https://v8-cdn.haraj.com.sa/assets/images/svg/dog.svg" },
  ];


  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-30 bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        <Filter size={24} />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:sticky top-0 ${isRTL ? 'right-0' : 'left-0'}
          h-screen w-80 bg-white shadow-lg z-50 md:z-auto overflow-y-auto sidebar-scroll
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
          md:translate-x-0 md:shadow-none
        `}
      >
        <div className="p-4">
          {/* Categories (shared) */}
          <div className="mb-5">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-900">{t("categories")}</h3>
              <p className="text-xs text-gray-500 mt-1">{isRTL ? 'استكشف الأقسام' : 'Browse all sections'}</p>
            </div>
            <div className="space-y-2">
              {getFilteredCategoriesList().map((c) => {
                const active = currentCategorySlug === c.slug;
                return (
                  <button
                    key={c.slug}
                    onClick={() => pushWithFilters(c.slug)}
                    className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg border transition-all
                      ${active
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-400'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${active ? 'bg-blue-600' : 'bg-gray-300 group-hover:bg-gray-400'}`}></span>
                      <span className="text-sm">{t(c.slug) || t(c.key)}</span>
                    </span>
                    <svg className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Search */}
       
{/* Sidebar Search Input */}
<div className="mb-4">
  <div className="relative group">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
    </div>
    <input
      type="search"
      placeholder={t("searchGoods")}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearch();
          setIsDrawerOpen(false); // close drawer after search
        }
      }}
      className={`w-full h-10 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200
        ${isRTL ? 'text-right' : 'text-left'}`}
    style={{ fontFamily: 'Arial, sans-serif' }}

    />
    <button
      type="submit"
      onClick={(e) => {
        e.preventDefault();
        handleSearch();
        setIsDrawerOpen(false); // close drawer after search
      }}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors"
      aria-label="Search"
    >
      <Search className="w-4 h-4" />
    </button>
  </div>
</div>



          {/* Filters Section */}
          <div className="mb-5">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-900">{isRTL ? 'التصفية' : 'Filters'}</h3>
              <p className="text-xs text-gray-500 mt-1">{isRTL ? 'قم بتصفية النتائج' : 'Refine your search'}</p>
            </div>

            <div className="space-y-4">
              {/* Price Range */}
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">{isRTL ? 'نطاق السعر' : 'Price Range'}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{isRTL ? 'من' : 'Min'}</label>
                    <input
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{isRTL ? 'إلى' : 'Max'}</label>
                    <input
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      type="number"
                      min="0"
                      placeholder="∞"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">{isRTL ? 'الحالة' : 'Condition'}</h4>
                <div className="space-y-2">
                  {[
                    { value: '', label: isRTL ? 'الكل' : 'All' },
                    { value: 'new', label: isRTL ? 'جديد' : 'New' },
                    { value: 'like-new', label: isRTL ? 'جديد تقريباً' : 'Like New' },
                    { value: 'excellent', label: isRTL ? 'ممتاز' : 'Excellent' },
                    { value: 'good', label: isRTL ? 'جيد' : 'Good' },
                    { value: 'fair', label: isRTL ? 'مقبول' : 'Fair' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="condition"
                        value={option.value}
                        checked={condition === option.value}
                        onChange={(e) => setCondition(e.target.value)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleApply}
                  className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {isRTL ? 'تطبيق التصفية' : 'Apply Filters'}
                </button>
                <button
                  onClick={handleClear}
                  disabled={!hasAnyFilter}
                  className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRTL ? 'مسح الكل' : 'Clear All'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Navigate Section */}
          <div className="bg-white border-b border-gray-300 text-gray-900 pb-4 pt-4">
            <button
              className="flex w-full cursor-pointer items-center justify-between font-bold"
              onClick={() => setQuickNavigateExpanded(!quickNavigateExpanded)}
            >
              <span>Quick Navigate</span>
              {quickNavigateExpanded ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            <div className={`select-none transition-all duration-150 ${quickNavigateExpanded ? 'block' : 'hidden'}`}>
              <div id="mark" className="border-t border-gray-300 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  {quickMap.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => pushWithFilters(item.slug)}
                      className="w-full border border-gray-300 rounded p-3 text-sm text-gray-700 hover:text-gray-900 hover:border-gray-900"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}