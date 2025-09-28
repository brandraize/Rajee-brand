// File: app/components/BundleCard.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../app/context/LanguageContext';


export default function BundleCard({ bundle }) {
  const [isLiked, setIsLiked] = useState(false);
  const { t, isRTL } = useLanguage();

  const formatPrice = (price) => {
    return isRTL ? `${price.toLocaleString()} ريال` : `$${price.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Image Gallery */}
      <div className="relative h-48 overflow-hidden">
        <div className="grid grid-cols-3 gap-1 h-full">
          {bundle.images.slice(0, 3).map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image}
                alt={`${bundle.title} - ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        
        {/* Bundle Badge */}
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
          {t('bundleOf')} {bundle.itemCount} {t('items')}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/listing/${bundle.id}`}>
          <h3 
            className={`font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors ${
              isRTL ? 'text-right' : 'text-left'
            }`}
            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
          >
            {bundle.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(bundle.price)}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {bundle.category}
          </span>
        </div>

        <div className={`flex items-center text-sm text-gray-500 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <MapPin className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
          <span style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
            {bundle.location}
          </span>
        </div>

        <div className={`flex items-center text-sm text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Clock className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
          <span style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
            {bundle.timeAgo}
          </span>
        </div>

        {/* Seller Info */}
        <div className={`flex items-center mt-3 pt-3 border-t border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`w-8 h-8 bg-gray-300 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
          <span className="text-sm text-gray-600" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
            {bundle.seller}
          </span>
        </div>
      </div>
    </div>
  );
}