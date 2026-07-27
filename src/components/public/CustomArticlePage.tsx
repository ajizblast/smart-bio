import { CustomPage } from '../../types/database';
import { ThemeStyles } from '../../types/database';
import { ArrowLeft } from 'lucide-react';

interface CustomArticlePageProps {
  page: CustomPage;
  onBack: () => void;
  themeStyles: ThemeStyles;
  isPreview?: boolean;
}

export function CustomArticlePage({ page, onBack, themeStyles, isPreview = false }: CustomArticlePageProps) {
  const isLightBg = themeStyles.bg.includes('text-slate-900') || themeStyles.bg.includes('text-slate-800');
  const textColor = isLightBg ? 'text-slate-800' : 'text-white';
  const divider = isLightBg ? 'border-t border-slate-300' : 'border-t border-white/10';

  return (
    <div className={`w-full h-full flex flex-col items-stretch text-left animate-fade-in overflow-y-auto rounded-[2.5rem] ${textColor}`}>
      <div className={`relative ${isPreview ? 'h-32' : 'h-40'} w-full shrink-0`}>
        <img src={page.customImg || ''} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition-all text-white"
        >
          <ArrowLeft className="w-3 h-3" />
        </button>
      </div>
      <div className={`${isPreview ? 'p-4' : 'p-5'} flex-grow flex flex-col gap-3`}>
        <h3 className={`${isPreview ? 'text-base' : 'text-lg'} font-extrabold tracking-tight`}>{page.title}</h3>
        <p className={`${isPreview ? 'text-[11px]' : 'text-xs'} opacity-90 leading-relaxed break-words whitespace-pre-wrap`}>
          {page.customText || 'Belum ada deskripsi konten.'}
        </p>
      </div>
      <div className={`${isPreview ? 'p-4' : 'p-5'} ${divider} text-center text-[9px] font-bold opacity-60 tracking-widest uppercase`}>
        Terima Kasih Atas Kunjungan Anda
      </div>
    </div>
  );
}
