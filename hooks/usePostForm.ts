"use client";

import { useCallback, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../configuration/firebase-config";
import { useToast } from "./use-toast.js";

export type PostStatus = "Pending" | "Active" | "Deactive";

export interface ProductItem {
  name: string;
  condition: string;
  originalPrice: string;
}

export interface PostFormState {
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  products: ProductItem[];
  images: string[]; // download URLs
}

const MIN_PRODUCTS = 3;
const MIN_IMAGES = 3;

export const usePostForm = () => {
  const [state, setState] = useState<PostFormState>({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    products: [
      { name: "", condition: "", originalPrice: "" },
      { name: "", condition: "", originalPrice: "" },
      { name: "", condition: "", originalPrice: "" },
    ],
    images: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const setImages = useCallback((urls: string[]) => {
    setState((prev) => ({ ...prev, images: urls || [] }));
  }, []);

  const addProduct = useCallback(() => {
    setState((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { name: "", condition: "", originalPrice: "" },
      ],
    }));
  }, []);

  const updateProduct = useCallback(
    (index: number, patch: Partial<ProductItem>) => {
      setState((prev) => {
        const next = [...prev.products];
        next[index] = { ...next[index], ...patch };
        return { ...prev, products: next };
      });
    },
    []
  );

  const removeProduct = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  }, []);

  const canSubmit = useMemo(() => {
    const hasMinProducts =
      (state.products?.length || 0) >= MIN_PRODUCTS &&
      state.products.every(
        (p) => p.name && p.condition && p.originalPrice
      );

    const hasMinImages = (state.images?.length || 0) >= MIN_IMAGES;

    const isValid =
      !!state.title &&
      !!state.category &&
      !!state.location &&
      hasMinProducts &&
      hasMinImages &&
      !submitting;

    return isValid;
  }, [state, submitting]);

  const validate = useCallback(() => {
    if (!auth.currentUser) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "عند الضغط على إضافة إعلان يجب التسجيل أولاً",
        variant: "destructive",
      });
      return false;
    }
    if ((state.products?.length || 0) < MIN_PRODUCTS) {
      toast({
        title: "أضف المزيد من المنتجات",
        description: `الحد الأدنى ${MIN_PRODUCTS} منتجات مطلوبة`,
        variant: "destructive",
      });
      return false;
    }
    if ((state.images?.length || 0) < MIN_IMAGES) {
      toast({
        title: "أضف المزيد من الصور",
        description: `الحد الأدنى ${MIN_IMAGES} صور مطلوبة`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  }, [state.products?.length, state.images?.length, toast]);

  const uploadImages = useCallback(async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("clientId", auth.currentUser!.uid);

    const response = await fetch("/api/upload-images", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.urls;
  }, []);

  const submit = useCallback(
    async (imageFiles?: File[]) => {
      if (!validate())
        return { success: false, message: "التحقق من البيانات فشل" };

      setSubmitting(true);
      toast({ title: "جارٍ نشر الإعلان…", description: "يرجى الانتظار" });

      try {
        const clientId = auth.currentUser!.uid;

        // Upload images if provided
        let imageUrls = state.images || [];
        if (imageFiles && imageFiles.length > 0) {
          imageUrls = await uploadImages(imageFiles);
          setImages(imageUrls);
        }

        // Create post via API route (JSON request/response) with ID token
        const idToken = await auth.currentUser!.getIdToken();
        const response = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            title: state.title,
            description: state.description,
            price: state.price,
            category: state.category,
            location: state.location,
            products: state.products,
            images: imageUrls,
          }),
        });

        const result = await response.json();

        if (result.success) {
          toast({
            title: "تم إرسال الإعلان للمراجعة",
            description: "سيتم نشره بعد موافقة الإدارة",
          });
          return result;
        } else {
          toast({
            title: "فشل نشر الإعلان",
            description: result.message,
            variant: "destructive",
          });
          return result;
        }
      } catch (error: any) {
        console.error("Submission error:", error);
        const errorMessage =
          error.message || "فشل نشر الإعلان. حاول مرة أخرى";
        toast({
          title: "فشل نشر الإعلان",
          description: errorMessage,
          variant: "destructive",
        });
        return { success: false, message: errorMessage };
      } finally {
        setSubmitting(false);
      }
    },
    [state, validate, toast, uploadImages, setImages]
  );

  const reset = useCallback(() => {
    setState({
      title: "",
      description: "",
      price: "",
      category: "",
      location: "",
      products: [
        { name: "", condition: "", originalPrice: "" },
        { name: "", condition: "", originalPrice: "" },
        { name: "", condition: "", originalPrice: "" },
      ],
      images: [],
    });
  }, []);

  return {
    state,
    setState,
    setImages,
    addProduct,
    updateProduct,
    removeProduct,
    canSubmit,
    submit,
    reset,
    submitting,
    MIN_PRODUCTS,
    MIN_IMAGES,
  };
};
