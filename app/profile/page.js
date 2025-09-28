'use client';

import Image from 'next/image';
import construction from '../../public/images/construction.jpg';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from '../context/LanguageContext';
import { FaCheckCircle } from 'react-icons/fa';
import TrustedBadge from '../../components/TrustedBadge';
import PostCard from '../../components/PostCard';
import { ShoppingBag, User, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { uploadImageToFirebase } from '../../lib/uploadImage';

export default function Page() {
  const { isRTL } = useLanguage();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();

        // ✅ Use /api/profile instead of /api/profileimage
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch profile data');

        const data = await res.json();

        setUser({ uid: firebaseUser.uid, ...data.user });
        setPosts(data.posts || []);
        setReports(data.reports || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    try {
      const imageUrl = await uploadImageToFirebase(file, user.uid, type);

      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch('/api/profileimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl, type }),
      });

      if (!res.ok) throw new Error('Failed to update image');

      setUser((prev) => ({ ...prev, [`${type}Image`]: imageUrl }));
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const tabs = [
    { key: 'listings', label: isRTL ? 'عروضي' : 'My Listings', icon: ShoppingBag },
 
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{isRTL ? 'جارٍ تحميل الملف الشخصي...' : 'Loading profile...'}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{isRTL ? 'لم يتم العثور على المستخدم.' : 'User not found.'}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'font-cairo' : 'font-inter'}`}>
      {/* Cover Image */}
      <div className="relative w-full h-80 bg-gradient-to-r from-blue-500 to-purple-600">
        <Image
          src={user.coverImage || construction}
          alt="Cover"
          fill
          className="object-cover"
        />
        <label className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded text-sm cursor-pointer shadow-md">
          {isRTL ? 'تعديل الغلاف' : 'Edit Cover'}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleImageUpload(e, 'cover')}
          />
        </label>
      </div>

      {/* Profile Container */}
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 ">
                <Image
                  src={user.profileImage || '/default-avatar.png'}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  {user.verified && <FaCheckCircle className="text-blue-500 text-xl" />}
                  {user.trusted && <TrustedBadge isRTL={isRTL} />}
                </div>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>

              <div className="mt-6">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow"
                  onClick={() => router.push('/seller/add-listing/type')}
                >
                  {isRTL ? 'نشر منتج' : 'Post Product'}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className={`flex space-x-8 px-8 ${isRTL ? 'space-x-reverse' : ''}`}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="px-8 py-6">
            {activeTab === 'listings' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.length === 0 ? (
                  <p className="text-gray-500">
                    {isRTL ? 'لا توجد عروض بعد.' : 'No listings yet.'}
                  </p>
                ) : (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} isRTL={isRTL} />
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
