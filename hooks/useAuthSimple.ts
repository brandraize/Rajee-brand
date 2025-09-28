import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../configuration/firebase-config';
import { useToast } from './use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../configuration/firebase-config'; // adjust path as needed
import { collection, addDoc } from "firebase/firestore";


interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

export const useAuthSimple = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false,
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthStateChange = useCallback(async (user: User | null) => {
    setAuthState({ user, loading: false, initialized: true });

    if (user) {
      const isAdmin = user.email === 'admin@gmail.com' || user.email?.includes('admin');
      const role = isAdmin ? 'super_admin' : 'user';

      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
    return unsubscribe;
  }, [handleAuthStateChange]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      toast({
        title: 'Success',
        description: 'Signed in successfully',
      });

      return userCredential.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);


const signUp = useCallback(async (email, password, name, phone, userType) => {
  try {
    setAuthState(prev => ({ ...prev, loading: true }));

    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, phone, userType }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    toast({
      title: 'Success',
      description: 'Account created successfully',
    });

    return data; // You can return the new user data or uid
  } catch (error) {
    console.error('Sign up error:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to create account',
      variant: 'destructive',
    });
    throw error;
  } finally {
    setAuthState(prev => ({ ...prev, loading: false }));
  }
}, [toast]);

  const handleSignOut = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      await signOut(auth);

      toast({
        title: 'Success',
        description: 'Signed out successfully',
      });

      router.push('/auth/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [toast, router]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    return { isValid: true };
  };

  const validateForm = (email: string, password: string, displayName?: string) => {
    if (!email.trim()) {
      return { isValid: false, message: 'Email is required' };
    }

    if (!validateEmail(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }

    if (!password.trim()) {
      return { isValid: false, message: 'Password is required' };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { isValid: false, message: passwordValidation.message };
    }

    return { isValid: true };
  };

  return {
    user: authState.user,
    loading: authState.loading,
    initialized: authState.initialized,
    signIn,
    signUp,
    signOut: handleSignOut,
    validateForm,
  };
};
