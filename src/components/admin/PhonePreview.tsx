import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getThemeStyles } from '../../utils/themeStyles';
import { SocialIcons } from '../ui/SocialIcons';
import { LinkButton } from '../ui/LinkButton';
import { HotelDirectoryPage } from '../public/HotelDirectoryPage';
import { CustomArticlePage } from '../public/CustomArticlePage';

export function PhonePreview() {
  const profile = useAppStore((s) => s.profile);
  const theme = useAppStore((s) => s.theme);
  const links = useAppStore((s) => s.links);
  const pages = useAppStore((s) => s.pages);

  const [subPage, setSubPage] = useState<string>('main');
  const [hotelFilter, setHotelFilter] = useState('all');

  const styles = getThemeStyles(theme);
  const activeLinks = links.filter((l) => l.active);

  const containerClasses = `w-full h-full rounded-[32px] overflow-hidden flex flex-col relative transition-all duration-300 ${styles.bg}`;
  const isLightBg = styles.bg.includes('text-slate-900') || styles.bg.includes('text-slate-800');

  const renderContent = () => {
    if (subPage.startsWith('page-')) {
      const page = pages.find((p) => p.id === subPage);
      if (page) {
        if (page.type === 'hotel') {
          return (
            <HotelDirectoryPage
              page={page}
              onBack={() => { setSubPage('main'); setHotelFilter('all'); }}
              themeStyles={styles}
              isPreview
            />
          );
        }
        return (
          <CustomArticlePage page={page} onBack={() => setSubPage('main')} themeStyles={styles} isPreview />
        );
      }
    }

    return (
      <>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)' }}></div>
        <div className="w-full flex-grow flex flex-col items-center px-4 pt-10 pb-6 overflow-y-auto no-scrollbar">
          <div className="mt-4 shrink-0">
            <img
              src={profile.avatar || 'https://placehold.co/150x150/6366f1/ffffff?text=User'}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/6366f1/ffffff?text=User'; }}
              alt="Profile Photo"
              className={`w-16 h-16 rounded-full object-cover shadow-lg ${styles.avatarBorder}`}
            />
          </div>
          <h3 className="font-extrabold text-sm mt-3 leading-tight truncate w-full text-center px-2">
            {profile.name || 'Nama Kreator'}
          </h3>
          <SocialIcons themeStyles={styles} />
          <p className="text-[10px] mt-2.5 leading-relaxed font-normal opacity-85 w-full text-center px-4 break-words line-clamp-2">
            {profile.bio || 'Tuliskan bio Anda...'}
          </p>
          <div className="w-full space-y-3 mt-6">
            {activeLinks.length === 0 ? (
              <div className={`py-8 px-4 border border-dashed rounded-xl w-full my-auto text-xs text-center ${isLightBg ? 'border-slate-300 bg-slate-100 text-slate-500' : 'border-white/20 bg-white/5 backdrop-blur-sm opacity-70'}`}>
                <i className="fas fa-link-slash text-lg mb-1 block"></i> Belum ada link aktif.
              </div>
            ) : (
              activeLinks.map((link) => (
                <LinkButton
                  key={link.id}
                  link={link}
                  themeStyles={styles}
                  isPreview
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
          <div className="mt-8 text-[9px] font-bold opacity-50 tracking-widest flex items-center gap-1.5 justify-center py-2">
            <i className="fas fa-link"></i> POWERED BY HOTELKEREN
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="xl:col-span-5 flex flex-col items-center justify-start py-4 bg-slate-100/30 rounded-3xl border border-slate-100">
      <div className="sticky top-28 w-full flex flex-col items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Preview Mockup
        </span>
        <div className="relative w-[340px] h-[670px] bg-slate-950 rounded-[45px] p-3.5 shadow-2xl border-4 border-slate-900 flex flex-col overflow-hidden">
          <div className="phone-notch flex justify-around items-center px-4">
            <span className="text-[10px] text-white/80 font-bold ml-1">9:41</span>
            <div className="w-12 h-3.5 bg-black rounded-full"></div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/80">
              <i className="fas fa-signal"></i>
              <i className="fas fa-wifi"></i>
              <i className="fas fa-battery-three-quarters"></i>
            </div>
          </div>
          <div className={containerClasses} style={styles.bgStyle ? { backgroundImage: styles.bgStyle } : undefined}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
