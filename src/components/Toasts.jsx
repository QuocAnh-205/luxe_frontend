import { CheckCircle2, XCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="animate-fade-up flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm text-white shadow-2xl"
        >
          {t.type === 'error' ? <XCircle size={18} className="text-red-400" /> : <CheckCircle2 size={18} className="text-gold-light" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}
