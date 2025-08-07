import { useEffect, useState } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import { authConfig } from '@/config/authConfig';
import { Hub } from 'aws-amplify/utils';

// For debugging purposes
const DEBUG = true;

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
     async function checkAuth() {
      try {
        if (authConfig.bypassAuth) {
          if (process.env.NODE_ENV !== 'development') {
            throw new Error('Auth bypass is not allowed outside development');
          }
          if (DEBUG) console.log('Auth bypass enabled, using mock user');
          setUser(authConfig.mockUser);
          setLoading(false);
          return;
        }

        if (DEBUG) console.log('Auth bypass disabled, checking real authentication');

        const currentUser = await getCurrentUser();
        if (isMounted) {
          if (DEBUG) console.log('Authentication successful', currentUser);
          setUser(currentUser);
        }
      } catch (authError) {
        if (isMounted) {
          if (DEBUG) console.log('Authentication failed', authError);
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkAuth();

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (DEBUG) console.log('📡 Auth event:', payload.event);

      if (payload.event === 'signedOut' || payload.event === 'tokenRefresh_failure') {
        if (DEBUG) console.log('🔐 Session ended or token expired, clearing user');
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };



  }, []);

  return { user, loading, error, isAuthenticated: !!user };
}
