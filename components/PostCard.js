'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Eye, Clock, Package2, Heart, Flag,Share2 } from 'lucide-react';
import { useLanguage } from 'app/context/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useToast } from '../hooks/use-toast.js';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../configuration/firebase-config"; // Your Firebase client SDK

function formatCurrency(value, isRTL) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return '-';
  return isRTL ? `${num} ريال` : `SAR ${num}`;
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

export default function PostCard({ post, isRTL }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
    const [shareError, setShareError] = useState(null);
  const { toast } = useToast();
    const { t } = useLanguage();
  const productsCount = Array.isArray(post?.products) ? post.products.length : 0;
  const cover = post?.images?.[0] || '/images/logo.png';
{/*I have added the the useeffect hook to fetch the sller name through the client Id but it is not rendering it.    */}

  useEffect(() => {
    const checkFav = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch('/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        const data = await res.json();
        const exists = Array.isArray(data?.favorites) && data.favorites.some((f) => f.postId === post?.id);
        setIsFav(Boolean(exists));
      } catch (_) {
      }
    };
    checkFav();
  }, [post?.id]);

  const toggleFavorite = async () => {
    try {
      setToggling(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }
      const token = await user.getIdToken();
      if (isFav) {
        const res = await fetch(`/api/favorites/${post?.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setIsFav(false);
          try { window.dispatchEvent(new CustomEvent('favorites-changed', { detail: { postId: post?.id, action: 'removed' } })); } catch (_) {}
        }
      } else {
        const res = await fetch(`/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ postId: post?.id })
        });
        if (res.ok) {
          setIsFav(true);

          try { window.dispatchEvent(new CustomEvent('favorites-changed', { detail: { postId: post?.id, action: 'added' } })); } catch (_) {}
          console.log(post.id);
        }
      }
    } catch (_) {
    } finally {
      setToggling(false);
    }
  };

  const submitReport = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }
      if (!reportReason) return;
      const token = await user.getIdToken();
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listingId: post?.id, reason: reportReason })
      });
      if (!res.ok) throw new Error('Failed');
      setReportOpen(false);
      setReportReason('');
      toast({ title: 'تم إرسال البلاغ' });
    } catch (_) {
      toast({ title: 'حدث خطأ، حاول مرة أخرى' });
    }
  };
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

  return (
    
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
     
      <div className="relative aspect-[16/9] bg-gray-100">
    <Link href={`listing/${post.id}`}>
         <div className="grid grid-cols-3 gap-1 h-40">
          {/* the images are sliced in the three and render through  map method added clasess for the hover effect    */}
           
    {post?.images?.slice(0, 3).map((img, idx) => (
      
      <div key={idx} className="relative">

        <Image
          src={img}
          alt={post?.title || `post image ${idx + 1}`}
          fill
          className="object-cover transition-transform duration-200 ease-in-out hover:scale-105"
          
          />
        
      </div>
    ))}
  </div>
   </Link>
        <button
          aria-label="favorite"
          onClick={toggleFavorite}
          disabled={toggling}
          className={`absolute right-3 top-3 z-10 rounded-full p-2 bg-white/90 hover:bg-white shadow transition ${toggling ? 'opacity-70' : ''}`}
        >
          <Heart className={`h-5 w-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
        </button>
        <div className="absolute left-3 top-3">
          <StatusBadge status={post?.status} isRTL={isRTL} />
        </div>
      </div>

      <div className="p-4">
        <div className={`flex items-start justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h4 className="line-clamp-1 text-base font-semibold text-gray-900">{post?.title}</h4>
          <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700">
            {formatCurrency(post?.price, isRTL)}
          </span>
        </div>

        <p className={`mt-1 line-clamp-2 text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>{post?.description}</p>


        <div className={`mt-3 flex items-center justify-between text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="inline-flex items-center gap-1"><Package2 className="h-4 w-4" />{productsCount}</span>
      <p className="text-sm text-gray-500">
  Seller: {post.sellerName || 'Unknown'}
</p>


            {post?.createdAt?.toDate && (
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{post.createdAt.toDate().toLocaleDateString()}</span>
            )}
            
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReportOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1.5 text-gray-700 hover:bg-red-400"
              aria-label="report"
            >
              <Flag className="h-4 w-4" /> {isRTL ? 'إبلاغ' : 'Report'}
            </button>
            <Link href={`/listing/${post?.id}`} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-white transition-colors hover:bg-blue-700">
              <Eye className="h-4 w-4" /> {isRTL ? 'عرض' : 'View'}
            </Link>
          </div>
          <button
              onClick={sharePost}
              className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-white transition-colors hover:bg-green-700"
              aria-label="share"
            >
              <Share2 className="h-4 w-4" /> {isRTL ? 'مشاركة' : 'Share'}
            </button>
        </div>
      </div>
      {/* Report Modal */}
  
<Dialog open={reportOpen} onOpenChange={setReportOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>{t("reportListing")}</DialogTitle>
      <DialogDescription>{t("chooseReason")}</DialogDescription>
    </DialogHeader>

    <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
      {[
        { v: 'احتيال', l: t("report.fraud") },
        { v: 'سبام', l: t("report.spam") },
        { v: 'الفئة غير صحيحة', l: t("report.wrongCategory") },
      ].map((opt) => (
        <label key={opt.v} className="flex items-center gap-2">
          <input
            type="radio"
            name={`report-${post?.id}`}
            value={opt.v}
            checked={reportReason === opt.v}
            onChange={(e) => setReportReason(e.target.value)}
          />
          <span>{opt.l}</span>
        </label>
      ))}
    </div>

    <DialogFooter className="flex-col sm:flex-row gap-2">
      <button
        onClick={() => setReportOpen(false)}
        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        {t("cancel")}
      </button>
      <button
        onClick={submitReport}
        disabled={!reportReason}
        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {t("submit")}
      </button>
    </DialogFooter>
  </DialogContent>
</Dialog>


    </div>
   
  );
}


