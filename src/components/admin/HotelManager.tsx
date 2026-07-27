import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { HotelItem } from '../../types/database';
import { showToast } from '../ui/Toast';
import { showConfirm } from '../ui/ConfirmModal';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface HotelModalState {
  open: boolean;
  editId: string | null;
}

export function HotelManager() {
  const hotels = useAppStore((s) => s.hotels);
  const addHotel = useAppStore((s) => s.addHotel);
  const updateHotel = useAppStore((s) => s.updateHotel);
  const deleteHotel = useAppStore((s) => s.deleteHotel);

  const [modal, setModal] = useState<HotelModalState>({ open: false, editId: null });
  const [form, setForm] = useState({
    name: '',
    city: '',
    rating: '',
    badge: '',
    location: '',
    price: '',
    bookingUrl: '',
    image: '',
  });

  const openAdd = () => {
    setForm({ name: '', city: '', rating: '', badge: '', location: '', price: '', bookingUrl: '', image: '' });
    setModal({ open: true, editId: null });
  };

  const openEdit = (id: string) => {
    const hotel = hotels.find((h) => h.id === id);
    if (!hotel) return;
    setForm({
      name: hotel.name,
      city: hotel.city,
      rating: hotel.rating,
      badge: hotel.badge,
      location: hotel.location,
      price: hotel.price,
      bookingUrl: hotel.bookingUrl,
      image: hotel.image,
    });
    setModal({ open: true, editId: id });
  };

  const submit = () => {
    if (!form.name.trim() || !form.city.trim() || !form.rating.trim() || !form.location.trim() || !form.price.trim()) {
      showToast('Semua data termasuk Kota wajib diisi!', 'error');
      return;
    }

    const data: HotelItem = {
      id: modal.editId || 'hotel-' + Date.now(),
      name: form.name.trim(),
      city: form.city.trim().toLowerCase(),
      rating: form.rating.trim(),
      badge: form.badge.trim() || 'Populer',
      location: form.location.trim(),
      price: form.price.trim(),
      bookingUrl: form.bookingUrl.trim(),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    };

    if (modal.editId) {
      updateHotel(modal.editId, data);
      showToast('Data hotel berhasil diperbarui!', 'success');
    } else {
      addHotel(data);
      showToast(`Hotel sukses ditambahkan ke kota ${data.city.toUpperCase()}`, 'success');
    }
    setModal({ open: false, editId: null });
  };

  const handleDelete = (id: string) => {
    showConfirm('Apakah Anda yakin ingin menghapus hotel ini dari database?', () => {
      deleteHotel(id);
      showToast('Hotel sukses dihapus dari database.', 'info');
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-indigo-600"><i className="fas fa-hotel text-xl"></i></span>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Daftar Database Hotel</h3>
              <p className="text-xs text-slate-400">Database rekomendasi hotel kota Jakarta, Bandung, dan kota lainnya</p>
            </div>
          </div>
          <button onClick={openAdd} className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-all shadow-sm">
            <Plus className="w-3.5 h-3.5" /> Tambah Hotel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotels.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-8 text-center text-slate-400 text-xs">
              Belum ada database hotel. Silakan tambahkan baru.
            </div>
          ) : (
            hotels.map((hotel) => (
              <div key={hotel.id} className="bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden flex flex-col p-3 gap-2.5 relative group">
                <div className="flex gap-3 items-center">
                  <img src={hotel.image} className="w-12 h-12 rounded-lg object-cover bg-slate-200" alt="" />
                  <div className="overflow-hidden flex-grow">
                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[9px] font-bold uppercase tracking-wider mb-1 inline-block">{hotel.city}</span>
                    <h4 className="font-bold text-slate-800 text-xs truncate">{hotel.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5"><i className="fas fa-map-marker-alt"></i> {hotel.location}</p>
                    <span className="text-[11px] font-extrabold text-indigo-600 block mt-1">{hotel.price}</span>
                  </div>
                </div>
                <div className="text-[10px] bg-indigo-50/50 p-1.5 rounded-lg text-indigo-700 font-medium truncate mt-1">
                  <i className="fas fa-external-link-alt text-[9px]"></i> <span className="opacity-70">Booking Link:</span> {hotel.bookingUrl || 'Belum diatur'}
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/40 pt-2 text-[10px]">
                  <span className="text-amber-500 font-bold"><i className="fas fa-star text-xs"></i> {hotel.rating}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(hotel.id)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-all font-semibold flex items-center gap-1">
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(hotel.id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md transition-all font-semibold flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hotel Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <i className={`fas ${modal.editId ? 'fa-edit text-purple-500' : 'fa-plus-circle text-indigo-500'}`}></i>
                {modal.editId ? 'Edit Database Hotel' : 'Tambah Database Hotel'}
              </h3>
              <button onClick={() => setModal({ open: false, editId: null })} className="text-slate-400 hover:text-slate-600 transition-all p-1.5 rounded-lg hover:bg-slate-100">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Hotel</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all" placeholder="Contoh: The Ritz-Carlton Jakarta" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wider font-semibold">Kota Lokasi</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all" placeholder="Contoh: jakarta, bandung, bali" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Rating Bintang (1 - 5)</label>
                  <input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all" placeholder="Contoh: 4.8" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Badge Promo / Status</label>
                <input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all" placeholder="Contoh: Populer / Terlaris" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Lokasi Detail / Area</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all" placeholder="Contoh: Kuningan, Jakarta" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Harga per Malam</label>
                <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all" placeholder="Contoh: Rp 1.500.000" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wider font-bold">Link Booking Mitra</label>
                <input type="url" value={form.bookingUrl} onChange={(e) => setForm({ ...form, bookingUrl: e.target.value })} className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all" placeholder="https://www.traveloka.com/..." />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">URL Foto Hotel</label>
                <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="block w-full px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all" placeholder="https://images.unsplash.com/photo-..." />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3 border-t border-slate-100">
              <button onClick={() => setModal({ open: false, editId: null })} className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">Batal</button>
              <button onClick={submit} className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md">Simpan Data</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
