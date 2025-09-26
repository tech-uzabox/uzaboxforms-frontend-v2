import { authService } from '@/services/auth';
import { useAuthStore } from '@/store/use-auth-store';

export const handleLogout = async () => {
  const { clearAuth } = useAuthStore.getState();
  
  try {
    await authService.logout();
    clearAuth();
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    clearAuth();
    return { success: true, message: 'Logged out locally' };
  }
};

export const forceLogout = () => {
  const { clearAuth } = useAuthStore.getState();
  clearAuth();
  return { success: true, message: 'Logged out locally' };
};
