import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { subscribeToCloudState, saveStateToCloud, pullStateFromCloud } from '../services/firebase';
import { AppState } from '../types/database';
import { MASTER_JSON_DATABASE } from '../data/masterDatabase';

const TIMEOUT_MS = 7500;

export function useCloudDatabase() {
  const {
    setFullState,
    setIsCloudActive,
    setCloudError,
    setInitialLoadComplete,
    isCloudActive,
    persistLocal,
  } = useAppStore();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  const startListening = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (!useAppStore.getState().isCloudActive) {
        setCloudError('Koneksi Firebase Timeout. Ekstensi AdBlocker mungkin memblokir Firebase. Nonaktifkan AdBlocker untuk situs ini atau gunakan mode offline.');
        setIsCloudActive(false);
        setInitialLoadComplete(true);
        console.warn('Firebase connection timeout. Switching to local fallback.');
      }
    }, TIMEOUT_MS);

    unsubRef.current = subscribeToCloudState(
      (data) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsCloudActive(true);
        setCloudError('');

        const state: AppState = {
          profile: {
            ...MASTER_JSON_DATABASE.profile,
            ...(data.profile as Record<string, unknown> || {}),
            socials: {
              ...MASTER_JSON_DATABASE.profile.socials,
              ...((data.profile as Record<string, unknown>)?.socials as Record<string, unknown> || {}),
            },
          } as AppState['profile'],
          theme: (data.theme as AppState['theme']) || MASTER_JSON_DATABASE.theme,
          links: (data.links as AppState['links']) || [],
          hotels: (data.hotels as AppState['hotels']) || [],
          pages: (data.pages as AppState['pages']) || [],
        };

        setFullState(state);
        setInitialLoadComplete(true);
      },
      (error) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const errMsg = (error && typeof error === 'object' && 'code' in error)
          ? (error as { code: string }).code
          : (error instanceof Error ? error.message : String(error));
        const errStr = errMsg.toLowerCase();

        let userMessage: string;
        if (errStr.includes('failed-precondition') || errStr.includes('unavailable') || errStr.includes('network')) {
          userMessage = 'Koneksi Firebase terblokir. Ekstensi AdBlocker atau firewall mungkin memblokir Firebase. Gunakan mode lokal (offline) atau nonaktifkan AdBlocker untuk situs ini.';
        } else if (errStr.includes('permission-denied')) {
          userMessage = 'Firestore ditolak (Permission Denied). Periksa aturan keamanan Firestore di Firebase Console.';
        } else {
          userMessage = 'Koneksi Firebase gagal. Gunakan mode offline sebagai fallback.';
        }

        console.error('Firestore connection error. Using local fallback.', errStr);
        setCloudError(userMessage);
        setIsCloudActive(false);
        setInitialLoadComplete(true);
        if (unsubRef.current) {
          unsubRef.current();
          unsubRef.current = null;
        }
      }
    );
  }, [setFullState, setIsCloudActive, setCloudError]);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }
  }, []);

  const migrateLocalToCloud = useCallback(async () => {
    if (!isCloudActive) {
      throw new Error('Koneksi Firebase belum aktif!');
    }
    const currentState = useAppStore.getState();
    const stateToPush: AppState = {
      profile: currentState.profile,
      theme: currentState.theme,
      links: currentState.links,
      hotels: currentState.hotels,
      pages: currentState.pages,
    };
    await saveStateToCloud(stateToPush);
  }, [isCloudActive]);

  const migrateCloudToLocal = useCallback(async () => {
    if (!isCloudActive) {
      throw new Error('Koneksi Firebase belum aktif!');
    }
    const cloudData = await pullStateFromCloud();
    if (cloudData) {
      const state: AppState = {
        profile: {
          ...MASTER_JSON_DATABASE.profile,
          ...(cloudData.profile as Record<string, unknown> || {}),
          socials: {
            ...MASTER_JSON_DATABASE.profile.socials,
            ...((cloudData.profile as Record<string, unknown>)?.socials as Record<string, unknown> || {}),
          },
        } as AppState['profile'],
        theme: (cloudData.theme as AppState['theme']) || MASTER_JSON_DATABASE.theme,
        links: (cloudData.links as AppState['links']) || [],
        hotels: (cloudData.hotels as AppState['hotels']) || [],
        pages: (cloudData.pages as AppState['pages']) || [],
      };
      setFullState(state);
      return true;
    }
    return false;
  }, [isCloudActive, setFullState]);

  const saveAllChanges = useCallback(async () => {
    const state = useAppStore.getState();
    const stateToSave: AppState = {
      profile: state.profile,
      theme: state.theme,
      links: state.links,
      hotels: state.hotels,
      pages: state.pages,
    };

    if (state.isCloudActive) {
      try {
        await saveStateToCloud(stateToSave);
      } catch {
        persistLocal();
      }
    } else {
      persistLocal();
    }
  }, [persistLocal]);

  useEffect(() => {
    try {
      startListening();
    } catch (err) {
      console.error('Firebase init failed. Using local fallback.', err);
      setCloudError(err instanceof Error ? err.message : 'Firebase initialization failed');
      setIsCloudActive(false);
    }

    return () => {
      stopListening();
    };
  }, [startListening, stopListening, setCloudError, setIsCloudActive]);

  return {
    migrateLocalToCloud,
    migrateCloudToLocal,
    saveAllChanges,
  };
}
