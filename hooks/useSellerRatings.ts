"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAuth } from "firebase/auth";

export interface SellerSummary {
  average: number;
  count: number;
  trusted: boolean;
}

export interface SellerRatingItem {
  id: string;
  buyerId: string;
  stars: number;
  review?: string;
  timestamp?: any;
}

export const useSellerRatings = (sellerId?: string, postId?: string) => {
  const [summary, setSummary] = useState<SellerSummary>({ average: 0, count: 0, trusted: false });
  const [ratings, setRatings] = useState<SellerRatingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!sellerId) return;
    try {
      setError(null);
      const query = new URLSearchParams();
      query.set('summary', 'true');
      if (postId) query.set('postId', String(postId));
      const res = await fetch(`/api/ratings/${sellerId}?${query.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data?.success) setSummary({ average: data.average || 0, count: data.count || 0, trusted: !!data.trusted });
    } catch (e:any) {
      setError(e?.message || 'Error');
    }
  }, [sellerId, postId]);

  const fetchRatings = useCallback(async () => {
    if (!sellerId) return;
    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams();
      if (postId) query.set('postId', String(postId));
      const qs = query.toString();
      const res = await fetch(`/api/ratings/${sellerId}${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
      const data = await res.json();
      if (data?.success) {
        setRatings(data.ratings || []);
        setSummary({ average: data.average || 0, count: data.count || 0, trusted: !!data.trusted });
      }
    } catch (e:any) {
      setError(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }, [sellerId, postId]);

  const submitRating = useCallback(async (stars: number, review?: string) => {
    if (!sellerId) return { success: false };
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return { success: false, unauthorized: true };
    const token = await user.getIdToken();
    const res = await fetch(`/api/ratings/${sellerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ stars, review, postId })
    });
    const data = await res.json();
    if (res.ok && data?.success) {
      await fetchRatings();
      return { success: true };
    }
    return { success: false };
  }, [sellerId, postId, fetchRatings]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  return { summary, ratings, loading, error, fetchRatings, submitRating };
};


