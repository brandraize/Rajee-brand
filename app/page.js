"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PostCard from "../components/PostCard";
import JobCard from "../components/JobCard";

import { useLanguage } from "./context/LanguageContext";
import { useNavigation } from "../hooks/useNavigation";
import { TrendingUp, Package, Users, ShoppingBag, Search, MessageCircle, Shield, Star } from "lucide-react";
import Sidebar from "../components/Sidebar";

import { redirect } from 'next/navigation';

export default function Home() {
  // redirect('/auth/login');
  const { t, isRTL } = useLanguage();
  const { getFilteredCategoriesList } = useNavigation();


  const [loadingPosts, setLoadingPosts] = useState(true);
  const [latestPosts, setLatestPosts] = useState([]);

  const allLatestPosts = [...latestPosts].slice(0, 12);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingPosts(true);
        const res = await fetch('/api/jobs?limit=12', { cache: 'no-store' });
        const data = await res.json();
        setLatestPosts(data?.posts || []);
      } catch (_) {
        setLatestPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };
    load();
  }, []);
 



  const categories = [
    {
      key: "electrical-tools",
      icon: "images/tourism.svg",
      count: 1250,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      key: "construction-equipment",
      icon: "/images/lost.svg",
      count: 980,
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600"
    },
    {
      key: "iron-tools",
      icon: "images/rarities.svg",
      count: 750,
      color: "bg-gray-50 border-gray-200",
      iconColor: "text-gray-600"
    },
    {
      key: "plastic-tools",
      icon: "/images/jobs.svg",
      count: 560,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600"
    },
    {
      key: "old-electronics",
      icon: "/images/devices.svg",
      count: 890,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600"
    },
    {
      key: "fashion",
      icon: "/images/art.svg",
      count: 0,
      color: "bg-pink-50 border-pink-200",
      iconColor: "text-pink-600"
    },
    {
      key: "furniture",
      icon: "/images/furniture.svg",
      count: 0,
      color: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-700"
    },
    {
      key: "cars",
      icon: "/images/cars.svg",
      count: 0,
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:block w-80 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Categories Section */}
       <section className="py-6 bg-gradient-to-br from-gray-50 to-blue-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-6">
      <h2
        className={`text-2xl font-bold text-gray-900 mb-4 ${isRTL ? "text-right" : "text-left"}`}
        style={{
          fontFamily: isRTL ? "Cairo, sans-serif" : "Inter, sans-serif",
        }}
      >
        {isRTL ? "أدوات ومعدات شائعة" : "Popular Tools & Equipment"}
      </h2>
    </div>

    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {categories.map((category) => (
        <a
          href={`/category/${category.key}`}
          key={category.key}
          className={`flex-none w-40 p-2 rounded-xl border-2 hover:shadow-lg transition-all duration-300 cursor-pointer group ${category.color} hover:scale-105`}
          style={{ height: "7rem" }} // reduced height
        >
          <div className="flex flex-col items-center text-center h-full justify-between">
            <div className={`w-10 h-8 rounded-full flex items-center justify-center ${category.color} border-2 border-current flex-shrink-0`}>
             <img
  src={category.icon}
  alt={category.key}
  className="w-7 h-7 object-contain group-hover:scale-110 transition-transform duration-300"
/>
            </div>
            <h3
              className="font-semibold text-gray-900 text-xs leading-tight break-words text-center overflow-hidden mb-1"
              style={{
                fontFamily: isRTL ? "Cairo, sans-serif" : "Inter, sans-serif",
                WebkitLineClamp: 2,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minHeight: "2rem",
              }}
            >
              {t(category.key)}
            </h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${category.iconColor} bg-white/50 whitespace-nowrap`}>
              {category.count.toLocaleString()}
            </span>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>




        {/* Latest Posts */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
           <div className="mb-8">
  <h2
    className={`text-3xl font-bold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}
    style={{ fontFamily: isRTL ? "Cairo, sans-serif" : "Inter, sans-serif" }}
  >
    {isRTL ? 'أحدث الإعلانات' : 'Latest Posts'}
  </h2>
</div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingPosts ? (
                <div className="col-span-full py-12 text-center text-gray-500">{isRTL ? 'جارٍ التحميل...' : 'Loading...'}</div>
              ) : allLatestPosts.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500">{isRTL ? 'لا توجد إعلانات' : 'No posts found'}</div>
              ) : (
                allLatestPosts.map((post) => <PostCard key={post.id} post={post} isRTL={isRTL} />)
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}