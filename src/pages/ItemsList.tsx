import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Search,
  PackagePlus,
  Boxes,
  Trash2,
  LayoutGrid,
  List,
  Eye,
  Printer,
  Copy,
  Check,
  Minus,
  BookImage,
  Tags,
  Users,
  X,
} from 'lucide-react';
import { deleteItem, getAllItems, saveItem } from '../db';
import type { Item } from '../types';
import ItemThumb from '../components/ItemThumb';
import PreviewModal from '../components/PreviewModal';
import ColorSwatch from '../components/ColorSwatch';
import TechCard from '../components/TechCard';
import FilterSelect from '../components/FilterSelect';

type ViewMode = 'grid' | 'list';
const VIEW_MODE_KEY = 'artikuj-view-mode';

export default function ItemsList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterKategoria, setFilterKategoria] = useState('');
  const [filterGjinia, setFilterGjinia] = useState('');
  const [previewItem, setPreviewItem] = useState<Item | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem(VIEW_MODE_KEY) as ViewMode) || 'grid',
  );
  const [exportItems, setExportItems] = useState<Item[]>([]);
  const [exporting, setExporting] = useState(false);
  const exportContainerRef = useRef<HTMLDivElement>(null);

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

  function toggleSelect(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handlePrintSelected() {
    const ids = Array.from(selected).join(',');
    window.open(`${import.meta.env.BASE_URL}katalog?ids=${ids}&print=1`, '_blank');
  }

  function handleCreatePdf() {
    const toExport = items.filter((i) => selected.has(i.id));
    if (toExport.length === 0) return;
    setExporting(true);
    setExportItems(toExport);
  }

  useEffect(() => {
    if (exportItems.length === 0) return;
    let cancelled = false;

    (async () => {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf'),
      ]);
      await new Promise((resolve) => setTimeout(resolve, 200));
      const container = exportContainerRef.current;
      if (!container) return;
      const cards = Array.from(container.querySelectorAll<HTMLElement>(':scope > div'));
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

      const margin = 12; // mm
      const maxWidth = 210 - margin * 2;
      const maxHeight = 297 - margin * 2;

      for (let i = 0; i < cards.length; i++) {
        const canvas = await html2canvas(cards[i], { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        const imgRatio = canvas.width / canvas.height;
        let renderWidth = maxWidth;
        let renderHeight = renderWidth / imgRatio;
        if (renderHeight > maxHeight) {
          renderHeight = maxHeight;
          renderWidth = renderHeight * imgRatio;
        }
        const x = (210 - renderWidth) / 2;
        const y = (297 - renderHeight) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', x, y, renderWidth, renderHeight);
      }

      if (!cancelled) {
        pdf.save('katalog.pdf');
        setExportItems([]);
        setExporting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [exportItems]);

  const kategoriOptions = Array.from(new Set(items.map((i) => i.kategoria.trim()).filter(Boolean))).sort();
  const gjiniOptions = Array.from(new Set(items.map((i) => i.gjinia.trim()).filter(Boolean))).sort();

  const filtered = items.filter((item) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.emriArtikullit.toLowerCase().includes(q) ||
      item.kodi.toLowerCase().includes(q) ||
      item.ngjyrat.some((c) => c.emri.toLowerCase().includes(q)) ||
      item.pelhura.toLowerCase().includes(q) ||
      item.kategoria.toLowerCase().includes(q) ||
      item.gjinia.toLowerCase().includes(q);
    const matchesKategoria = !filterKategoria || item.kategoria === filterKategoria;
    const matchesGjinia = !filterGjinia || item.gjinia === filterGjinia;
    return matchesQuery && matchesKategoria && matchesGjinia;
  });

  const allSelected = filtered.length > 0 && filtered.every((item) => selected.has(item.id));
  const someSelected = filtered.some((item) => selected.has(item.id));

  function toggleSelectAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        filtered.forEach((item) => next.delete(item.id));
      } else {
        filtered.forEach((item) => next.add(item.id));
      }
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-8 pb-28">
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

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <Search size={16} className="text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kërko sipas emrit, kodit, kategorisë, gjinisë, ngjyrës ose pëlhurës..."
          className="w-full text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterSelect
          icon={<Tags size={14} />}
          value={filterKategoria}
          onChange={setFilterKategoria}
          allLabel="Të gjitha Kategoritë"
          options={kategoriOptions}
        />
        <FilterSelect
          icon={<Users size={14} />}
          value={filterGjinia}
          onChange={setFilterGjinia}
          allLabel="Të gjitha Gjinitë"
          options={gjiniOptions}
        />
        {(filterKategoria || filterGjinia) && (
          <button
            onClick={() => {
              setFilterKategoria('');
              setFilterGjinia('');
            }}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            <X size={13} />
            Pastro filtrat
          </button>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <div
          onClick={toggleSelectAll}
          className="mb-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <SelectCircle
            checked={allSelected}
            indeterminate={!allSelected && someSelected}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSelectAll();
            }}
          />
          Zgjidh të gjitha ({filtered.length})
        </div>
      )}

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
              <div className="relative aspect-[4/3] bg-slate-50">
                <ItemThumb blob={item.imazhi} alt={item.emriArtikullit} />
                <SelectCircle
                  checked={selected.has(item.id)}
                  onClick={(e) => toggleSelect(e, item.id)}
                  className="absolute left-2 top-2 bg-white/80 backdrop-blur-sm"
                />
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
              <SelectCircle checked={selected.has(item.id)} onClick={(e) => toggleSelect(e, item.id)} />
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

      {selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-6 pb-6">
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
            <span className="text-sm font-medium text-slate-700">
              {selected.size} {selected.size === 1 ? 'artikull i përzgjedhur' : 'artikuj të përzgjedhur'}
            </span>
            <button
              onClick={() => setSelected(new Set())}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
            >
              <X size={14} />
              Pastro
            </button>
            {selected.size > 1 && (
              <button
                onClick={handlePrintSelected}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Printer size={16} />
                Printo
              </button>
            )}
            <button
              onClick={handleCreatePdf}
              disabled={exporting}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <BookImage size={16} />
              {exporting ? 'Duke krijuar PDF-në...' : 'Krijo Katalog PDF'}
            </button>
          </div>
        </div>
      )}

      {/* Off-screen render used to capture each card as an image for the PDF export */}
      <div
        ref={exportContainerRef}
        style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {exportItems.map((item) => (
          <div key={item.id}>
            <TechCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectCircle({
  checked,
  indeterminate = false,
  onClick,
  className = '',
}: {
  checked: boolean;
  indeterminate?: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}) {
  const filled = checked || indeterminate;
  return (
    <button
      type="button"
      onClick={onClick}
      title={filled ? 'Hiq nga përzgjedhja' : 'Zgjidh për katalog'}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        filled
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-slate-300 bg-white text-transparent hover:border-blue-400'
      } ${className}`}
    >
      {indeterminate ? <Minus size={14} strokeWidth={3} /> : <Check size={14} strokeWidth={3} />}
    </button>
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
          <ColorSwatch
            key={color.id}
            hex={color.hex}
            size={12}
            borderColor="#fff"
            className="ring-1 ring-slate-200"
          />
        ))}
      </div>
      <span className="truncate text-xs text-slate-500">
        {item.ngjyrat.map((c) => c.emri).filter(Boolean).join(', ') || '—'}
      </span>
    </div>
  );
}
