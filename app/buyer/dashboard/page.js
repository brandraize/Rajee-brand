'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import BundleCard from '../../../components/BundleCard';
import { Heart, ShoppingBag, MessageCircle, Settings, Package, Clock } from 'lucide-react';

export default function BuyerDashboard() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('orders');

  const sampleOrders = [
    {
      id: 1,
      title: isRTL ? 'مجموعة أجهزة إلكترونية للمنزل الذكي' : 'Smart Home Electronics Bundle',
      price: 1250,
      status: 'delivered',
      orderDate: '2025-01-03',
      seller: isRTL ? 'أحمد التقني' : 'Ahmed Tech',
      image: 'https://images.pexels.com/photos/4790268/pexels-photo-4790268.jpeg',
    },
    {
      id: 2,
      title: isRTL ? 'مجموعة ملابس رجالية كاملة' : 'Complete Men\'s Fashion Bundle',
      price: 850,
      status: 'in-transit',
      orderDate: '2025-01-05',
      seller: isRTL ? 'متجر الأناقة' : 'Style Store',
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    },
  ];

  const sampleWishlist = [
    {
      id: 3,
      title: isRTL ? 'مجموعة أثاث غرفة المعيشة' : 'Living Room Furniture Set',
      price: 2200,
      category: t('furniture'),
      images: ['https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'],
      itemCount: 3,
      location: isRTL ? 'الدمام' : 'Dammam',
      seller: isRTL ? 'أثاث المنزل' : 'Home Furniture',
      timeAgo: isRTL ? 'منذ يوم واحد' : '1 day ago',
    },
  ];

  const tabs = [
    { key: 'orders', label: t('myOrders'), icon: ShoppingBag },
    { key: 'wishlist', label: t('wishlist'), icon: Heart },
    { key: 'messages', label: t('messages'), icon: MessageCircle },
    { key: 'settings', label: t('settings'), icon: Settings },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      delivered: isRTL ? 'تم التسليم' : 'Delivered',
      'in-transit': isRTL ? 'في الطريق' : 'In Transit',
      pending: isRTL ? 'قيد المعالجة' : 'Pending',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 
          className={`text-3xl font-bold text-gray-900 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
        >
          {isRTL ? 'لوحة المشتري' : 'Buyer Dashboard'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    } ${isRTL ? 'space-x-reverse flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
                      {tab.label}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h2 
                    className="text-xl font-semibold text-gray-900"
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {t('myOrders')}
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {sampleOrders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={order.image}
                            alt={order.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h3 
                              className="font-medium text-gray-900"
                              style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                            >
                              {order.title}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          
                          <div className={`flex items-center justify-between mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-lg font-bold text-blue-600">
                              {isRTL ? `${order.price} ريال` : `$${order.price}`}
                            </span>
                            <span className="text-sm text-gray-500">
                              {isRTL ? 'تاريخ الطلب:' : 'Order Date:'} {order.orderDate}
                            </span>
                          </div>
                          
                          <p 
                            className="text-sm text-gray-600 mt-1"
                            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                          >
                            {isRTL ? 'البائع:' : 'Seller:'} {order.seller}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h2 
                    className="text-xl font-semibold text-gray-900"
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {t('wishlist')}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sampleWishlist.map((bundle) => (
                    <BundleCard key={bundle.id} bundle={bundle} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 
                  className="text-xl font-semibold text-gray-900 mb-6"
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('messages')}
                </h2>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h4 
                              className="font-medium text-gray-900"
                              style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                            >
                              {isRTL ? `البائع ${i}` : `Seller ${i}`}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {isRTL ? 'منذ ساعة' : '1h ago'}
                            </span>
                          </div>
                          <p 
                            className={`text-sm text-gray-600 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}
                            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                          >
                            {isRTL ? 'شكراً لاهتمامك بالعرض...' : 'Thanks for your interest in the bundle...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 
                  className="text-xl font-semibold text-gray-900 mb-6"
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('settings')}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label 
                      className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}
                      style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                    >
                      {isRTL ? 'الاسم' : 'Name'}
                    </label>
                    <input
                      type="text"
                      className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                      style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label 
                      className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}
                      style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                    >
                      {isRTL ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label 
                      className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}
                      style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                    >
                      {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    />
                  </div>
                  
                  <button 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}