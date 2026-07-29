import { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { PublicLanding } from './components/public/PublicLanding';
import { AdminWorkspace } from './components/admin/AdminWorkspace';
import { LoginModal } from './components/admin/LoginModal';
import { Toast } from './components/ui/Toast';
import { ConfirmModal } from './components/ui/ConfirmModal';

function App() {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const [showLogin, setShowLogin] = useState(false);
  const [view, setView] = useState<'public' | 'admin'>(isLoggedIn ? 'admin' : 'public');

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
          <PublicLanding onLoginClick={() => setShowLogin(true)} />
          {!isLoggedIn && <div className="hidden" />}
        </>
      )}
    </div>
  );
}

export default App;
