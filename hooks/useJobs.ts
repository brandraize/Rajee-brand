"use client";

import { useEffect, useState, useCallback } from "react";

export interface Job {
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

export interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

export const useJobs = (limit?: number) => {
  const [state, setState] = useState<JobsState>({
    jobs: [],
    loading: true,
    error: null
  });

  const fetchJobs = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const url = limit ? `/api/jobs?limit=${limit}` : '/api/jobs';
      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({ 
          ...prev, 
          jobs: data.jobs || [], 
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: data.message || 'فشل في جلب الوظائف', 
          loading: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'خطأ في الاتصال', 
        loading: false 
      }));
    }
  }, [limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    ...state,
    refetch: fetchJobs
  };
};
