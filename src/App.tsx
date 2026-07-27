import { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { useCloudDatabase } from './hooks/useCloudDatabase';
import { PublicLanding } from './components/public/PublicLanding';
import { AdminWorkspace } from './components/admin/AdminWorkspace';
import { LoginModal } from './components/admin/LoginModal';
import { Toast } from './components/ui/Toast';
import { ConfirmModal } from './components/ui/ConfirmModal';

function App() {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const [showLogin, setShowLogin] = useState(false);
  const [view, setView] = useState<'public' | 'admin'>(isLoggedIn ? 'admin' : 'public');

  useCloudDatabase();

  const handleLogout = () => {
    setView('public');
  };

  const handleShowPublic = () => {
    setView('public');
  };

  const handleShowAdmin = () => {
    if (isLoggedIn) {
      setView('admin');
    } else {
      setShowLogin(true);
    }
  };

  const handleLoginClose = () => {
    setShowLogin(false);
    if (useAppStore.getState().isLoggedIn) {
      setView('admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Toast />
      <ConfirmModal />
      <LoginModal visible={showLogin} onClose={handleLoginClose} />

      {view === 'admin' && isLoggedIn ? (
        <AdminWorkspace onLogout={handleLogout} onShowPublic={handleShowPublic} />
      ) : (
        <>
          <PublicLanding />
          {!isLoggedIn && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
              <button
                onClick={() => setShowLogin(true)}
                className="text-[11px] text-slate-400 hover:text-indigo-600 transition-all font-semibold underline cursor-pointer bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
                title="Admin Login"
              >
                Login
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
