import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../services/firebase';
import { useToast } from './use-toast.js';
import { ROLES } from '../constants/roles';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false,
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthStateChange = useCallback(async (user: User | null) => {
    setAuthState(prev => ({ ...prev, loading: true }));

    if (user) {
      setAuthState({ user, loading: false, initialized: true });
    } else {
      setAuthState({ user: null, loading: false, initialized: true });
    }
  }, [toast]);

  useEffect(() => {
    const unsubscribe = FirebaseAuthService.onAuthStateChange(handleAuthStateChange);
    return unsubscribe;
  }, [handleAuthStateChange]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      const user = await FirebaseAuthService.signIn(email, password);

      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'جارٍ تحويلك إلى الصفحة الرئيسية',
      });

      // Redirect to home page after successful login
      router.push('/');

      return { success: true, message: 'تم تسجيل الدخول بنجاح', user };
    } catch (error: any) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message || 'فشل تسجيل الدخول. حاول مرة أخرى',
        variant: 'destructive',
      });
      throw { success: false, message: error.message || 'فشل تسجيل الدخول. حاول مرة أخرى' };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [toast, router]);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      const user = await FirebaseAuthService.signUp(email, password, displayName);

      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'الرجاء تسجيل الدخول',
      });

      // Redirect to login page after successful registration
      router.push('/auth/login');

      return { success: true, message: 'تم إنشاء الحساب بنجاح، الرجاء تسجيل الدخول', user };
    } catch (error: any) {
      toast({
        title: 'خطأ في إنشاء الحساب',
        description: error.message || 'فشل إنشاء الحساب. حاول مرة أخرى',
        variant: 'destructive',
      });
      throw { success: false, message: error.message || 'فشل إنشاء الحساب. حاول مرة أخرى' };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [toast, router]);

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem('listingDraft');
      setAuthState(prev => ({ ...prev, loading: true }));

      await FirebaseAuthService.signOut();

      toast({
        title: 'Success',
        description: 'Signed out successfully',
      });

      router.push('/auth/login');
    } catch (error: any) {
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

  const requireAuth = useCallback(async () => {

    if (!authState.user && authState.initialized) {
      toast({
        title: 'تسجيل الدخول مطلوب',
        description: 'عند الضغط على إضافة إعلان يجب التسجيل أولاً',
        variant: 'destructive',
      });
      router.push('/auth/register');
      return false;
    }

    if (authState.user) {
    }

    return !!authState.user;
  }, [authState.user, authState.initialized, toast, router]);

  return {
    user: authState.user,
    loading: authState.loading,
    initialized: authState.initialized,
    signIn,
    signUp,
    signOut,
    validateForm,
    requireAuth,
  };
};
