import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useCloudDatabase } from '../../hooks/useCloudDatabase';
import { showConfirm } from '../ui/ConfirmModal';
import { showToast } from '../ui/Toast';
import { ProfileForm } from './ProfileForm';
import { LinkManager } from './LinkManager';
import { HotelManager } from './HotelManager';
import { ThemeSelector } from './ThemeSelector';
import { MigrationCenter } from './MigrationCenter';
import { PhonePreview } from './PhonePreview';
import { Link, Hotel, Globe, LogOut, Save, RotateCcw } from 'lucide-react';

interface AdminWorkspaceProps {
  onLogout: () => void;
  onShowPublic: () => void;
}

export function AdminWorkspace({ onLogout, onShowPublic }: AdminWorkspaceProps) {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const isCloudActive = useAppStore((s) => s.isCloudActive);
  const cloudError = useAppStore((s) => s.cloudError);
  const resetToDefaults = useAppStore((s) => s.resetToDefaults);
  const { logout } = useAdminAuth();
  const { saveAllChanges } = useCloudDatabase();

  const handleLogout = () => {
    showConfirm('Apakah Anda yakin ingin keluar dari Admin Dashboard?', () => {
      logout();
      onLogout();
      showToast('Sesi telah keluar dengan aman.', 'info');
    });
  };

  const handleSave = async () => {
    try {
      await saveAllChanges();
      showToast('Seluruh modifikasi profil, links, dan database sukses disimpan!', 'success');
    } catch {
      showToast('Gagal menyimpan ke Cloud Firestore.', 'error');
    }
  };

  const handleReset = () => {
    showConfirm('Apakah Anda yakin ingin mengatur ulang seluruh data profil, tautan, dan database hotel ke nilai default bawaan?', () => {
      resetToDefaults();
      showToast('Pengaturan disetel ke default.', 'info');
    });
  };

  return (
    <div className="flex-grow flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-md shadow-indigo-100">
            <Link className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">HotelKeren</h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Link & Page Builder</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 ${
              isCloudActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isCloudActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {isCloudActive ? 'Cloud Database (Aktif)' : 'Local JSON (Offline)'}
            </span>
            <button onClick={onShowPublic} className="px-4 py-2 text-xs md:text-sm font-semibold rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-all flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" /> Halaman Utama
            </button>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <button onClick={handleLogout} className="hidden md:flex px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold text-xs transition-all items-center gap-2" title="Keluar">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
            <button onClick={handleLogout} className="md:hidden p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all" title="Keluar">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          {cloudError && (
            <div className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 max-w-md truncate">
              <i className="fas fa-exclamation-circle"></i> Error: {cloudError}
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        <div className="flex-grow grid grid-cols-1 xl:grid-cols-12 gap-6 p-4 md:p-6 lg:p-8">
          <div className="xl:col-span-7 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/40 shadow-inner">
              <button
                onClick={() => setActiveTab('links')}
                className={`py-3 px-4 rounded-xl text-xs md:text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all ${
                  activeTab === 'links' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Link className="w-4 h-4" /> Kelola Tautan & Tema
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
                className={`py-3 px-4 rounded-xl text-xs md:text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all ${
                  activeTab === 'hotels' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Hotel className="w-4 h-4" /> Database Hotel (Kota)
              </button>
            </div>

            {activeTab === 'links' ? (
              <div className="space-y-6">
                <ProfileForm />
                <MigrationCenter />
                <LinkManager />
                <ThemeSelector />
              </div>
            ) : (
              <div className="space-y-6">
                <HotelManager />
              </div>
            )}

            <div className="flex items-center gap-3">
              <button onClick={handleSave} className="flex-grow py-3 px-6 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Simpan Semua Perubahan (Cloud)
              </button>
              <button onClick={handleReset} className="py-3 px-5 text-sm font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all flex items-center justify-center gap-2 border border-rose-100" title="Reset ke Default">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          <PhonePreview />
        </div>
      </main>
    </div>
  );
}
