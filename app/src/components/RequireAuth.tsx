import { type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  /** If provided, redirect to this page name when not authenticated */
  redirectTo?: string;
  setPage?: (page: string) => void;
}

/**
 * Renders children only when user is authenticated.
 * If redirectTo and setPage are provided, redirects to that page (e.g. SignIn) when not logged in.
 */
export function RequireAuth({ children, redirectTo, setPage }: RequireAuthProps) {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (redirectTo && setPage) {
      setPage(redirectTo);
      return null;
    }
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/80 mb-4">You need to sign in to view this page.</p>
          {setPage && (
            <button onClick={() => setPage('SignIn')} className="btn-gold">
              Sign in
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
