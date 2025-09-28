import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FirebaseAuthService, UserData } from '../services/firebase';
import { ROLES, ROLE_PATHS, Role, isRoleValid } from '../constants/roles';
import { useAuth } from './useAuth';
import { useToast } from './use-toast.js';

interface RoleState {
  userData: UserData | null;
  loading: boolean;
  role: Role | null;
}

export const useRole = () => {
  const [roleState, setRoleState] = useState<RoleState>({
    userData: null,
    loading: true,
    role: null,
  });
  const { user, initialized } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const fetchUserRole = useCallback(async (uid: string) => {
    try {
      setRoleState(prev => ({ ...prev, loading: true }));

      const userData = await FirebaseAuthService.getUserData(uid);

      if (!userData) {

        await FirebaseAuthService.createUserDocument(
          { uid, email: user?.email || '', displayName: user?.displayName || '' } as any,
          ROLES.USER
        );

        const newUserData = await FirebaseAuthService.getUserData(uid);
        if (newUserData) {
          setRoleState({
            userData: newUserData,
            loading: false,
            role: newUserData.role,
          });
          return;
        }

        toast({
          title: 'Error',
          description: 'Failed to create user profile. Please try again.',
          variant: 'destructive',
        });
        await FirebaseAuthService.signOut();
        setRoleState({ userData: null, loading: false, role: null });
        return;
      }

      if (!isRoleValid(userData.role)) {
        toast({
          title: 'Error',
          description: 'Invalid user role. Access denied.',
          variant: 'destructive',
        });
        await FirebaseAuthService.signOut();
        setRoleState({ userData: null, loading: false, role: null });
        return;
      }

      setRoleState({
        userData,
        loading: false,
        role: userData.role,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch user role',
        variant: 'destructive',
      });
      await FirebaseAuthService.signOut();
      setRoleState({ userData: null, loading: false, role: null });
    }
  }, [toast]);

  useEffect(() => {
    if (initialized) {
      if (user) {
        fetchUserRole(user.uid);
      } else {
        setRoleState({ userData: null, loading: false, role: null });
      }
    }
  }, [user, initialized, fetchUserRole]);

  const redirectBasedOnRole = useCallback((role: Role) => {
    const path = ROLE_PATHS[role];
    if (path) {
      router.push(path);
    } else {
    }
  }, [router]);

  const hasRole = useCallback((requiredRole: Role): boolean => {
    return roleState.role === requiredRole;
  }, [roleState.role]);

  const isSuperAdmin = useCallback((): boolean => {
    return hasRole(ROLES.SUPER_ADMIN);
  }, [hasRole]);

  const isUser = useCallback((): boolean => {
    return hasRole(ROLES.USER);
  }, [hasRole]);

  const canAccess = useCallback((requiredRole: Role): boolean => {
    if (!roleState.role) return false;
    return roleState.role === requiredRole;
  }, [roleState.role]);

  const requireRole = useCallback((requiredRole: Role, redirectPath?: string) => {
    if (!roleState.role) {
      toast({
        title: 'Access Denied',
        description: 'Please sign in to access this page',
        variant: 'destructive',
      });
      router.push('/auth/login');
      return false;
    }

    if (!canAccess(requiredRole)) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page',
        variant: 'destructive',
      });
      router.push(redirectPath || ROLE_PATHS[roleState.role]);
      return false;
    }

    return true;
  }, [roleState.role, canAccess, toast, router]);

  const updateUserRole = useCallback(async (uid: string, newRole: Role) => {
    try {
      if (!isRoleValid(newRole)) {
        throw new Error('Invalid role provided');
      }

      await FirebaseAuthService.updateUserRole(uid, newRole);

      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });

      await fetchUserRole(uid);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user role',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, fetchUserRole]);

  return {
    userData: roleState.userData,
    role: roleState.role,
    loading: roleState.loading,
    hasRole,
    isSuperAdmin,
    isUser,
    canAccess,
    requireRole,
    redirectBasedOnRole,
    updateUserRole,
  };
};
