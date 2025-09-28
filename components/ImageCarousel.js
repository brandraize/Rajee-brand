'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../app/context/LanguageContext';

export default function ImageCarousel({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isRTL } = useLanguage();

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex]}
          alt={`${title} - ${currentIndex + 1}`}
          fill
          className="object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className={`absolute top-1/2 transform -translate-y-1/2 ${
                isRTL ? 'right-2' : 'left-2'
              } bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all`}
            >
              {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <button
              onClick={nextImage}
              className={`absolute top-1/2 transform -translate-y-1/2 ${
                isRTL ? 'left-2' : 'right-2'
              } bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all`}
            >
              {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                index === currentIndex ? 'border-blue-500' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}