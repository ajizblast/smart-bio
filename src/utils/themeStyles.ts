import { ThemeKey, ThemeStyles } from '../types/database';

export function getThemeStyles(theme: ThemeKey): ThemeStyles {
  switch (theme) {
    case 'solid-dark':
      return {
        bg: 'bg-slate-950 text-white',
        bgStyle: undefined,
        card: 'bg-slate-900/80 text-white hover:bg-slate-800 border border-slate-800',
        subText: 'text-slate-400',
        avatarBorder: 'border-2 border-indigo-500',
        badge: 'text-indigo-400 bg-indigo-950/40 border border-indigo-900',
        tag: 'bg-slate-800 text-slate-300',
        btn: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white',
      };
    case 'solid-light':
      return {
        bg: 'bg-white text-slate-800',
        bgStyle: undefined,
        card: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80',
        subText: 'text-slate-500',
        avatarBorder: 'border-2 border-slate-200',
        badge: 'text-slate-600 bg-slate-100',
        tag: 'bg-slate-100 text-slate-600 border border-slate-200',
        btn: 'bg-gradient-to-r from-slate-800 to-slate-950 hover:from-slate-900 hover:to-black text-white',
      };
    case 'gradient-sunset':
      return {
        bg: 'bg-gradient-to-b from-pink-500 via-red-500 to-yellow-500 text-white',
        bgStyle: undefined,
        card: 'bg-white/15 backdrop-blur-md hover:bg-white/25 border border-white/20 text-white',
        subText: 'text-rose-100',
        avatarBorder: 'border-4 border-white/30',
        badge: 'text-pink-100 bg-pink-900/30',
        tag: 'bg-white/20 text-white',
        btn: 'bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-700 hover:to-pink-800 text-white',
      };
    case 'gradient-oceanic':
      return {
        bg: 'bg-gradient-to-b from-blue-600 to-cyan-500 text-white',
        bgStyle: undefined,
        card: 'bg-white/15 backdrop-blur-md hover:bg-white/25 border border-white/20 text-white',
        subText: 'text-blue-100',
        avatarBorder: 'border-4 border-white/30',
        badge: 'text-blue-100 bg-blue-900/30',
        tag: 'bg-white/20 text-white',
        btn: 'bg-gradient-to-r from-blue-800 to-cyan-700 hover:from-blue-900 hover:to-cyan-800 text-white',
      };
    case 'gradient-cosmic':
      return {
        bg: 'bg-gradient-to-b from-indigo-700 via-purple-700 to-pink-700 text-white',
        bgStyle: undefined,
        card: 'bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 text-white',
        subText: 'text-purple-100',
        avatarBorder: 'border-4 border-white/30',
        badge: 'text-purple-100 bg-purple-900/30',
        tag: 'bg-white/10 text-white',
        btn: 'bg-gradient-to-r from-violet-600 to-fuchsia-700 hover:from-violet-700 hover:to-fuchsia-800 text-white',
      };
    case 'minimalist-border':
      return {
        bg: 'bg-[#fafafa] text-slate-900',
        bgStyle: undefined,
        card: 'bg-white hover:bg-black hover:text-white text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:-translate-x-1 hover:-translate-y-1',
        subText: 'text-slate-500',
        avatarBorder: 'border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
        badge: 'text-slate-800 border border-slate-800 bg-white',
        tag: 'border border-slate-900 text-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
        btn: 'bg-black hover:bg-slate-800 text-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]',
      };
    case 'theme-forest':
      return {
        bg: 'text-white bg-cover bg-center bg-no-repeat',
        bgStyle:
          "linear-gradient(to bottom, rgba(16, 44, 30, 0.8), rgba(2, 28, 15, 0.95)), url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600')",
        card: 'bg-emerald-950/30 backdrop-blur-md hover:bg-emerald-900/50 border border-emerald-500/20 text-white',
        subText: 'text-emerald-100/80',
        avatarBorder: 'border-4 border-emerald-500/40',
        badge: 'text-emerald-200 bg-emerald-900/60 border border-emerald-800',
        tag: 'bg-emerald-900/40 text-emerald-100 border border-emerald-800',
        btn: 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white',
      };
    case 'theme-sea':
      return {
        bg: 'text-white bg-cover bg-center bg-no-repeat',
        bgStyle:
          "linear-gradient(to bottom, rgba(12, 74, 96, 0.8), rgba(3, 37, 50, 0.95)), url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600')",
        card: 'bg-cyan-950/30 backdrop-blur-md hover:bg-cyan-900/50 border border-cyan-500/20 text-white',
        subText: 'text-cyan-100/80',
        avatarBorder: 'border-4 border-cyan-500/40',
        badge: 'text-cyan-200 bg-cyan-900/60 border border-cyan-800',
        tag: 'bg-cyan-900/40 text-cyan-100 border border-cyan-800',
        btn: 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white',
      };
    case 'theme-desert':
      return {
        bg: 'text-slate-900 bg-cover bg-center bg-no-repeat',
        bgStyle:
          "linear-gradient(to bottom, rgba(254, 243, 199, 0.8), rgba(217, 119, 6, 0.9)), url('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600')",
        card: 'bg-white/40 backdrop-blur-md hover:bg-white/60 border border-amber-900/20 text-slate-900',
        subText: 'text-amber-950/80',
        avatarBorder: 'border-4 border-amber-700/40',
        badge: 'text-amber-900 bg-amber-200/80 border border-amber-300',
        tag: 'bg-amber-200/60 text-amber-950 border border-amber-300',
        btn: 'bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white',
      };
    case 'theme-nebula':
      return {
        bg: 'text-white bg-cover bg-center bg-no-repeat',
        bgStyle:
          "linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(88, 28, 135, 0.95)), url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=600')",
        card: 'bg-fuchsia-950/30 backdrop-blur-md hover:bg-fuchsia-900/50 border border-fuchsia-500/20 text-white',
        subText: 'text-fuchsia-100/80',
        avatarBorder: 'border-4 border-fuchsia-500/40',
        badge: 'text-fuchsia-200 bg-fuchsia-900/60 border border-fuchsia-800',
        tag: 'bg-fuchsia-900/40 text-fuchsia-100 border border-fuchsia-800',
        btn: 'bg-gradient-to-r from-fuchsia-600 to-violet-700 hover:from-fuchsia-700 hover:to-violet-800 text-white',
      };
    case 'theme-sakura':
      return {
        bg: 'text-slate-800 bg-cover bg-center bg-no-repeat',
        bgStyle:
          "linear-gradient(to bottom, rgba(255, 241, 242, 0.85), rgba(251, 113, 133, 0.95)), url('https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=600')",
        card: 'bg-white/40 backdrop-blur-md hover:bg-white/60 border border-rose-300/30 text-slate-800',
        subText: 'text-rose-900/80',
        avatarBorder: 'border-4 border-rose-400/40',
        badge: 'text-rose-800 bg-rose-200/80 border border-rose-300',
        tag: 'bg-rose-200/60 text-rose-900 border border-rose-300',
        btn: 'bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-700 hover:to-pink-800 text-white',
      };
    default:
      return {
        bg: 'bg-white text-slate-800',
        bgStyle: undefined,
        card: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80',
        subText: 'text-slate-500',
        avatarBorder: 'border-2 border-slate-200',
        badge: 'text-slate-600 bg-slate-100',
        tag: 'bg-slate-100 text-slate-600',
        btn: 'bg-gradient-to-r from-slate-800 to-slate-950 hover:from-slate-900 hover:to-black text-white',
      };
  }
}

