import { useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { LinkItem, AnimationType } from '../../types/database';
import { showToast } from '../ui/Toast';
import { showConfirm } from '../ui/ConfirmModal';
import { Plus, FolderPlus, ChevronUp, ChevronDown, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

interface LinkModalState {
  open: boolean;
  editId: string | null;
}

interface PageModalState {
  open: boolean;
  editId: string | null;
}

export function LinkManager() {
  const links = useAppStore((s) => s.links);
  const pages = useAppStore((s) => s.pages);
  const addLink = useAppStore((s) => s.addLink);
  const updateLink = useAppStore((s) => s.updateLink);
  const deleteLink = useAppStore((s) => s.deleteLink);
  const moveLinkUp = useAppStore((s) => s.moveLinkUp);
  const moveLinkDown = useAppStore((s) => s.moveLinkDown);
  const toggleLinkActive = useAppStore((s) => s.toggleLinkActive);
  const addPage = useAppStore((s) => s.addPage);
  const updatePage = useAppStore((s) => s.updatePage);
  const deletePage = useAppStore((s) => s.deletePage);

  const [linkModal, setLinkModal] = useState<LinkModalState>({ open: false, editId: null });
  const [pageModal, setPageModal] = useState<PageModalState>({ open: false, editId: null });

  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    icon: 'fa-link',
    animation: 'none' as AnimationType,
    destType: 'url' as 'url' | 'page',
    pageSelect: '',
  });

  const [pageForm, setPageForm] = useState({
    title: '',
    type: 'hotel' as 'hotel' | 'custom',
    filterCity: 'all',
    description: 'Pilihan hotel akomodasi bintang 5 premium terpopuler.',
    customImg: '',
    customText: '',
  });

  const openAddLink = () => {
    setLinkForm({ title: '', url: '', icon: 'fa-link', animation: 'none', destType: 'url', pageSelect: '' });
    setLinkModal({ open: true, editId: null });
  };

  const openEditLink = (id: string) => {
    const link = links.find((l) => l.id === id);
    if (!link) return;
    const isInternal = link.url.startsWith('#page-');
    setLinkForm({
      title: link.title,
      url: isInternal ? '' : link.url,
      icon: link.icon,
      animation: link.animation,
      destType: isInternal ? 'page' : 'url',
      pageSelect: isInternal ? link.url : '',
    });
    setLinkModal({ open: true, editId: id });
  };

  const submitLink = () => {
    if (!linkForm.title.trim()) {
      showToast('Judul Tautan wajib diisi!', 'error');
      return;
    }

    let finalUrl = '';
    if (linkForm.destType === 'url') {
      if (!linkForm.url.trim()) {
        showToast('Tautan URL luar wajib diisi!', 'error');
        return;
      }
      finalUrl = linkForm.url.startsWith('http') || linkForm.url.startsWith('#') ? linkForm.url : 'https://' + linkForm.url;
    } else {
      if (!linkForm.pageSelect) {
        showToast('Pilih salah satu Halaman Internal!', 'error');
        return;
      }
      finalUrl = linkForm.pageSelect;
    }

    if (linkModal.editId) {
      updateLink(linkModal.editId, { title: linkForm.title, url: finalUrl, icon: linkForm.icon, animation: linkForm.animation });
      showToast('Tautan berhasil diperbarui!', 'success');
    } else {
      addLink({
        id: 'link-' + Date.now(),
        title: linkForm.title,
        url: finalUrl,
        icon: linkForm.icon,
        animation: linkForm.animation,
        active: true,
      });
      showToast('Tautan sukses ditambahkan!', 'success');
    }
    setLinkModal({ open: false, editId: null });
  };

  const handleDeleteLink = (id: string) => {
    showConfirm('Apakah Anda yakin ingin menghapus tautan ini dari profil?', () => {
      deleteLink(id);
      showToast('Tautan berhasil dihapus dari direktori.', 'info');
    });
  };

  const openAddPage = () => {
    setPageForm({ title: '', type: 'hotel', filterCity: 'all', description: 'Pilihan hotel akomodasi bintang 5 premium terpopuler.', customImg: '', customText: '' });
    setPageModal({ open: true, editId: null });
  };

  const openEditPage = (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (!page) return;
    setPageForm({
      title: page.title,
      type: page.type,
      filterCity: page.filterCity || 'all',
      description: page.description || '',
      customImg: page.customImg || '',
      customText: page.customText || '',
    });
    setPageModal({ open: true, editId: id });
  };

  const submitPage = () => {
    if (!pageForm.title.trim()) {
      showToast('Judul Halaman wajib diisi!', 'error');
      return;
    }

    const pageData: Record<string, unknown> = { title: pageForm.title, type: pageForm.type };

    if (pageForm.type === 'hotel') {
      pageData.filterCity = pageForm.filterCity.trim().toLowerCase() || 'all';
      pageData.description = pageForm.description;
    } else {
      pageData.customImg = pageForm.customImg || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500';
      pageData.customText = pageForm.customText;
    }

    if (pageModal.editId) {
      updatePage(pageModal.editId, pageData as Partial<import('../../types/database').CustomPage>);
      showToast('Halaman internal berhasil diperbarui!', 'success');
    } else {
      const newId = 'page-' + Math.random().toString(36).substr(2, 9);
      addPage({ id: newId, ...pageData } as import('../../types/database').CustomPage);
      addLink({
        id: 'link-' + Date.now(),
        title: pageForm.title,
        url: '#' + newId,
        icon: pageForm.type === 'hotel' ? 'fa-hotel' : 'fa-info-circle',
        animation: 'glow',
        active: true,
      });
      showToast('Halaman sukses dibuat & otomatis ditambahkan ke tombol utama!', 'success');
    }
    setPageModal({ open: false, editId: null });
  };

  const handleDeletePage = (id: string) => {
    showConfirm('Apakah Anda yakin ingin menghapus halaman kustom ini? Tombol navigasi halaman utama yang mengarah ke halaman ini juga akan ikut dihapus.', () => {
      deletePage(id);
      showToast('Halaman kustom dan tombol navigasinya berhasil dihapus.', 'info');
    });
  };

  const ICON_OPTIONS = ['fa-link', 'fa-hotel', 'fa-info-circle', 'fa-instagram', 'fa-whatsapp', 'fa-shopping-cart'];
  const ANIMATION_OPTIONS: { value: AnimationType; label: string }[] = [
    { value: 'none', label: 'Tanpa Efek (Standar)' },
    { value: 'glow', label: 'Neon Glow (Menyala Berkilau)' },
    { value: 'bounce', label: 'Bounce (Membal)' },
    { value: 'pulse', label: 'Pulse (Denyutan)' },
    { value: 'wobble', label: 'Wobble (Goyang Samping)' },
    { value: 'shake', label: 'Shake (Getaran Intens)' },

  ];

  return (
    <>
      {/* Pages List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-slate-400"><i className="fas fa-list-ul text-xl"></i></span>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Kelola Daftar Tautan & Halaman</h3>
              <p className="text-xs text-slate-400">Hubungkan tombol ke URL web luar atau Halaman Kustom Anda sendiri</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={openAddPage} className="px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg flex items-center gap-1.5 transition-all shadow-sm">
              <FolderPlus className="w-3.5 h-3.5" /> + Halaman Baru
            </button>
            <button onClick={openAddLink} className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-100">
              <Plus className="w-3.5 h-3.5" /> + Link Baru
            </button>
          </div>
        </div>

        {/* Pages */}
        <div className="space-y-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i className="fas fa-folder text-indigo-500"></i> Daftar Halaman Internal Anda:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pages.length === 0 ? (
              <div className="col-span-full py-4 text-center text-xs text-slate-400">
                Belum ada halaman kustom internal. Klik "+ Halaman Baru" untuk memulai.
              </div>
            ) : (
              pages.map((page) => {
                const label = page.type === 'hotel' ? `Daftar Hotel (${(page.filterCity || 'all').toUpperCase()})` : 'Halaman Teks Kustom';
                return (
                  <div key={page.id} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs hover:border-indigo-300 transition-all">
                    <div className="overflow-hidden pr-2">
                      <span className="font-bold text-slate-800 block truncate">{page.title}</span>
                      <span className="text-[9px] text-slate-400 block">{label} (#{page.id})</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEditPage(page.id)} className="p-1 text-slate-500 hover:text-indigo-600" title="Edit Halaman"><Edit className="w-3 h-3" /></button>
                      <button onClick={() => handleDeletePage(page.id)} className="p-1 text-rose-500 hover:text-rose-700" title="Hapus Halaman"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Links */}
        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
              <i className="fas fa-link-slash text-xl"></i>
            </div>
            <h4 className="font-semibold text-slate-700 text-sm">Belum Ada Tautan</h4>
            <p className="text-xs text-slate-400 max-w-xs mt-1">Mulai tambahkan link sosial media, portofolio, toko, atau tautan penting Anda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => {
              const isInternal = link.url.startsWith('#page-');
              const cleanDest = isInternal ? `Internal Halaman: ${link.url}` : link.url;
              return (
                <div key={link.id} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-xl transition-all gap-4 hover:border-indigo-300">
                  <div className="flex items-center gap-3 overflow-hidden flex-grow">
                    <div className="flex flex-col gap-1 mr-2 shrink-0">
                      <button
                        onClick={() => moveLinkUp(link.id)}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        disabled={index === 0}
                        title="Geser Naik"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveLinkDown(link.id)}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        disabled={index === links.length - 1}
                        title="Geser Turun"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="bg-indigo-100 text-indigo-600 w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
                      <i className={`fas ${link.icon || 'fa-link'}`}></i>
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{link.title}</h4>
                        {link.animation !== 'none' && (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-bold uppercase tracking-wider">{link.animation}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{cleanDest}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleLinkActive(link.id)}
                      className={`p-1.5 rounded-lg text-xs font-semibold ${link.active ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'}`}
                      title={link.active ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {link.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => openEditLink(link.id)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-all text-xs" title="Edit Tautan">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteLink(link.id)} className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all text-xs" title="Hapus Tautan">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Link Modal */}
      {linkModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <i className={`fas ${linkModal.editId ? 'fa-edit text-purple-500' : 'fa-plus-circle text-indigo-500'}`}></i>
                {linkModal.editId ? 'Edit Tautan' : 'Tambah Link Baru'}
              </h3>
              <button onClick={() => setLinkModal({ open: false, editId: null })} className="text-slate-400 hover:text-slate-600 transition-all p-1.5 rounded-lg hover:bg-slate-100">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Judul Tautan</label>
                <input
                  type="text"
                  value={linkForm.title}
                  onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                  className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
                  placeholder="Contoh: Kunjungi Web Portofolio Saya"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Tujuan Tautan</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setLinkForm({ ...linkForm, destType: 'url' })}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${linkForm.destType === 'url' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-600'}`}
                  >
                    URL Web Luar
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkForm({ ...linkForm, destType: 'page' })}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${linkForm.destType === 'page' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-600'}`}
                  >
                    Halaman Internal
                  </button>
                </div>
                {linkForm.destType === 'url' ? (
                  <input
                    type="text"
                    value={linkForm.url}
                    onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                    className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
                    placeholder="https://instagram.com/user"
                  />
                ) : (
                  <select
                    value={linkForm.pageSelect}
                    onChange={(e) => setLinkForm({ ...linkForm, pageSelect: e.target.value })}
                    className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
                  >
                    <option value="">-- Pilih Halaman --</option>
                    {pages.map((p) => (
                      <option key={p.id} value={`#${p.id}`}>{p.title} ({p.type})</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Ikon Shortcut (Opsional)</label>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setLinkForm({ ...linkForm, icon })}
                      className={`p-2.5 border rounded-xl text-sm flex justify-center items-center transition-all ${linkForm.icon === icon ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                    >
                      <i className={`fas ${icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Efek Animasi Tombol</label>
                <select
                  value={linkForm.animation}
                  onChange={(e) => setLinkForm({ ...linkForm, animation: e.target.value as AnimationType })}
                  className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
                >
                  {ANIMATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3 border-t border-slate-100">
              <button onClick={() => setLinkModal({ open: false, editId: null })} className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">Batal</button>
              <button onClick={submitLink} className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md">Simpan Tautan</button>
            </div>
          </div>
        </div>
      )}

      {/* Page Modal */}
      {pageModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <i className={`fas ${pageModal.editId ? 'fa-edit text-indigo-600' : 'fa-folder-plus text-emerald-600'}`}></i>
                {pageModal.editId ? 'Edit Halaman Kustom' : 'Buat Halaman Baru'}
              </h3>
              <button onClick={() => setPageModal({ open: false, editId: null })} className="text-slate-400 hover:text-slate-600 transition-all p-1.5 rounded-lg hover:bg-slate-100">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Judul Halaman</label>
                <input
                  type="text"
                  value={pageForm.title}
                  onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                  className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
                  placeholder="Contoh: Daftar Hotel Terbaik"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Tipe Halaman</label>
                <select
                  value={pageForm.type}
                  onChange={(e) => setPageForm({ ...pageForm, type: e.target.value as 'hotel' | 'custom' })}
                  className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
                >
                  <option value="hotel">Daftar Hotel (Auto-database kota)</option>
                  <option value="custom">Halaman Teks & Info Kustom</option>
                </select>
              </div>
              {pageForm.type === 'hotel' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wider font-bold">Saring Berdasarkan Nama Kota</label>
                    <input
                      type="text"
                      value={pageForm.filterCity}
                      onChange={(e) => setPageForm({ ...pageForm, filterCity: e.target.value })}
                      className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
                      placeholder="Ketik nama kota (misal: jakarta, bali) ATAU 'all' untuk semua kota"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Sub-judul / Deskripsi Halaman</label>
                    <input
                      type="text"
                      value={pageForm.description}
                      onChange={(e) => setPageForm({ ...pageForm, description: e.target.value })}
                      className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
                      placeholder="Pilihan hotel akomodasi premium terpopuler."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">URL Banner Foto Atas</label>
                    <input
                      type="url"
                      value={pageForm.customImg}
                      onChange={(e) => setPageForm({ ...pageForm, customImg: e.target.value })}
                      className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Konten / Narasi Kustom</label>
                    <textarea
                      value={pageForm.customText}
                      onChange={(e) => setPageForm({ ...pageForm, customText: e.target.value })}
                      rows={4}
                      className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all resize-none"
                      placeholder="Tuliskan cerita, pengumuman, atau konten informasi detail di sini..."
                    />
                  </div>
                </>
              )}
            </div>
            <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3 border-t border-slate-100">
              <button onClick={() => setPageModal({ open: false, editId: null })} className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">Batal</button>
              <button onClick={submitPage} className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md">Simpan Halaman</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
