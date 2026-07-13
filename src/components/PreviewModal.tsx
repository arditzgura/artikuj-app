import { X, Pencil, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../types';
import TechCard from './TechCard';

export default function PreviewModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-6 print:hidden"
      onClick={onClose}
    >
      <div
        className="w-[210mm] max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-end gap-2">
          <button
            onClick={() => navigate(`/artikuj/${item.id}?print=1`)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Printer size={14} />
            Printo (PDF)
          </button>
          <button
            onClick={() => navigate(`/artikuj/${item.id}/edit`)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Pencil size={14} />
            Ndrysho
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <X size={14} />
            Mbyll
          </button>
        </div>
        <TechCard item={item} />
      </div>
    </div>
  );
}
