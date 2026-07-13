import { ImageOff } from 'lucide-react';
import type { Item } from '../types';
import { useObjectUrl } from '../hooks/useObjectUrl';

export function formatDate(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

export default function TechCard({ item }: { item: Item }) {
  const imageUrl = useObjectUrl(item.imazhi);
  const sketchUrl = useObjectUrl(item.skicaTeknike);

  return (
    <div className="mx-auto box-border w-[210mm] min-h-[297mm] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm print:m-0 print:w-full print:min-h-0 print:rounded-none print:border-0 print:shadow-none">
      {/* Header */}
      <div className="flex items-start justify-between bg-slate-50 px-8 py-6 print:bg-white">
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

          <p className="text-[11px] font-semibold tracking-wide text-slate-400">NGJYRAT</p>
          <div className="mb-3 space-y-1">
            {item.ngjyrat.length === 0 ? (
              <span className="text-sm text-slate-800">—</span>
            ) : (
              item.ngjyrat.map((color) => (
                <div key={color.id} className="flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full border border-slate-200"
                    style={{ backgroundColor: color.hex || '#e5e7eb' }}
                  />
                  <span className="text-sm text-slate-800">{color.emri || '—'}</span>
                </div>
              ))
            )}
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
              <tr className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 print:bg-white">
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
  );
}
