import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Search, PackagePlus, Boxes, Trash2, LayoutGrid, List, Eye, Printer, Copy } from 'lucide-react';
import { deleteItem, getAllItems, saveItem } from '../db';
import type { Item } from '../types';
import ItemThumb from '../components/ItemThumb';
import PreviewModal from '../components/PreviewModal';

type ViewMode = 'grid' | 'list';
const VIEW_MODE_KEY = 'artikuj-view-mode';

export default function ItemsList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [previewItem, setPreviewItem] = useState<Item | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem(VIEW_MODE_KEY) as ViewMode) || 'grid',
  );

  function changeViewMode(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  }

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

  function handlePreview(e: React.MouseEvent, item: Item) {
    e.preventDefault();
    e.stopPropagation();
    setPreviewItem(item);
  }

  function handlePrint(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    window.open(`${import.meta.env.BASE_URL}artikuj/${id}?print=1`, '_blank');
  }

  async function handleDuplicate(e: React.MouseEvent, item: Item) {
    e.preventDefault();
    e.stopPropagation();
    const now = new Date().toISOString();
    const clone = structuredClone(item);
    clone.id = uuidv4();
    clone.kodi = `ART-${String(items.length + 1).padStart(4, '0')}`;
    clone.krijuarNe = now;
    clone.perditesuarNe = now;
    await saveItem(clone);
    navigate(`/artikuj/${clone.id}/edit`);
  }

  const filtered = items.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.emriArtikullit.toLowerCase().includes(q) ||
      item.kodi.toLowerCase().includes(q) ||
      item.ngjyrat.some((c) => c.emri.toLowerCase().includes(q)) ||
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
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => changeViewMode('list')}
              title="Pamja listë"
              className={`rounded-md p-1.5 ${
                viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => changeViewMode('grid')}
              title="Pamja grid"
              className={`rounded-md p-1.5 ${
                viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
          <Link
            to="/artikuj/ri"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <PackagePlus size={16} />
            Artikull i Ri
          </Link>
        </div>
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
      ) : viewMode === 'grid' ? (
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
                <span className="truncate text-sm font-semibold text-slate-800">
                  {item.emriArtikullit || 'Pa emër'}
                </span>
                <span className="font-mono text-[11px] text-slate-400">{item.kodi}</span>
                <ColorSummary item={item} />
                <RowActions
                  className="mt-2 justify-end border-t border-slate-100 pt-2"
                  onPreview={(e) => handlePreview(e, item)}
                  onPrint={(e) => handlePrint(e, item.id)}
                  onDuplicate={(e) => handleDuplicate(e, item)}
                  onDelete={(e) => handleDelete(e, item.id)}
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {filtered.map((item) => (
            <Link
              key={item.id}
              to={`/artikuj/${item.id}`}
              className="group flex items-center gap-4 px-4 py-3 hover:bg-slate-50"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                <ItemThumb blob={item.imazhi} alt={item.emriArtikullit} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-slate-800">
                    {item.emriArtikullit || 'Pa emër'}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-slate-400">{item.kodi}</span>
                </div>
                <p className="truncate text-xs text-slate-500">{item.pelhura || '—'}</p>
              </div>
              <div className="hidden shrink-0 sm:block">
                <ColorSummary item={item} />
              </div>
              <RowActions
                onPreview={(e) => handlePreview(e, item)}
                onPrint={(e) => handlePrint(e, item.id)}
                onDuplicate={(e) => handleDuplicate(e, item)}
                onDelete={(e) => handleDelete(e, item.id)}
              />
            </Link>
          ))}
        </div>
      )}

      {previewItem && <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />}
    </div>
  );
}

function RowActions({
  onPreview,
  onPrint,
  onDuplicate,
  onDelete,
  className = '',
}: {
  onPreview: (e: React.MouseEvent) => void;
  onPrint: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  className?: string;
}) {
  return (
    <div className={`flex shrink-0 items-center gap-0.5 ${className}`}>
      <button
        onClick={onPreview}
        className="rounded p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600"
        title="Preview"
      >
        <Eye size={14} />
      </button>
      <button
        onClick={onPrint}
        className="rounded p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600"
        title="Printo (PDF)"
      >
        <Printer size={14} />
      </button>
      <button
        onClick={onDuplicate}
        className="rounded p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600"
        title="Dubliko"
      >
        <Copy size={14} />
      </button>
      <button
        onClick={onDelete}
        className="rounded p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500"
        title="Fshi"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function ColorSummary({ item }: { item: Item }) {
  if (item.ngjyrat.length === 0) {
    return <span className="text-xs text-slate-400">—</span>;
  }
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <div className="flex -space-x-1">
        {item.ngjyrat.slice(0, 4).map((color) => (
          <span
            key={color.id}
            className="h-3 w-3 rounded-full border border-white ring-1 ring-slate-200"
            style={{ backgroundColor: color.hex || '#e5e7eb' }}
          />
        ))}
      </div>
      <span className="truncate text-xs text-slate-500">
        {item.ngjyrat.map((c) => c.emri).filter(Boolean).join(', ') || '—'}
      </span>
    </div>
  );
}
