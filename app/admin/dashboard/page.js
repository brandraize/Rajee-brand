'use client';

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle, XCircle, Eye, Users, Package, TrendingUp, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { useAdminPosts } from '../../../hooks/useAdminPosts';
import Link from 'next/link';

function AdminDashboard() {
  const { isRTL } = useLanguage();
  const { 
    posts, 
    loading, 
    updatingStatus, 
    updatePostStatus, 
    getPostsByStatus, 
    getStats 
  } = useAdminPosts();

  // ✅ States
  const [activeTab, setActiveTab] = useState('pending');
  
  // Get stats from the hook
  const statsData = getStats();

  const stats = [
    { label: isRTL ? 'إجمالي الإعلانات' : 'Total Posts', value: statsData.total, icon: Package, color: 'blue' },
    { label: isRTL ? 'العروض النشطة' : 'Active Listings', value: statsData.active, icon: CheckCircle, color: 'green' },
    { label: isRTL ? 'قيد المراجعة' : 'Pending Review', value: statsData.pending, icon: Clock, color: 'yellow' },
    { label: isRTL ? 'غير نشطة' : 'Inactive', value: statsData.deactive, icon: XCircle, color: 'red' },
  ];

  const tabs = [
    { key: 'pending', label: isRTL ? 'قيد المراجعة' : 'Pending Approval' },
    { key: 'active', label: isRTL ? 'نشطة' : 'Active' },
    { key: 'inactive', label: isRTL ? 'غير نشطة' : 'Inactive' },
    { key: 'all', label: isRTL ? 'جميع الإعلانات' : 'All Posts' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className={`text-3xl font-bold text-gray-900 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'لوحة الإدارة' : 'Admin Dashboard'}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b border-gray-200">
            <nav className={`flex space-x-8 px-6 ${isRTL ? 'space-x-reverse' : ''}`}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Posts Management */}
            {activeTab === "pending" && (
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <p className="text-gray-500">{isRTL ? "جارٍ التحميل..." : "Loading..."}</p>
                  </div>
                ) : getPostsByStatus('Pending').length === 0 ? (
                  <p className="text-gray-500 text-center py-8">{isRTL ? "لا توجد إعلانات قيد المراجعة" : "No pending posts"}</p>
                ) : (
                  getPostsByStatus('Pending').map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      onStatusUpdate={updatePostStatus}
                      isUpdating={updatingStatus[post.id]}
                      isRTL={isRTL}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "active" && (
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <p className="text-gray-500">{isRTL ? "جارٍ التحميل..." : "Loading..."}</p>
                  </div>
                ) : getPostsByStatus('Active').length === 0 ? (
                  <p className="text-gray-500 text-center py-8">{isRTL ? "لا توجد إعلانات نشطة" : "No active posts"}</p>
                ) : (
                  getPostsByStatus('Active').map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      onStatusUpdate={updatePostStatus}
                      isUpdating={updatingStatus[post.id]}
                      isRTL={isRTL}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "inactive" && (
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <p className="text-gray-500">{isRTL ? "جارٍ التحميل..." : "Loading..."}</p>
                  </div>
                ) : getPostsByStatus('Deactive').length === 0 ? (
                  <p className="text-gray-500 text-center py-8">{isRTL ? "لا توجد إعلانات غير نشطة" : "No inactive posts"}</p>
                ) : (
                  getPostsByStatus('Deactive').map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      onStatusUpdate={updatePostStatus}
                      isUpdating={updatingStatus[post.id]}
                      isRTL={isRTL}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "all" && (
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <p className="text-gray-500">{isRTL ? "جارٍ التحميل..." : "Loading..."}</p>
                  </div>
                ) : posts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">{isRTL ? "لا توجد إعلانات" : "No posts found"}</p>
                ) : (
                  posts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      onStatusUpdate={updatePostStatus}
                      isUpdating={updatingStatus[post.id]}
                      isRTL={isRTL}
                    />
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// PostCard component for displaying individual posts
const PostCard = ({ post, onStatusUpdate, isUpdating, isRTL }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Deactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Active': return isRTL ? 'نشط' : 'Active';
      case 'Pending': return isRTL ? 'قيد المراجعة' : 'Pending';
      case 'Deactive': return isRTL ? 'غير نشط' : 'Inactive';
      default: return status;
    }
  };

  const handleStatusChange = async (newStatus) => {
    await onStatusUpdate(post.id, newStatus);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
          <div className="flex items-center space-x-3 mb-2">
            {post.images?.[0] && (
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={post.images[0]} 
                  alt={post.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-lg">{post.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">{isRTL ? "الموقع:" : "Location:"}</span>
              <span className="ml-1">{post.location}</span>
            </div>
            <div>
              <span className="font-medium">{isRTL ? "السعر:" : "Price:"}</span>
              <span className="ml-1">
                {isRTL ? `${post.price} ريال` : `$${post.price}`}
              </span>
            </div>
            <div>
              <span className="font-medium">{isRTL ? "الفئة:" : "Category:"}</span>
              <span className="ml-1">{post.category}</span>
            </div>
            <div>
              <span className="font-medium">{isRTL ? "المنتجات:" : "Products:"}</span>
              <span className="ml-1">{post.products?.length || 0}</span>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {isRTL ? "التاريخ:" : "Date:"} {post.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}
          </div>
        </div>

        <div className={`flex flex-col items-end space-y-2 ${isRTL ? "items-start" : "items-end"}`}>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
            {getStatusLabel(post.status)}
          </span>

          <div className={`flex items-center space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
            <Link
              href={`/listing/${post.id}`}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title={isRTL ? "عرض" : "View"}
            >
              <Eye className="w-4 h-4" />
            </Link>

            {post.status === 'Pending' && (
              <>
                <button
                  onClick={() => handleStatusChange('Active')}
                  disabled={isUpdating}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                  title={isRTL ? "موافقة" : "Approve"}
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleStatusChange('Deactive')}
                  disabled={isUpdating}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                  title={isRTL ? "رفض" : "Reject"}
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                </button>
              </>
            )}

            {post.status === 'Active' && (
              <button
                onClick={() => handleStatusChange('Deactive')}
                disabled={isUpdating}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                title={isRTL ? "إلغاء التفعيل" : "Deactivate"}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              </button>
            )}

            {post.status === 'Deactive' && (
              <button
                onClick={() => handleStatusChange('Active')}
                disabled={isUpdating}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                title={isRTL ? "تفعيل" : "Activate"}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
