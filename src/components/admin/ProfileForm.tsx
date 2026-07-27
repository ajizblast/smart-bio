import { useAppStore } from '../../store/useAppStore';
import { useState, useCallback } from 'react';
import { showToast } from '../ui/Toast';
import { Image, User } from 'lucide-react';

export function ProfileForm() {
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);

  const handleChange = useCallback(
    (field: string, value: string) => {
      if (field.startsWith('socials.')) {
        const socialKey = field.replace('socials.', '');
        updateProfile({
          socials: { ...profile.socials, [socialKey]: value },
        });
      } else {
        updateProfile({ [field]: value } as Record<string, unknown>);
      }
    },
    [updateProfile, profile]
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <span className="text-slate-400"><User className="w-5 h-5" /></span>
        <h3 className="font-bold text-slate-800 text-base">Atur Profil & Identitas</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 relative group">
          <img
            src={profile.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt="Avatar Preview"
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-sm"
          />
          <span className="text-[10px] text-slate-400 mt-2 font-medium">Avatar Preview</span>
        </div>
        <div className="md:col-span-3 space-y-2">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">URL Foto Profil</label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Image className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={profile.avatar}
              onChange={(e) => handleChange('avatar', e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>
          <span className="text-[10px] text-slate-400 block italic">Gunakan link gambar direct URL (Unsplash, Imgur, dll.)</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Kreator</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="block w-full px-4 py-2.5 text-sm bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
              placeholder="Nama Anda atau Brand"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wider font-bold">Sesi Database</label>
            <input
              type="text"
              value="Aktif"
              disabled
              className="block w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed opacity-75 font-semibold text-slate-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Bio Singkat</label>
          <textarea
            value={profile.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            rows={3}
            className="block w-full px-4 py-2.5 text-sm bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all resize-none"
            placeholder="Tuliskan deskripsi singkat..."
          />
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest"><i className="fas fa-share-nodes"></i> Tautan Sosial Media</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: 'instagram', label: 'Instagram', icon: 'fab fa-instagram', color: 'text-pink-600' },
              { key: 'tiktok', label: 'TikTok', icon: 'fab fa-tiktok', color: 'text-slate-900' },
              { key: 'threads', label: 'Threads', icon: 'fab fa-threads', color: 'text-purple-600' },
              { key: 'facebook', label: 'Facebook', icon: 'fab fa-facebook', color: 'text-blue-600' },
              { key: 'youtube', label: 'YouTube', icon: 'fab fa-youtube', color: 'text-red-600' },
              { key: 'whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp', color: 'text-emerald-600' },
            ].map((s) => (
              <div key={s.key} className="space-y-1">
                <label className={`text-[10px] text-slate-500 font-bold uppercase ${s.color}`}>
                  <i className={`${s.icon}`}></i> {s.label}
                </label>
                <input
                  type={s.key === 'whatsapp' ? 'text' : 'url'}
                  value={profile.socials[s.key as keyof typeof profile.socials] || ''}
                  onChange={(e) => handleChange(`socials.${s.key}`, e.target.value)}
                  className="block w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500"
                  placeholder={s.key === 'whatsapp' ? '08123456789' : `https://${s.key}.com/user`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
