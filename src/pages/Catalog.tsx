import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { getItem } from '../db';
import type { Item } from '../types';
import TechCard from '../components/TechCard';

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const idsParam = searchParams.get('ids') ?? '';
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    const ids = idsParam.split(',').filter(Boolean);
    Promise.all(ids.map((id) => getItem(id))).then((results) =>
      setItems(results.filter((i): i is Item => Boolean(i))),
    );
  }, [idsParam]);

  useEffect(() => {
    if (items && items.length > 0 && searchParams.get('print') === '1') {
      const timer = setTimeout(() => window.print(), 300);
      return () => clearTimeout(timer);
    }
  }, [items, searchParams]);

  return (
    <div className="min-h-full bg-slate-100 px-8 py-8 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex w-[210mm] max-w-full items-center justify-between print:hidden">
        <Link to="/artikuj" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft size={16} />
          Artikuj
        </Link>
        {items && items.length > 0 && (
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Printer size={14} />
            Printo Katalogun (PDF)
          </button>
        )}
      </div>

      {items === null ? (
        <p className="text-sm text-slate-400">Duke ngarkuar...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">Nuk u gjet asnjë artikull i përzgjedhur.</p>
      ) : (
        <div className="mx-auto flex w-[210mm] max-w-full flex-col gap-8 print:gap-0">
          {items.map((item, i) => (
            <div key={item.id} className={i < items.length - 1 ? 'break-after-page' : ''}>
              <TechCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
