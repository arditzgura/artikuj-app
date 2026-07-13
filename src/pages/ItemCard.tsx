import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Printer } from 'lucide-react';
import { deleteItem, getItem } from '../db';
import type { Item } from '../types';
import TechCard from '../components/TechCard';

export default function ItemCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [item, setItem] = useState<Item | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    getItem(id).then((data) => setItem(data ?? null));
  }, [id]);

  useEffect(() => {
    if (item && searchParams.get('print') === '1') {
      const timer = setTimeout(() => window.print(), 200);
      return () => clearTimeout(timer);
    }
  }, [item, searchParams]);

  async function handleDelete() {
    if (!id) return;
    if (!confirm('A je i sigurt që dëshiron ta fshish këtë artikull?')) return;
    await deleteItem(id);
    navigate('/artikuj');
  }

  if (item === undefined) {
    return <div className="px-8 py-8 text-sm text-slate-400">Duke ngarkuar...</div>;
  }

  if (item === null) {
    return (
      <div className="px-8 py-8">
        <p className="text-sm text-slate-500">Artikulli nuk u gjet.</p>
        <Link to="/artikuj" className="text-sm font-medium text-blue-600 hover:underline">
          Kthehu te artikujt
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full overflow-x-auto bg-slate-100 px-8 py-8 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex w-[210mm] max-w-full items-center justify-between print:hidden">
        <Link to="/artikuj" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft size={16} />
          Artikuj
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Printer size={14} />
            Printo (PDF)
          </button>
          <Link
            to={`/artikuj/${item.id}/edit`}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Pencil size={14} />
            Ndrysho
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} />
            Fshi
          </button>
        </div>
      </div>

      <TechCard item={item} />
    </div>
  );
}
