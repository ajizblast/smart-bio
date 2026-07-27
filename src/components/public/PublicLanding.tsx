import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getThemeStyles } from '../../utils/themeStyles';
import { SocialIcons } from '../ui/SocialIcons';
import { LinkButton } from '../ui/LinkButton';
import { HotelDirectoryPage } from './HotelDirectoryPage';
import { CustomArticlePage } from './CustomArticlePage';
import { Share2 } from 'lucide-react';
import { showToast } from '../ui/Toast';

export function PublicLanding() {
  const profile = useAppStore((s) => s.profile);
  const theme = useAppStore((s) => s.theme);
  const links = useAppStore((s) => s.links);
  const pages = useAppStore((s) => s.pages);

  const [subPage, setSubPage] = useState<string>('main');
  const [hotelFilter, setHotelFilter] = useState('all');

  const styles = getThemeStyles(theme);
  const activeLinks = links.filter((l) => l.active);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Tautan profil berhasil disalin ke clipboard!', 'info');
    });
  };

  if (subPage.startsWith('page-')) {
    const page = pages.find((p) => p.id === subPage);
    if (page) {
      if (page.type === 'hotel') {
        return (
          <div
            className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-300 ${styles.bg}`}
            style={styles.bgStyle ? { backgroundImage: styles.bgStyle } : undefined}
          >
            <div
              className={`w-full max-w-md rounded-[2.5rem] shadow-2xl flex flex-col min-h-[750px] relative transition-all overflow-hidden ${styles.bg}`}
              style={styles.bgStyle ? { backgroundImage: styles.bgStyle } : undefined}
            >
              <HotelDirectoryPage
                page={page}
                onBack={() => { setSubPage('main'); setHotelFilter('all'); }}
                themeStyles={styles}
              />
            </div>
          </div>
        );
      }
      return (
          <div
            className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-300 ${styles.bg}`}
            style={styles.bgStyle ? { backgroundImage: styles.bgStyle } : undefined}
          >
            <div
              className={`w-full max-w-md rounded-[2.5rem] shadow-2xl flex flex-col min-h-[750px] relative transition-all overflow-hidden ${styles.bg}`}
              style={styles.bgStyle ? { backgroundImage: styles.bgStyle } : undefined}
            >
              <CustomArticlePage page={page} onBack={() => setSubPage('main')} themeStyles={styles} />
          </div>
        </div>
      );
    }
  }

  const shareBtnClass =
    theme === 'minimalist-border'
      ? 'absolute top-4 right-4 z-40 bg-white hover:bg-black hover:text-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-2.5 rounded-full transition-all text-slate-800'
      : 'absolute top-4 right-4 z-40 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2.5 rounded-full border border-white/25 text-white transition-all shadow-md';

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-300 ${styles.bg}`}
      style={styles.bgStyle ? { backgroundImage: styles.bgStyle } : undefined}
    >
      <div
        className={`w-full max-w-md rounded-[2.5rem] shadow-2xl flex flex-col min-h-[750px] relative transition-all overflow-hidden ${
          theme === 'minimalist-border'
            ? 'bg-[#fafafa] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
            : `border border-white/20 ${styles.bg}`
        }`}
        style={theme !== 'minimalist-border' && styles.bgStyle ? { backgroundImage: styles.bgStyle } : undefined}
      >
        <div
          className={`w-full flex-grow flex flex-col items-center text-center overflow-hidden rounded-[2.5rem] transition-all duration-300 ${styles.bg}`}
          style={styles.bgStyle ? { backgroundImage: styles.bgStyle } : undefined}
        >
          <button onClick={handleShare} className={shareBtnClass} title="Salin Tautan">
            <Share2 className="w-4 h-4" />
          </button>

          <div className="w-full h-full flex flex-col items-center px-6 pt-16 pb-8 overflow-y-auto no-scrollbar">
            <div className="relative shrink-0 flex flex-col items-center mt-6 w-full">
              <img
                src={profile.avatar || 'https://placehold.co/150x150/6366f1/ffffff?text=User'}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/6366f1/ffffff?text=User'; }}
                alt="Profile Photo"
                className={`w-24 h-24 rounded-full object-cover shadow-2xl ${styles.avatarBorder}`}
              />
              <h2 className="font-extrabold text-xl mt-4 leading-tight">{profile.name || 'Nama Kreator'}</h2>
              <SocialIcons themeStyles={styles} />
              <p className="text-xs mt-3 max-w-sm px-4 leading-relaxed font-normal opacity-90">
                {profile.bio || 'Kreator ini belum menuliskan bio singkat.'}
              </p>
            </div>

            <div className="w-full space-y-4 mt-8">
              {activeLinks.length === 0 ? (
                <div className="py-12 px-6 border border-dashed border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm w-full my-auto text-sm opacity-80 text-center">
                  <i className="fas fa-link-slash text-2xl mb-2 block"></i> Akun ini belum mengaktifkan tautan apapun saat ini.
                </div>
              ) : (
                activeLinks.map((link) => (
                  <LinkButton
                    key={link.id}
                    link={link}
                    themeStyles={styles}
                    onClick={() => {
                      if (link.url.startsWith('#page-')) {
                        setSubPage(link.url.replace('#', ''));
                        setHotelFilter('all');
                      }
                    }}
                  />
                ))
              )}
            </div>

            <div className="mt-12 text-[10px] font-bold opacity-60 tracking-widest flex items-center gap-1.5 justify-center py-4 border-t border-white/10 w-full mt-auto shrink-0 text-center">
              <i className="fas fa-link text-xs"></i> HOTELKEREN DIRECTORY CREATOR
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center max-w-xs flex flex-col items-center gap-1.5">
        <p className="text-[11px] text-slate-400">Desain responsif mobile-first melengkung sempurna.</p>
      </div>
    </div>
  );
}
