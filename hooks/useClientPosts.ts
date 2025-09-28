"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../configuration/firebase-config";

export interface ClientPost {
  id: string;
  title: string;
  price: number | string;
  status: "Pending" | "Active" | "Deactive";
  products: any[];
  images: string[];
  createdAt?: any;
}

export const useClientPosts = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<ClientPost[]>([]);

  useEffect(() => {
    setLoading(true);
    let unsubscribePosts: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Clean up previous posts subscription when auth state changes
      if (unsubscribePosts) {
        unsubscribePosts();
        unsubscribePosts = null;
      }

      if (!user) {
        setPosts([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "posts"),
        where("clientId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      unsubscribePosts = onSnapshot(q, (snap) => {
        const list: ClientPost[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setPosts(list);
        setLoading(false);
      }, () => {
        // On error, surface empty state but stop loading
        setPosts([]);
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribePosts) unsubscribePosts();
      unsubscribeAuth();
    };
  }, []);

  return { loading, posts };
};


