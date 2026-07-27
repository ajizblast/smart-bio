import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

let toastId = 0;
let globalShowToast: ((msg: string, type: ToastType) => void) | null = null;

export function showToast(message: string, type: ToastType = 'success') {
  globalShowToast?.(message, type);
}

export function Toast() {
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });

  const show = useCallback((message: string, type: ToastType) => {
    toastId++;
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  useEffect(() => {
    globalShowToast = show;
    return () => { globalShowToast = null; };
  }, [show]);

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-indigo-400" />,
  };

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] transition-all duration-300 transform ${
        toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-[-100px] opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700/50">
        {iconMap[toast.type]}
        <span className="font-medium text-sm">{toast.message}</span>
      </div>
    </div>
  );
}
