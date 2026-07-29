import { create } from 'zustand';
import { AppState, LinkItem, HotelItem, CustomPage, ThemeKey } from '../types/database';
import { MASTER_JSON_DATABASE } from '../data/masterDatabase';

const STORAGE_KEY = 'hotel_keren_local_state';
const AUTH_KEY = 'lynkforge_logged_in';

function mergeArrayById<T extends { id: string }>(master: T[], local: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of master) map.set(item.id, item);
  for (const item of local) map.set(item.id, item);
  return Array.from(map.values());
}

function loadLocalState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as AppState;
      return {
        ...MASTER_JSON_DATABASE,
        ...parsed,
        profile: {
          ...MASTER_JSON_DATABASE.profile,
          ...parsed.profile,
          socials: { ...MASTER_JSON_DATABASE.profile.socials, ...(parsed.profile?.socials || {}) },
        },
        hotels: mergeArrayById(MASTER_JSON_DATABASE.hotels, parsed.hotels || []),
        links: mergeArrayById(MASTER_JSON_DATABASE.links, parsed.links || []),
        pages: mergeArrayById(MASTER_JSON_DATABASE.pages, parsed.pages || []),
      };
    }
  } catch {
    // ignore
  }
  return JSON.parse(JSON.stringify(MASTER_JSON_DATABASE));
}

function saveLocal(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

interface AppStore extends AppState {
  isLoggedIn: boolean;
  activeTab: 'links' | 'hotels';

  setIsLoggedIn: (v: boolean) => void;
  setActiveTab: (tab: 'links' | 'hotels') => void;

  updateProfile: (updates: Partial<AppState['profile']>) => void;
  setTheme: (theme: ThemeKey) => void;

  addLink: (link: LinkItem) => void;
  updateLink: (id: string, updates: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  moveLinkUp: (id: string) => void;
  moveLinkDown: (id: string) => void;
  toggleLinkActive: (id: string) => void;

  addHotel: (hotel: HotelItem) => void;
  updateHotel: (id: string, updates: Partial<HotelItem>) => void;
  deleteHotel: (id: string) => void;

  addPage: (page: CustomPage) => void;
  updatePage: (id: string, updates: Partial<CustomPage>) => void;
  deletePage: (id: string) => void;

  resetToDefaults: () => void;
  persistLocal: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  ...loadLocalState(),
  isLoggedIn: localStorage.getItem(AUTH_KEY) === 'true',
  activeTab: 'links',

  setIsLoggedIn: (v) => {
    if (v) localStorage.setItem(AUTH_KEY, 'true');
    else localStorage.removeItem(AUTH_KEY);
    set({ isLoggedIn: v });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),

  updateProfile: (updates) => {
    const current = get();
    const newProfile = {
      ...current.profile,
      ...updates,
      socials: { ...current.profile.socials, ...(updates.socials || {}) },
    };
    set({ profile: newProfile });
    saveLocal({ ...current, profile: newProfile });
  },

  setTheme: (theme) => {
    const state = get();
    set({ theme });
    saveLocal({ ...state, theme });
  },

  addLink: (link) => {
    const state = get();
    const newLinks = [...state.links, link];
    set({ links: newLinks });
    saveLocal({ ...state, links: newLinks });
  },

  updateLink: (id, updates) => {
    const state = get();
    const newLinks = state.links.map((l) => (l.id === id ? { ...l, ...updates } : l));
    set({ links: newLinks });
    saveLocal({ ...state, links: newLinks });
  },

  deleteLink: (id) => {
    const state = get();
    const newLinks = state.links.filter((l) => l.id !== id);
    set({ links: newLinks });
    saveLocal({ ...state, links: newLinks });
  },

  moveLinkUp: (id) => {
    const state = get();
    const idx = state.links.findIndex((l) => l.id === id);
    if (idx <= 0) return;
    const newLinks = [...state.links];
    [newLinks[idx - 1], newLinks[idx]] = [newLinks[idx], newLinks[idx - 1]];
    set({ links: newLinks });
    saveLocal({ ...state, links: newLinks });
  },

  moveLinkDown: (id) => {
    const state = get();
    const idx = state.links.findIndex((l) => l.id === id);
    if (idx === -1 || idx >= state.links.length - 1) return;
    const newLinks = [...state.links];
    [newLinks[idx], newLinks[idx + 1]] = [newLinks[idx + 1], newLinks[idx]];
    set({ links: newLinks });
    saveLocal({ ...state, links: newLinks });
  },

  toggleLinkActive: (id) => {
    const state = get();
    const newLinks = state.links.map((l) => (l.id === id ? { ...l, active: !l.active } : l));
    set({ links: newLinks });
    saveLocal({ ...state, links: newLinks });
  },

  addHotel: (hotel) => {
    const state = get();
    const newHotels = [...state.hotels, hotel];
    set({ hotels: newHotels });
    saveLocal({ ...state, hotels: newHotels });
  },

  updateHotel: (id, updates) => {
    const state = get();
    const newHotels = state.hotels.map((h) => (h.id === id ? { ...h, ...updates } : h));
    set({ hotels: newHotels });
    saveLocal({ ...state, hotels: newHotels });
  },

  deleteHotel: (id) => {
    const state = get();
    const newHotels = state.hotels.filter((h) => h.id !== id);
    set({ hotels: newHotels });
    saveLocal({ ...state, hotels: newHotels });
  },

  addPage: (page) => {
    const state = get();
    const newPages = [...state.pages, page];
    set({ pages: newPages });
    saveLocal({ ...state, pages: newPages });
  },

  updatePage: (id, updates) => {
    const state = get();
    const newPages = state.pages.map((p) => (p.id === id ? { ...p, ...updates } : p));
    set({ pages: newPages });
    saveLocal({ ...state, pages: newPages });
  },

  deletePage: (id) => {
    const state = get();
    const newPages = state.pages.filter((p) => p.id !== id);
    const newLinks = state.links.filter((l) => l.url !== `#${id}`);
    set({ pages: newPages, links: newLinks });
    saveLocal({ ...state, pages: newPages, links: newLinks });
  },

  resetToDefaults: () => {
    const fresh = JSON.parse(JSON.stringify(MASTER_JSON_DATABASE));
    set({
      profile: fresh.profile,
      theme: fresh.theme,
      links: fresh.links,
      hotels: fresh.hotels,
      pages: fresh.pages,
    });
    saveLocal(fresh);
  },

  persistLocal: () => {
    const state = get();
    saveLocal(state);
  },
}));
