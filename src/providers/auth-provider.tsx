import { AuthProviderProps } from '@/types';
import { authService } from '@/services/auth';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { FullScreenLoader } from '@/components/ui/loader';

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUser, setRoles, clearAuth, setAuthLoading, isAuthLoading, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const hasCheckedAuth = useRef(false);
  
  useEffect(() => {
    // Only check auth once on mount, or if user is not authenticated
    if (hasCheckedAuth.current || isAuthenticated) return;
    
    // Don't check auth if we're on login/register pages
    if (window.location.pathname.startsWith('/auth/')) {
      setLoading(false);
      setAuthLoading(false);
      hasCheckedAuth.current = true;
      return;
    }
    
    const checkAuth = async () => {
      try {
        setLoading(true);
        setAuthLoading(true);

        // Use profile endpoint to validate token and get user data
        // Tokens are automatically sent via HTTP-only cookies
        const response = await authService.getProfile();
        const {roles, ...user} = response;

        if (user.status == "ENABLED") {
          setUser(user);
          setRoles(roles);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuth();
      } finally {
        setLoading(false);
        setAuthLoading(false);
        hasCheckedAuth.current = true;
      }
    };

    checkAuth();
  }, []);

  if (loading || isAuthLoading) {
    return <FullScreenLoader label="Loading..." />;
  }
  return <>{children}</>;
};

export default AuthProvider;