import { useAppStore } from '../../store/useAppStore';
import { useCloudDatabase } from '../../hooks/useCloudDatabase';
import { showToast } from '../ui/Toast';
import { showConfirm } from '../ui/ConfirmModal';
import { CloudUpload, CloudDownload } from 'lucide-react';

export function MigrationCenter() {
  const isCloudActive = useAppStore((s) => s.isCloudActive);
  const { migrateLocalToCloud, migrateCloudToLocal } = useCloudDatabase();

  const handleUpload = () => {
    if (!isCloudActive) {
      showToast('Koneksi Firebase belum aktif!', 'error');
      return;
    }
    showConfirm('Apakah Anda yakin ingin MENUMPUK data di Cloud Firebase dengan data lokal saat ini?', async () => {
      try {
        showToast('Sedang mengunggah data lokal ke Firebase...', 'info');
        await migrateLocalToCloud();
        showToast('Sukses bermigrasi! Data lokal Anda kini aktif di Cloud Firestore.', 'success');
      } catch (err) {
        showToast('Gagal mengunggah data: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
      }
    });
  };

  const handleDownload = () => {
    if (!isCloudActive) {
      showToast('Koneksi Firebase belum aktif!', 'error');
      return;
    }
    showConfirm('Apakah Anda yakin ingin menumpuk data lokal Anda dengan data terbaru dari Cloud Firebase?', async () => {
      try {
        showToast('Sedang mengunduh data dari Cloud...', 'info');
        const success = await migrateCloudToLocal();
        if (success) {
          showToast('Sukses! Data Cloud berhasil disalin ke LocalStorage Anda.', 'success');
        } else {
          showToast('Tidak ada data di Cloud Firestore untuk ditarik.', 'error');
        }
      } catch (err) {
        showToast('Gagal mengunduh data: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
      }
    });
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-indigo-100/60">
        <div className="flex items-center gap-2.5">
          <span className="text-indigo-600 text-base"><i className="fas fa-file-import"></i></span>
          <h3 className="font-extrabold text-slate-800 text-sm">Pusat Sinkronisasi & Migrasi Data</h3>
        </div>
        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-[9px] font-extrabold uppercase tracking-wider">Advanced</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        Pindahkan seluruh database hotel, halaman kustom, dan profil yang Anda edit di VSCode secara instan ke Cloud Firebase Anda, atau sebaliknya.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <button onClick={handleUpload} className="py-2.5 px-4 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm">
          <CloudUpload className="w-4 h-4" /> Unggah Data Lokal ke Firebase
        </button>
        <button onClick={handleDownload} className="py-2.5 px-4 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm">
          <CloudDownload className="w-4 h-4" /> Tarik Data Firebase ke Lokal
        </button>
      </div>
      <div className="text-[10px] text-slate-400 italic flex items-center gap-1">
        <i className="fas fa-info-circle text-indigo-400"></i> Pastikan indikator database di atas berwarna hijau (Cloud Aktif) sebelum melakukan migrasi.
      </div>
    </div>
  );
}
