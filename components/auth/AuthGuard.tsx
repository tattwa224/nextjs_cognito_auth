'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// For debugging purposes
const DEBUG = true;

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard component
 *
 * Protects routes by checking authentication status.
 * In development mode with bypass enabled, it will allow access without authentication.
 *
 * Usage:
 * ```tsx
 * <AuthGuard>
 *   <YourProtectedComponent />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const router = useRouter();
  const { loading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (DEBUG) {
      console.log('🔐 AuthGuard state:', { loading, isAuthenticated, hasUser: !!user });
    }
  }, [loading, isAuthenticated, user]);

  // Show loading state while checking authentication
  if (loading) {
    if (DEBUG) console.log('🔄 AuthGuard: Loading state');
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center text-center max-w-md mx-auto p-6">
          <div className="mb-6 flex justify-center">
            <div className="flex space-x-2">
              <div className="h-3 w-3 bg-primary rounded-sm animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-3 w-3 bg-primary rounded-sm animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="h-3 w-3 bg-primary rounded-sm animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <div className="h-3 w-3 bg-primary rounded-sm animate-bounce" style={{ animationDelay: '450ms' }}></div>
            </div>
          </div>
          <p className="text-muted-foreground">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    if (DEBUG) console.log('⛔ AuthGuard: Not authenticated, redirecting to', redirectTo);
    // Use a more gentle approach for redirecting
    setTimeout(() => router.replace(redirectTo), 100);
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center">
          <p className="text-muted-foreground">Not authenticated. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If authenticated or bypassed in development, render children
  if (DEBUG) console.log('✅ AuthGuard: Authenticated, rendering children');
  return <>{children}</>;
}
