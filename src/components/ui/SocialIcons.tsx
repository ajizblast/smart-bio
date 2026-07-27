import { Socials } from '../../types/database';
import { ThemeStyles } from '../../types/database';
import { useAppStore } from '../../store/useAppStore';

interface SocialIconsProps {
  themeStyles: ThemeStyles;
}

function formatWhatsAppUrl(phone: string): string {
  let digits = phone.trim().replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.substring(1);
  else if (digits.startsWith('62')) digits = digits.substring(2);
  return 'https://wa.me/62' + digits;
}

export function SocialIcons({ themeStyles }: SocialIconsProps) {
  const socials = useAppStore((s) => s.profile.socials);
  const theme = useAppStore((s) => s.theme);

  const isLightBg = themeStyles.bg.includes('text-slate-900') || themeStyles.bg.includes('text-slate-800');
  const defaultBtnClass = isLightBg
    ? 'w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center transition-all border border-slate-200 text-slate-800 hover:scale-110 shadow-sm'
    : 'w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all border border-white/10 text-white hover:scale-110 shadow-md';

  const btnClass =
    theme === 'minimalist-border'
      ? 'w-10 h-10 rounded-full bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 font-bold'
      : defaultBtnClass;

  const socialItems: { key: keyof Socials; icon: string; getHref: (val: string) => string }[] = [
    { key: 'instagram', icon: 'fab fa-instagram', getHref: (v) => v },
    { key: 'tiktok', icon: 'fab fa-tiktok', getHref: (v) => v },
    { key: 'threads', icon: 'fab fa-threads', getHref: (v) => v },
    { key: 'facebook', icon: 'fab fa-facebook', getHref: (v) => v },
    { key: 'youtube', icon: 'fab fa-youtube', getHref: (v) => v },
    { key: 'whatsapp', icon: 'fab fa-whatsapp', getHref: (v) => formatWhatsAppUrl(v) },
  ];

  const activeSocials = socialItems.filter((item) => {
    const val = socials[item.key];
    return val && val.trim() !== '';
  });

  if (activeSocials.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-3.5 mt-4">
      {activeSocials.map((item) => (
        <a
          key={item.key}
          href={item.getHref(socials[item.key])}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
        >
          <i className={`${item.icon} text-lg`}></i>
        </a>
      ))}
    </div>
  );
}
