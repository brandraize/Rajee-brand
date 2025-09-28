'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, Trash2, Eye, MessageCircle, TrendingUp } from 'lucide-react';
import { auth } from '../../../configuration/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { useDeletePost } from '../../../hooks/useDeletePost';
import { DeleteConfirmDialog } from '../../../components/DeleteConfirmDialog';

export default function SellerDashboard() {
  const { t, isRTL } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { 
    showConfirmDialog, 
    isDeleting, 
    postToDelete,
    confirmDelete, 
    cancelDelete, 
    executeDelete 
  } = useDeletePost();

  useEffect(() => {
    const fetchMine = async (user) => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const token = await user.getIdToken();
        const res = await fetch('/api/posts/mine', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        const data = await res.json();
        if (data?.success) setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMine(user);
      } else {
        setLoading(false);
        setPosts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteConfirm = async () => {
    const result = await executeDelete();
    if (result.success) {
      // Remove the deleted post from the local state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete));
    }
  };

  const stats = [
    { label: isRTL ? 'إجمالي العروض' : 'Total Listings', value: posts.length, icon: TrendingUp },
    { label: isRTL ? 'العروض النشطة' : 'Active Listings', value: posts.filter(l => l.status === 'Active').length, icon: Eye },
    { label: isRTL ? 'قيد المراجعة' : 'Pending', value: posts.filter(l => l.status === 'Pending').length, icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
          >
            {t('myListings')}
          </h1>
          <Link
            href="/seller/add-listing"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
              {t('addListing')}
            </span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div
                    className="text-sm text-gray-600"
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2
              className="text-xl font-semibold text-gray-900"
              style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
            >
              {isRTL ? 'عروضي' : 'My Listings'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className={`px-6 py-4 text-sm font-medium text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {isRTL ? 'العرض' : 'Listing'}
                  </th>
                  <th
                    className={`px-6 py-4 text-sm font-medium text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {isRTL ? 'السعر' : 'Price'}
                  </th>
                  <th
                    className={`px-6 py-4 text-sm font-medium text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {isRTL ? 'الحالة' : 'Status'}
                  </th>
                  <th
                    className={`px-6 py-4 text-sm font-medium text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {isRTL ? 'المشاهدات' : 'Views'}
                  </th>
                  <th
                    className={`px-6 py-4 text-sm font-medium text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {isRTL ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td className="px-6 py-10 text-center text-gray-500" colSpan={5}>{isRTL ? 'جار التحميل...' : 'Loading...'}</td></tr>
                ) : posts.length === 0 ? (
                  <tr><td className="px-6 py-10 text-center text-gray-500" colSpan={5}>{isRTL ? 'لا توجد منشورات بعد' : 'No posts yet'}</td></tr>
                ) : posts.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          {listing.images?.[0] ? (
                            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <h4
                            className="font-medium text-gray-900"
                            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                          >
                            {listing.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {Array.isArray(listing.products) ? listing.products.length : 0} {t('items')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {listing.price ? (isRTL ? `${listing.price} ريال` : `$${listing.price}`) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          listing.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : listing.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {listing.status === 'Active'
                          ? (isRTL ? 'نشط' : 'Active')
                          : listing.status === 'Pending' ? (isRTL ? 'قيد المراجعة' : 'Pending') : (isRTL ? 'غير نشط' : 'Deactive')
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">-</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <Link
                          href={`/listing/${listing.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => confirmDelete(listing.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showConfirmDialog}
        onClose={cancelDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}