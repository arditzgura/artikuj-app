import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PackagePlus, Boxes, Trash2 } from 'lucide-react';
import { deleteItem, getAllItems } from '../db';
import type { Item } from '../types';
import ItemThumb from '../components/ItemThumb';

export default function ItemsList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  function load() {
    setLoading(true);
    getAllItems()
      .then((data) =>
        setItems(
          data.sort((a, b) => b.perditesuarNe.localeCompare(a.perditesuarNe)),
        ),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('A je i sigurt që dëshiron ta fshish këtë artikull?')) return;
    await deleteItem(id);
    load();
  }

  const filtered = items.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.emriArtikullit.toLowerCase().includes(q) ||
      item.kodi.toLowerCase().includes(q) ||
      item.ngjyra.toLowerCase().includes(q) ||
      item.pelhura.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Artikuj</h1>
          <p className="text-sm text-slate-500">
            Të gjithë artikujt e ruajtur me kartat përkatëse
          </p>
        </div>
        <Link
          to="/artikuj/ri"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PackagePlus size={16} />
          Artikull i Ri
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <Search size={16} className="text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kërko sipas emrit, kodit, ngjyrës ose pëlhurës..."
          className="w-full text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Duke ngarkuar...</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <Boxes size={32} className="text-slate-300" />
          <p className="text-sm text-slate-500">
            {items.length === 0 ? 'Nuk ka ende artikuj të ruajtur.' : 'Asnjë artikull nuk përputhet me kërkimin.'}
          </p>
          {items.length === 0 && (
            <Link to="/artikuj/ri" className="text-sm font-medium text-blue-600 hover:underline">
              Shto artikullin e parë
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <Link
              key={item.id}
              to={`/artikuj/${item.id}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
            >
              <div className="aspect-[4/3] bg-slate-50">
                <ItemThumb blob={item.imazhi} alt={item.emriArtikullit} />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-slate-800">
                    {item.emriArtikullit || 'Pa emër'}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500"
                    title="Fshi"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <span className="font-mono text-[11px] text-slate-400">{item.kodi}</span>
                <div className="mt-1 flex items-center gap-2">
                  {item.ngjyraHex && (
                    <span
                      className="h-3 w-3 rounded-full border border-slate-200"
                      style={{ backgroundColor: item.ngjyraHex }}
                    />
                  )}
                  <span className="truncate text-xs text-slate-500">{item.ngjyra || '—'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
