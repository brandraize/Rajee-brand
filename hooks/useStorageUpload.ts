"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { storage, auth } from "../configuration/firebase-config";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useToast } from "./use-toast.js";

export interface UploadItem {
  file: File;
  id: string;
  progress: number; // 0-100
  status: "idle" | "uploading" | "success" | "error" | "cancelled";
  url?: string;
  error?: string;
}

export const useStorageUpload = () => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const tasksRef = useRef<Record<string, ReturnType<typeof uploadBytesResumable> | null>>({});
  const { toast } = useToast();

  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files);
    setItems((prev) => [
      ...prev,
      ...list.map((file) => ({
        file,
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        progress: 0,
        status: "idle" as const,
      })),
    ]);
  }, []);

  const startUpload = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({ title: "Login required", description: "Please login to upload images", variant: "destructive" });
      return;
    }

    const bucket = (storage as any)?.app?.options?.storageBucket as string | undefined;
    if (!bucket) {
      toast({
        title: "Storage bucket not configured",
        description: `Expected: rajee-198a5.firebasestorage.app, Got: ${bucket || 'undefined'}`,
        variant: "destructive",
      });
      return;
    }

    setItems((currentItems) => {
      const pending = currentItems.filter((i) => i.status === "idle" || i.status === "error");

      pending.forEach((item) => {
        const safeName = item.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `posts/${currentUser.uid}/${Date.now()}-${safeName}`;
        const storageRef = ref(storage, path);
        const task = uploadBytesResumable(storageRef, item.file, {
          cacheControl: "public,max-age=31536000,immutable",
          contentType: item.file.type || "image/jpeg"
        });
        tasksRef.current[item.id] = task;

        // Update status to uploading
        setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: "uploading", progress: 0 } : x)));

        task.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, progress } : x)));
          },
          (error: any) => {
            console.error('Upload error:', error);
            setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: "error", error: error.message } : x)));
            const msg = error?.code ? `${error.code}: ${error.message}` : (error?.message || String(error));
            toast({ title: "Upload failed", description: msg, variant: "destructive" });
          },
          async () => {
            try {
              const url = await getDownloadURL(task.snapshot.ref);
              setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: "success", url, progress: 100 } : x)));
            } catch (error) {
              console.error('Error getting download URL:', error);
              setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: "error", error: "Failed to get download URL" } : x)));
            }
          }
        );
      });

      return currentItems;
    });
  }, [toast]);

  const cancelUpload = useCallback((id: string) => {
    const task = tasksRef.current[id];
    if (task) {
      task.cancel();
      tasksRef.current[id] = null;
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: "cancelled" } : x)));
    }
  }, []);

  const removeItem = useCallback(async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (item.url) {
      try {
        const objectRef = ref(storage, item.url);
        await deleteObject(objectRef);
      } catch (_) {
      }
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, [items]);

  const reset = useCallback(() => setItems([]), []);

  const urls = useMemo(() => items.filter((i) => i.status === "success" && i.url).map((i) => i.url!) , [items]);

  return {
    items,
    urls,
    addFiles,
    startUpload,
    cancelUpload,
    removeItem,
    reset,
  };
};


