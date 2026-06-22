'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import type { Role } from '@/lib/types';

/**
 * Protects a page — redirects to /login if not authenticated
 * or if the user doesn't have the required role
 */
export const useRequireAuth = (requiredRole?: Role) => {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to their correct area
      if (user?.role === 'ADMIN') router.replace('/admin/dashboard');
      else if (user?.role === 'STUDENT') router.replace('/student/dashboard');
      else router.replace('/');
    }
  }, [isAuthenticated, user, requiredRole, router]);

  return { user, isAuthenticated: isAuthenticated() };
};

/**
 * Returns whether the current user has full movie access
 */
export const useMovieAccess = () => {
  const { user } = useAuthStore();
  return (
    user?.role === 'PREMIUM' ||
    user?.role === 'ADMIN' ||
    user?.role === 'STUDENT'
  );
};