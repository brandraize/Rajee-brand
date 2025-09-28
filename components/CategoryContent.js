'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '/app/context/LanguageContext';
import PostCard from './PostCard';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CategoryContent({ slug }) {
  const { t, isRTL } = useLanguage();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const params = useSearchParams();
  const router = useRouter();

  const categoryTitle = t(slug);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // Fetch posts by category & onlyActive=true only, no filters
        const search = new URLSearchParams();
        search.set('category', slug);
     

        const res = await fetch(`/api/posts?${search.toString()}`, { cache: 'no-store' });
        const data = await res.json();

        setPosts(data?.posts || []);
      } catch (error) {
        console.error('Failed to load posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  // Extract filters from URL params
  const filters = useMemo(() => ({
    minPrice: params?.get('minPrice'),
    maxPrice: params?.get('maxPrice'),
    condition: params?.get('condition'),
    q: params?.get('q')?.toLowerCase() || '',
  }), [params]);

  // Apply filters on posts locally
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
        if (post.status !== 'Active') return false;
      // Filter by minPrice
      if (filters.minPrice && Number(post.price) < Number(filters.minPrice)) return false;

      // Filter by maxPrice
      if (filters.maxPrice && Number(post.price) > Number(filters.maxPrice)) return false;

      // Filter by condition (assuming post.condition is string)
      if (filters.condition && post.condition !== filters.condition) return false;

      // Filter by search query (title, description, or other fields)
      if (filters.q) {
        const haystack = [
          post.title?.toLowerCase() || '',
          post.description?.toLowerCase() || '',
          post.category?.toLowerCase() || ''
        ].join(' ');
        if (!haystack.includes(filters.q)) return false;
      }

      return true;
    });
  }, [posts, filters]);

  // Sorting filtered posts client-side
  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts];
    switch (sortBy) {
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        sorted.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    return sorted;
  }, [filteredPosts, sortBy]);

  const hasFilters = useMemo(() => {
    return ['minPrice', 'maxPrice', 'condition', 'q'].some(k => params?.get(k));
  }, [params]);

  const clearFilters = () => {
    router.push(`/category/${slug}`);
  };

  const getActiveFiltersCount = () => {
    return ['minPrice', 'maxPrice', 'condition', 'q'].filter(k => params?.get(k)).length;
  };

  const sortOptions = [
    { value: 'newest', label: isRTL ? 'الأحدث أولاً' : 'Newest First' },
    { value: 'oldest', label: isRTL ? 'الأقدم أولاً' : 'Oldest First' },
    { value: 'price-low', label: isRTL ? 'السعر من الأقل للأعلى' : 'Price: Low to High' },
    { value: 'price-high', label: isRTL ? 'السعر من الأعلى للأقل' : 'Price: High to Low' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
              {categoryTitle}
            </h1>
            <p className="text-gray-600" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
              {loading ? (isRTL ? 'جارٍ التحميل...' : 'Loading...') : `${sortedPosts.length} ${isRTL ? 'إعلان متاح' : 'posts available'}`}
            </p>
          </div>
        </div>

        {/* Filters and Sort Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => {
                  const el = document.getElementById('filters');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                  getActiveFiltersCount() > 0
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">{isRTL ? 'التصفية' : 'Filters'}</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  {isRTL ? 'مسح التصفية' : 'Clear Filters'}
                </button>
              )}

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`appearance-none px-4 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className={`flex items-center gap-1 p-1 bg-gray-100 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {loading ? (
            <div className="col-span-full py-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>{isRTL ? 'جارٍ التحميل...' : 'Loading posts...'}</span>
              </div>
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isRTL ? 'لا توجد نتائج' : 'No posts found'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {isRTL ? 'جرب تعديل معايير البحث أو التصفية' : 'Try adjusting your search or filter criteria'}
                </p>
                <button
                  onClick={() => {
                    const el = document.getElementById('filters');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {isRTL ? 'تطبيق تصفية' : 'Apply Filters'}
                </button>
              </div>
            </div>
          ) : (
            sortedPosts.map((post) => (
              <PostCard key={post.id} post={post} isRTL={isRTL} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
 