'use client';

import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AddListing() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const { user, requireAuth, loading: authLoading } = useAuth();

  // Check authentication on component mount
  useEffect(() => {

    if (!authLoading && !user) {
      requireAuth();
    } else if (user) {
      router.push('/seller/add-listing/type');
    }
  }, [user, authLoading, requireAuth, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-lg">{isRTL ? 'جارٍ التحميل...' : 'Loading...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{isRTL ? 'جارٍ التوجيه...' : 'Redirecting...'}</p>
      </div>
    </div>
  );
}