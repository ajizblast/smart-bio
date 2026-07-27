import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { loginWithEmail } from '../services/firebase';

export function useAdminAuth() {
  const { isLoggedIn, setIsLoggedIn } = useAppStore();

  const login = useCallback(async (email: string, password: string) => {
    const isCloudActive = useAppStore.getState().isCloudActive;
    if (!isCloudActive) {
      throw new Error('Database offline! Harap koneksikan Firebase terlebih dahulu.');
    }
    const userCredential = await loginWithEmail(email, password);
    setIsLoggedIn(true);
    return userCredential.user.email;
  }, [setIsLoggedIn]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  return { isLoggedIn, login, logout };
}
