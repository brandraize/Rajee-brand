"use client";

import { useState, useCallback } from "react";
import { auth } from "../configuration/firebase-config";
import { useToast } from "./use-toast.js";

export interface DeletePostState {
  isDeleting: boolean;
  showConfirmDialog: boolean;
  postToDelete: string | null;
}

export const useDeletePost = () => {
  const [state, setState] = useState<DeletePostState>({
    isDeleting: false,
    showConfirmDialog: false,
    postToDelete: null,
  });

  const { toast } = useToast();

  const confirmDelete = useCallback((postId: string) => {
    setState(prev => ({
      ...prev,
      showConfirmDialog: true,
      postToDelete: postId,
    }));
  }, []);

  const cancelDelete = useCallback(() => {
    setState(prev => ({
      ...prev,
      showConfirmDialog: false,
      postToDelete: null,
    }));
  }, []);

  const executeDelete = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!state.postToDelete) {
      return { success: false, message: 'لا يوجد إعلان محدد للحذف' };
    }

    if (!auth.currentUser) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب تسجيل الدخول لحذف الإعلان",
        variant: "destructive"
      });
      return { success: false, message: 'تسجيل الدخول مطلوب' };
    }

    setState(prev => ({ ...prev, isDeleting: true }));

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`/api/posts/${state.postToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "تم حذف الإعلان بنجاح",
          description: result.message
        });
        setState(prev => ({
          ...prev,
          showConfirmDialog: false,
          postToDelete: null,
          isDeleting: false,
        }));
        return result;
      } else {
        toast({
          title: "فشل حذف الإعلان",
          description: result.message,
          variant: "destructive"
        });
        setState(prev => ({ ...prev, isDeleting: false }));
        return result;
      }
    } catch (error: any) {
      console.error('Delete post error:', error);
      const errorMessage = error.message || 'فشل حذف الإعلان. حاول مرة أخرى';
      toast({
        title: "فشل حذف الإعلان",
        description: errorMessage,
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isDeleting: false }));
      return { success: false, message: errorMessage };
    }
  }, [state.postToDelete, toast]);

  

  return {
    ...state,
    confirmDelete,
    cancelDelete,
    executeDelete,
  };
};
