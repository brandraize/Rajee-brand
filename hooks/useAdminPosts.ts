"use client";

import { useEffect, useState, useCallback } from "react";
import { auth } from "../configuration/firebase-config";
import { useToast } from "./use-toast.js";

export interface AdminPost {
  id: string;
  title: string;
  description: string;
  price: number | string;
  status: "Pending" | "Active" | "Deactive";
  category: string;
  location: string;
  products: any[];
  images: string[];
  clientId: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface AdminPostsState {
  posts: AdminPost[];
  loading: boolean;
  updatingStatus: { [postId: string]: boolean };
}

export const useAdminPosts = () => {
  const [state, setState] = useState<AdminPostsState>({
    posts: [],
    loading: true,
    updatingStatus: {},
  });

  const { toast } = useToast();

  const fetchAllPosts = useCallback(async () => {
    if (!auth.currentUser) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch('/api/posts/admin', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
        cache: 'no-store',
      });

      const result = await response.json();

      if (result.success) {
        setState(prev => ({
          ...prev,
          posts: result.posts || [],
          loading: false,
        }));
      } else {
        toast({
          title: "فشل في جلب الإعلانات",
          description: result.message,
          variant: "destructive",
        });
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error: any) {
      console.error('Error fetching admin posts:', error);
      toast({
        title: "فشل في جلب الإعلانات",
        description: error.message || 'حدث خطأ أثناء جلب الإعلانات',
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  const updatePostStatus = useCallback(async (postId: string, newStatus: "Pending" | "Active" | "Deactive") => {
    if (!auth.currentUser) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب تسجيل الدخول لتحديث حالة الإعلان",
        variant: "destructive",
      });
      return { success: false, message: 'تسجيل الدخول مطلوب' };
    }

    setState(prev => ({
      ...prev,
      updatingStatus: { ...prev.updatingStatus, [postId]: true },
    }));

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch('/api/posts/admin/update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          postId,
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the post in local state
        setState(prev => ({
          ...prev,
          posts: prev.posts.map(post =>
            post.id === postId ? { ...post, status: newStatus } : post
          ),
          updatingStatus: { ...prev.updatingStatus, [postId]: false },
        }));

        toast({
          title: "تم تحديث الحالة بنجاح",
          description: result.message,
        });

        return result;
      } else {
        toast({
          title: "فشل في تحديث الحالة",
          description: result.message,
          variant: "destructive",
        });
        setState(prev => ({
          ...prev,
          updatingStatus: { ...prev.updatingStatus, [postId]: false },
        }));
        return result;
      }
    } catch (error: any) {
      console.error('Error updating post status:', error);
      const errorMessage = error.message || 'فشل في تحديث حالة الإعلان. حاول مرة أخرى';
      toast({
        title: "فشل في تحديث الحالة",
        description: errorMessage,
        variant: "destructive",
      });
      setState(prev => ({
        ...prev,
        updatingStatus: { ...prev.updatingStatus, [postId]: false },
      }));
      return { success: false, message: errorMessage };
    }
  }, [toast]);

  const getPostsByStatus = useCallback((status: "Pending" | "Active" | "Deactive") => {
    return state.posts.filter(post => post.status === status);
  }, [state.posts]);

  const getStats = useCallback(() => {
    return {
      total: state.posts.length,
      pending: state.posts.filter(p => p.status === 'Pending').length,
      active: state.posts.filter(p => p.status === 'Active').length,
      deactive: state.posts.filter(p => p.status === 'Deactive').length,
    };
  }, [state.posts]);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  return {
    ...state,
    fetchAllPosts,
    updatePostStatus,
    getPostsByStatus,
    getStats,
  };
};
