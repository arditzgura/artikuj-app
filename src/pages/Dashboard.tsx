import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Palette, Ruler, PackagePlus } from 'lucide-react';
import { getAllItems } from '../db';
import type { Item } from '../types';
import ItemThumb from '../components/ItemThumb';

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllItems()
      .then((data) =>
        setItems(
          data.sort((a, b) => b.perditesuarNe.localeCompare(a.perditesuarNe)),
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const totalItems = items.length;
  const uniqueFabrics = new Set(items.map((i) => i.pelhura).filter(Boolean)).size;
  const uniqueColors = new Set(
    items.flatMap((i) => i.ngjyrat.map((c) => c.emri)).filter(Boolean),
  ).size;
  const recent = items.slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Paneli</h1>
          <p className="text-sm text-slate-500">Pamja e gjendjes së përgjithshme</p>
        </div>
        <Link
          to="/artikuj/ri"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PackagePlus size={16} />
          Artikull i Ri
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Boxes} label="Total Artikuj" value={totalItems} color="bg-blue-50 text-blue-600" />
        <StatCard icon={Ruler} label="Pëlhura të Ndryshme" value={uniqueFabrics} color="bg-emerald-50 text-emerald-600" />
        <StatCard icon={Palette} label="Ngjyra të Ndryshme" value={uniqueColors} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Artikujt e Fundit
        </h2>

        {loading ? (
          <p className="text-sm text-slate-400">Duke ngarkuar...</p>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <Boxes size={32} className="text-slate-300" />
            <p className="text-sm text-slate-500">Nuk ka ende artikuj të ruajtur.</p>
            <Link
              to="/artikuj/ri"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Shto artikullin e parë
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {recent.map((item) => (
              <Link
                key={item.id}
                to={`/artikuj/${item.id}`}
                className="group flex flex-col gap-2 rounded-lg border border-slate-100 p-2 hover:border-slate-300"
              >
                <div className="aspect-square overflow-hidden rounded-md bg-slate-50">
                  <ItemThumb blob={item.imazhi} alt={item.emriArtikullit} />
                </div>
                <div className="truncate text-xs font-medium text-slate-700 group-hover:text-blue-600">
                  {item.emriArtikullit || 'Pa emër'}
                </div>
                <div className="truncate text-[11px] text-slate-400">{item.kodi}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Boxes;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
