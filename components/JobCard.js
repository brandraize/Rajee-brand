'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Briefcase, Clock, MapPin, Eye } from 'lucide-react';

function formatCurrency(value, isRTL) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return isRTL ? 'غير محدد' : 'Not specified';
  return isRTL ? `${num} ريال` : `$${num}`;
}

function StatusBadge({ status, isRTL }) {
  const map = {
    Active: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Deactive: 'bg-gray-100 text-gray-800',
  };
  const label = status === 'Active' ? (isRTL ? 'نشط' : 'Active')
    : status === 'Pending' ? (isRTL ? 'قيد المراجعة' : 'Pending')
    : (isRTL ? 'غير نشط' : 'Deactive');
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || map.Deactive}`}>
      {label}
    </span>
  );
}

export default function JobCard({ job, isRTL }) {
  const [imageLoading, setImageLoading] = useState(true);
  const productsCount = Array.isArray(job?.products) ? job.products.length : 0;
  const cover = job?.images?.[0] || '/images/logo.png';

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
      <div className="relative aspect-[16/9] bg-gray-100">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <Image 
          src={cover} 
          alt={job?.title || 'job listing'} 
          fill 
          className={`object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImageLoading(false)}
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={job?.status} isRTL={isRTL} />
        </div>
        <div className="absolute right-3 top-3">
          <div className="bg-blue-100 p-1.5 rounded-lg">
            <Briefcase className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className={`flex items-start justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h4 className="line-clamp-1 text-base font-semibold text-gray-900">{job?.title}</h4>
          <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700">
            {formatCurrency(job?.price, isRTL)}
          </span>
        </div>

        <p className={`mt-1 line-clamp-2 text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
          {job?.description}
        </p>

        <div className={`mt-3 flex items-center gap-2 text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{job?.location}</span>
          </div>
        </div>

        <div className={`mt-3 flex items-center justify-between text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {productsCount} {isRTL ? 'عناصر' : 'items'}
            </span>
            {job?.createdAt?.toDate && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {job.createdAt.toDate().toLocaleDateString()}
              </span>
            )}
          </div>

          <Link 
            href={`/listing/${job?.id}`} 
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-white transition-colors hover:bg-blue-700"
          >
            <Eye className="h-4 w-4" /> 
            {isRTL ? 'عرض' : 'View'}
          </Link>
        </div>
      </div>
    </div>
  );
}
