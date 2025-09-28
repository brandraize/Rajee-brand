'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PostCard from '../../components/PostCard';
import { getAuth } from 'firebase/auth';
import Link from 'next/link';

export default function FavoritesPage() {
  const { isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch('/api/favorites', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const data = await res.json();
      setFavorites(data?.favorites || []);
    } catch (_) {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const auth = getAuth();
    const unsub = auth.onAuthStateChanged(() => {
      if (!mounted) return;
      setInitialized(true);
      fetchFavorites();
    });
    const onFavChange = (e) => {
      const { postId, action } = e.detail || {};
      if (!postId) return;
      setFavorites((prev) => {
        if (action === 'removed') return prev.filter((f) => f.postId !== postId);
        if (action === 'added') {
          fetchFavorites();
        }
        return prev;
      });
    };
    window.addEventListener('favorites-changed', onFavChange);
    return () => {
      mounted = false;
      window.removeEventListener('favorites-changed', onFavChange);
      unsub && unsub();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h1 className="text-2xl font-bold">{isRTL ? 'المفضلة' : 'Favorites'}</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-700">{isRTL ? 'عودة للرئيسية' : 'Back to Home'}</Link>
      </div>

      {loading ? (
        <div className="text-gray-500">{isRTL ? 'جارٍ التحميل...' : 'Loading...'}</div>
      ) : favorites.length === 0 ? (
        <div className="text-gray-500">{isRTL ? 'لا توجد عناصر مفضلة' : 'No favorites yet'}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((f) => (
            <PostCard key={f.postId} post={{ id: f.postId, ...f }} isRTL={isRTL} />
          ))}
        </div>
      )}
    </div>
  );
}


