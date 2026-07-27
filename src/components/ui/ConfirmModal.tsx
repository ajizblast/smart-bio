import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmState {
  text: string;
  visible: boolean;
  onProceed: (() => void) | null;
}

let globalShowConfirm: ((text: string, onProceed: () => void) => void) | null = null;

export function showConfirm(text: string, onProceed: () => void) {
  globalShowConfirm?.(text, onProceed);
}

export function ConfirmModal() {
  const [state, setState] = useState<ConfirmState>({ text: '', visible: false, onProceed: null });

  const show = useCallback((text: string, onProceed: () => void) => {
    setState({ text, visible: true, onProceed });
  }, []);

  useEffect(() => {
    globalShowConfirm = show;
    return () => { globalShowConfirm = null; };
  }, [show]);

  const close = () => setState({ ...state, visible: false, onProceed: null });

  const handleProceed = () => {
    state.onProceed?.();
    close();
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 ${
        state.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden p-6 space-y-4 transition-transform duration-300 ${
          state.visible ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="flex items-center gap-3 text-amber-500">
          <AlertTriangle className="w-6 h-6" />
          <h4 className="font-bold text-slate-800 text-base">Konfirmasi Tindakan</h4>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{state.text}</p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={close}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleProceed}
            className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
