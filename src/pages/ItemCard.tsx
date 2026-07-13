import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, ImageOff } from 'lucide-react';
import { deleteItem, getItem } from '../db';
import type { Item } from '../types';
import { useObjectUrl } from '../hooks/useObjectUrl';

function formatDate(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

export default function ItemCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    getItem(id).then((data) => setItem(data ?? null));
  }, [id]);

  const imageUrl = useObjectUrl(item?.imazhi ?? undefined);
  const sketchUrl = useObjectUrl(item?.skicaTeknike ?? undefined);

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
    <div className="mx-auto max-w-5xl px-8 py-8">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/artikuj" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft size={16} />
          Artikuj
        </Link>
        <div className="flex items-center gap-2">
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

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between bg-slate-50 px-8 py-6">
          <div>
            <p className="font-mono text-xs tracking-wide text-slate-400">FABRIKA E PRODHIMIT</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Karta Teknologjike e Artikullit</h1>
          </div>
          <div className="text-right font-mono text-xs text-slate-500">
            <p>
              Kodi: <span className="font-semibold text-slate-800">{item.kodi}</span>
            </p>
            <p>
              Data: <span className="font-semibold text-slate-800">{formatDate(item.data)}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 border-t border-slate-100 p-8 md:grid-cols-3">
          {/* Të dhëna kryesore */}
          <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50/30 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-slate-400">TË DHËNA KRYESORE</p>

            <p className="text-[11px] font-semibold tracking-wide text-slate-400">EMRI I ARTIKULLIT</p>
            <p className="mb-3 text-sm font-semibold text-slate-900">{item.emriArtikullit || '—'}</p>

            <p className="text-[11px] font-semibold tracking-wide text-slate-400">NGJYRA</p>
            <div className="mb-3 flex items-center gap-2">
              <span
                className="h-3.5 w-3.5 rounded-full border border-slate-200"
                style={{ backgroundColor: item.ngjyraHex || '#e5e7eb' }}
              />
              <span className="text-sm text-slate-800">{item.ngjyra || '—'}</span>
            </div>

            <p className="text-[11px] font-semibold tracking-wide text-slate-400">PËLHURA</p>
            <p className="text-sm text-slate-800">{item.pelhura || '—'}</p>
          </div>

          {/* Imazhi */}
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-slate-400">IMAZHI I ARTIKULLIT</p>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-slate-50">
              {imageUrl ? (
                <img src={imageUrl} alt={item.emriArtikullit} className="h-full w-full object-contain" />
              ) : (
                <ImageOff size={28} className="text-slate-300" />
              )}
            </div>
          </div>

          {/* Skica teknike */}
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-slate-400">SKICA TEKNIKE</p>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-slate-50">
              {sketchUrl ? (
                <img src={sketchUrl} alt="Skica teknike" className="h-full w-full object-contain" />
              ) : (
                <ImageOff size={28} className="text-slate-300" />
              )}
            </div>
          </div>
        </div>

        {/* Tabela e masave */}
        <div className="border-t border-slate-100 px-8 py-6">
          <p className="mb-3 text-xs font-semibold tracking-wide text-slate-400">TABELA E MASAVE (CM)</p>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500">
                  <th className="px-4 py-2.5">Pjesa</th>
                  {item.tabelaMasave.columns.map((col) => (
                    <th key={col.id} className="px-4 py-2.5 font-semibold text-blue-600">
                      {col.label || '—'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.tabelaMasave.rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-4 py-2.5 font-semibold text-slate-700">{row.label || '—'}</td>
                    {item.tabelaMasave.columns.map((col) => (
                      <td key={col.id} className="px-4 py-2.5 text-slate-700">
                        {row.values[col.id] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Tolerancë: {item.toleranca || '± 1 cm, përveç rasteve të specifikuara ndryshe.'}
          </p>
        </div>
      </div>
    </div>
  );
}
