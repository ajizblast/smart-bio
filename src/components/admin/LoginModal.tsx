import { useState } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { showToast } from '../ui/Toast';
import { Shield, Eye, EyeOff, X } from 'lucide-react';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

export function LoginModal({ visible, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      showToast('Memverifikasi kredensial Firebase...', 'info');
      const userEmail = await login(email.trim(), password.trim());
      showToast(`Berhasil masuk sebagai ${userEmail}!`, 'success');
      onClose();
    } catch (error: unknown) {
      setShaking(true);
      let errorMessage = 'Gagal memverifikasi akun Anda.';
      if (error && typeof error === 'object' && 'code' in error) {
        const code = (error as { code: string }).code;
        if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
          errorMessage = 'Email atau Password Firebase salah!';
        } else if (code === 'auth/invalid-email') {
          errorMessage = 'Format penulisan email tidak valid!';
        } else if (code === 'auth/too-many-requests') {
          errorMessage = 'Terlalu banyak percobaan. Silakan coba beberapa saat lagi.';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      showToast(errorMessage, 'error');
      setTimeout(() => setShaking(false), 820);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_40%)] pointer-events-none"></div>

      <div className={`bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl flex flex-col gap-6 relative ${shaking ? 'animate-shake' : ''}`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-indigo-200/60 hover:text-white transition-all">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex bg-gradient-to-r from-indigo-500 to-purple-600 p-3.5 rounded-2xl shadow-xl shadow-indigo-500/20 mb-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">HotelKeren Admin Gate</h2>
          <p className="text-xs text-indigo-200/60 font-semibold tracking-wider uppercase">Masuk untuk mengelola link directory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-indigo-200 uppercase tracking-widest">Email / Username</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-300/60">
                  <Shield className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 text-sm bg-white/5 border border-white/15 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all text-white placeholder-indigo-300/30"
                  placeholder="Email terdaftar Anda"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-indigo-200 uppercase tracking-widest">Password</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-300/60">
                  <i className="fas fa-lock text-sm"></i>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 text-sm bg-white/5 border border-white/15 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all text-white placeholder-indigo-300/30"
                  placeholder="Password Anda"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-300/60 hover:text-indigo-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Memverifikasi...' : 'Sign In Securely'}</span>
            {!loading && <i className="fas fa-arrow-right"></i>}
          </button>
        </form>

        <div className="bg-indigo-950/40 border border-indigo-900/40 rounded-xl p-3.5 text-center text-[10px] text-indigo-300/70 leading-relaxed">
          <i className="fas fa-info-circle mr-1"></i> Gunakan email & password yang Anda daftarkan di Firebase Console.
        </div>
      </div>
    </div>
  );
}
