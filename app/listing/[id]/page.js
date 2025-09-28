'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import ImageCarousel from '../../../components/ImageCarousel';
import ChatInterface from '../../../components/ChatInterface';
import { Heart, Share2, Flag, MapPin, Clock, User, Star, MessageCircle, Phone } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { useToast } from '../../../hooks/use-toast.js';
import TrustedBadge from '../../../components/TrustedBadge';
import { useSellerRatings } from '../../../hooks/useSellerRatings';

import { getFirestore, doc, getDoc } from 'firebase/firestore';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

export default function ListingPage({ params }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [ratingStars, setRatingStars] = useState(0);
  const [ratingText, setRatingText] = useState('');
const login=getAuth();
const user=login.currentUser;

const [profileImage, setProfileImage] = useState('');
const [sellerName, setSellerName] = useState('');
const [shareError, setShareError] = useState(null);

  const sharePost = async (e) => {
    e.preventDefault();
    setShareError(null);

    const url = typeof window !== 'undefined' ? window.location.origin + `/listing/${post.id}` : '';
    const shareData = {
      title: post.title,
      text: post.description || '',
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // optionally notify success
      } catch (err) {
        setShareError('مشاركة فشلت أو تم الإلغاء'); // Arabic: Share failed or cancelled
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setShareError('تم نسخ الرابط إلى الحافظة'); // Arabic: Link copied to clipboard
      } catch {
        setShareError('لا يمكن نسخ الرابط، حاول يدويًا'); // Arabic: Cannot copy link, please try manually
      }
    } else {
      setShareError('ميزة المشاركة غير مدعومة على هذا المتصفح');
    }
  };

useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);

      // 📨 Fetch the post from your API
      const res = await fetch(`/api/posts/${params.id}`, { cache: 'no-store' });
      const data = await res.json();

      if (data?.success) {
        const post = data.post;
        setPost(post);

        // ✅ Use sellerName directly from API response
        setSellerName(post.sellerName || 'بائع غير معروف');
       setProfileImage(post.sellerProfileImage || '');
       console.log(profileImage);
      }
    } catch (err) {
      console.error('فشل تحميل البيانات:', err);
    } finally {
      setLoading(false);
    }
  };

  load();
}, [params.id]);


  const items = Array.isArray(post?.products) ? post.products : [];
  const totalOriginalPrice = items.reduce((sum, item) => sum + (Number(item.originalPrice) || 0), 0);
  const savings = (Number(post?.price) || 0) > 0 ? totalOriginalPrice - Number(post?.price) : 0;
  const sellerId = post?.clientId || '';
  const postId = params.id;
  const { summary, ratings, fetchRatings, submitRating } = useSellerRatings(sellerId, postId);

  useEffect(() => {
    if (sellerId) {
      fetchRatings();
    }
  }, [sellerId, fetchRatings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {isRTL ? 'جارٍ تحميل التفاصيل...' : 'Loading details...'}
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isRTL ? 'العرض غير موجود' : 'Listing not found'}
          </h2>
          <p className="text-gray-600">
            {isRTL ? 'العرض الذي تبحث عنه غير موجود أو تم حذفه' : 'The listing you are looking for does not exist or has been deleted'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Carousel */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              {post?.images ? (
                <ImageCarousel images={post.images} title={post.title} />
              ) : null}
            </div>

            {/* Bundle Details */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h1 
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                >
                  {post?.title || ''}
                </h1>
                
                <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <button
                    onClick={() => {if(!user){
            window.location.href="/auth/login";
            return;
          }setIsLiked(!isLiked)
        }}
                    className={`p-2 rounded-full transition-all ${
                      isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
  onClick={sharePost}
  className="rounded-full p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
  aria-label={isRTL ? 'مشاركة' : 'Share'}
  title={isRTL ? 'مشاركة' : 'Share'} // tooltip on hover
>
  <Share2 className="h-5 w-5" />
</button>

                  <button onClick={()=>setReportOpen(true)} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                    <Flag className="w-5 h-5" />
                  </button>

                </div>
              </div>

              {/* Price and Savings */}
              <div className="mb-6">
                <div className={`flex items-center space-x-4 mb-2 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                  <span className="text-3xl font-bold text-blue-600">
                    {post?.price ? (isRTL ? `${post.price} ريال` : `$${post.price}`) : '-'}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {isRTL ? `${totalOriginalPrice} ريال` : `${totalOriginalPrice}`}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {isRTL ? `توفير ${savings} ريال` : `Save $${savings}`}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {t('bundleOf')} {items.length} {t('items')}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 
                  className="font-semibold text-gray-900 mb-3"
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                >
                  {isRTL ? 'الوصف' : 'Description'}
                </h3>
                <p 
                  className={`text-gray-700 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                >
                  {post?.description || ''}
                </p>
              </div>
              

              {/* Bundle Items */}
              <div>
                <h3 
                  className="font-semibold text-gray-900 mb-4"
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                >
                  {isRTL ? 'عناصر العرض' : 'Bundle Items'}
                </h3>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h4 
                          className="font-medium text-gray-900"
                          style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                        >
                          {item.name}
                        </h4>
                        <p 
                          className="text-sm text-gray-600"
                          style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                        >
                          {item.condition}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {isRTL ? `${item.originalPrice} ريال` : `$${item.originalPrice}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
                {ratings && ratings.length > 0 && (
                <div className="pt-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>{isRTL ? 'المراجعات' : 'Reviews'}</h4>
                  <div className="space-y-3">
                    {ratings.slice(0,10).map(r => (
                      <div key={r.id} className="p-3 rounded-lg bg-gray-50">
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="flex items-center">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-4 h-4 ${r.stars >= s ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{r.timestamp?.toDate ? new Date(r.timestamp.toDate()).toLocaleDateString() : ''}</span>
                        </div>
                        {r.review ? (
                          <p className={`text-sm text-gray-700 mt-1 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>{r.review}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 
                className="font-semibold text-gray-900 mb-4"
                style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
              >
              {t('seller')}
              </h3>
              
              <div className={`flex items-center space-x-3 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
             <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
 
  {profileImage ? (
    <img
      src={profileImage}
      alt="صورة البائع"
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.onerror = null; // Prevents infinite loop
        e.currentTarget.src = '/default-profile.png'; // Fallback image on error
      }}
    />
  ) : (
    <User className="w-6 h-6 text-gray-600" />
  )}
</div>

                <div className={isRTL ? 'text-right' : 'text-left'}>
                <h4 
  className="font-medium text-gray-900"
  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
>
   {sellerName || '—'} {summary?.trusted ? <TrustedBadge isRTL={isRTL} /> : null}
</h4>

                  <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    {summary?.average ? summary.average.toFixed(1) : '0.0'} ({summary?.count || 0})
                  </span>
                  </div>
                </div>
              </div>

              <p 
                className="text-sm text-gray-600 mb-4"
                style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
              >
                {post?.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : ''}
              </p>

            <div className="border-t border-gray-200 pt-4 space-y-3 mb-4">
              <h4 className="text-sm font-semibold text-gray-900" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>{isRTL ? 'أضف تقييمك' : 'Add your rating'}</h4>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRatingStars(s)}
                    className={`p-1 rounded ${isRTL ? 'ml-1' : 'mr-1'} focus:outline-none focus:ring-0 focus:ring-offset-0`}
                    aria-label={`rate-${s}`}
                  >
                    <Star className={`w-5 h-5 ${ratingStars >= s ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={ratingText}
                onChange={(e) => setRatingText(e.target.value)}
                placeholder={isRTL ? 'أدخل مراجعتك (اختياري)' : 'Enter your review (optional)'}
                rows={3}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={async () => {
                  const res = await submitRating(ratingStars, ratingText);
                  if (res?.unauthorized) { window.location.href = '/auth/login'; return; }
                  if (res?.success) {
                    setRatingText('');
                    setRatingStars(0);
                    toast({ title: 'تم إرسال التقييم' });
                  } else {
                    toast({ title: 'حدث خطأ، حاول مرة أخرى' });
                  }
                }}
                disabled={!ratingStars}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 mb-3`}
              >
                {isRTL ? 'إرسال التقييم' : 'Submit rating'}
              </button>

          
            </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
                    {t('contactSeller')}
                  </span>
                </button>
                
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
                    {isRTL ? 'اتصال مباشر' : 'Call Now'}
                  </span>
                </button>
              </div>
            </div>

            {/* Listing Details */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 
                className="font-semibold text-gray-900 mb-4"
                style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
              >
                {isRTL ? 'تفاصيل العرض' : 'Listing Details'}
              </h3>
              
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span 
                    className="text-sm text-gray-700"
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {post?.location || '-'}
                  </span>
                </div>
                
                <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span 
                    className="text-sm text-gray-700"
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {post?.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : ''}
                  </span>
                </div>
                
                <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    - {isRTL ? 'مشاهدة' : 'views'}
                  </span>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 
                className="font-semibold text-yellow-800 mb-3"
                style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
              >
                {isRTL ? 'نصائح للأمان' : 'Safety Tips'}
              </h3>
              <ul 
                className={`text-sm text-yellow-700 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}
                style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
              >
                <li>• {isRTL ? 'تأكد من فحص جميع العناصر قبل الشراء' : 'Inspect all items before purchase'}</li>
                <li>• {isRTL ? 'التقي بالبائع في مكان عام آمن' : 'Meet seller in a safe public place'}</li>
                <li>• {isRTL ? 'لا تدفع مقدماً قبل رؤية السلع' : 'Never pay in advance without seeing items'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface
        seller={isRTL ? 'البائع' : 'Seller'}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Report Modal */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isRTL ? 'الإبلاغ عن إعلان' : 'Report Listing'}</DialogTitle>
            <DialogDescription>{isRTL ? 'اختر سبب البلاغ' : 'Choose a reason'}</DialogDescription>
          </DialogHeader>
          <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {[{v:'احتيال',l:'احتيال'},{v:'سبام',l:'سبام'},{v:'الفئة غير صحيحة',l:'الفئة غير صحيحة'}].map(opt => (
              <label key={opt.v} className="flex items-center gap-2">
                <input type="radio" name={`report-${post?.id}`} value={opt.v} checked={reportReason===opt.v} onChange={(e)=>setReportReason(e.target.value)} />
                <span>{opt.l}</span>
              </label>
            ))}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <button onClick={()=>setReportOpen(false)} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">{isRTL ? 'إلغاء' : 'Cancel'}</button>
            <button onClick={async ()=>{
              try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) { window.location.href='/auth/login'; return; }
                if (!reportReason) return;
                const token = await user.getIdToken();
                const res = await fetch('/api/reports', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ listingId: post?.id, reason: reportReason }) });
                if (!res.ok) throw new Error('Failed');
                setReportOpen(false); setReportReason('');
                toast({ title: 'تم إرسال البلاغ' });
              } catch (_) {
                toast({ title: 'حدث خطأ، حاول مرة أخرى' });
              }
            }} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">{isRTL ? 'إرسال' : 'Submit'}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}