export interface ThemeOption {
  key: ThemeKey;
  label: string;
  preview: string;
  bgImage?: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { key: 'solid-light', label: 'Minimalis Light', preview: 'bg-slate-100' },
  { key: 'solid-dark', label: 'Futuristik Dark', preview: 'bg-slate-900' },
  { key: 'gradient-sunset', label: 'Warm Sunset', preview: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500' },
  { key: 'gradient-oceanic', label: 'Oceanic Blue', preview: 'bg-gradient-to-r from-blue-600 to-cyan-500' },
  { key: 'gradient-cosmic', label: 'Cosmic Purple', preview: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700' },
  { key: 'minimalist-border', label: 'Solid Border', preview: 'bg-white border-2 border-slate-800' },
  { key: 'theme-forest', label: 'Hutan Pinus', preview: 'bg-cover bg-center', bgImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=150' },
  { key: 'theme-sea', label: 'Samudra Biru', preview: 'bg-cover bg-center', bgImage: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=150' },
  { key: 'theme-desert', label: 'Sahara Gold', preview: 'bg-cover bg-center', bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=150' },
  { key: 'theme-nebula', label: 'Nebula Space', preview: 'bg-cover bg-center', bgImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=150' },
  { key: 'theme-sakura', label: 'Sakura Blossom', preview: 'bg-cover bg-center', bgImage: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=150' },
];
