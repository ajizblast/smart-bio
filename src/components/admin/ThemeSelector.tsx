import { useAppStore } from '../../store/useAppStore';
import { ThemeKey } from '../../types/database';
import { THEME_OPTIONS } from '../../utils/themeStyles';
import { Palette } from 'lucide-react';
import { showToast } from '../ui/Toast';

export function ThemeSelector() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const handleSetTheme = (key: ThemeKey) => {
    setTheme(key);
    showToast('Tema visual diperbarui!', 'success');
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <span className="text-slate-400"><Palette className="w-5 h-5" /></span>
        <h3 className="font-bold text-slate-800 text-base">Kustomisasi Tema & Desain</h3>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Pilihan Palet Tema</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSetTheme(opt.key)}
              className={`border-2 rounded-xl p-3 flex flex-col gap-2 items-start text-left hover:border-indigo-400 transition-all ${
                theme === opt.key ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/20' : 'border-slate-200'
              }`}
            >
              <div
                className={`w-full h-8 rounded-md border border-slate-200 ${opt.preview}`}
                style={opt.bgImage ? { backgroundImage: `url('${opt.bgImage}')` } : undefined}
              ></div>
              <span className="text-xs font-bold text-slate-700">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
