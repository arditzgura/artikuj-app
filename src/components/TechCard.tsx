import { ImageOff } from 'lucide-react';
import type { Item } from '../types';
import { useObjectUrl } from '../hooks/useObjectUrl';
import ColorSwatch from './ColorSwatch';

export function formatDate(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

function rowLetter(index: number) {
  return String.fromCharCode(65 + (index % 26));
}

function FieldBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-slate-400">{label}</p>
      {children}
    </div>
  );
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

      {/* Të dhënat kryesore */}
      <div className="grid grid-cols-1 gap-3 border-t border-slate-100 px-8 pt-6 sm:grid-cols-3">
        <FieldBox label="EMRI I ARTIKULLIT">
          <p className="text-sm font-semibold text-slate-900">{item.emriArtikullit || '—'}</p>
        </FieldBox>

        <FieldBox label="NGJYRAT">
          {item.ngjyrat.length === 0 ? (
            <span className="text-sm text-slate-800">—</span>
          ) : (
            <div className="space-y-1">
              {item.ngjyrat.map((color) => (
                <div key={color.id} className="flex items-center gap-2">
                  <ColorSwatch hex={color.hex} size={14} />
                  <span className="text-sm text-slate-800">{color.emri || '—'}</span>
                </div>
              ))}
            </div>
          )}
        </FieldBox>

        <FieldBox label="PËLHURA">
          <p className="text-sm text-slate-800">{item.pelhura || '—'}</p>
        </FieldBox>
      </div>

      {/* Pamje modeli + Skema */}
      <div className="grid grid-cols-1 gap-5 px-8 pt-6 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="mb-3 text-xs font-semibold tracking-wide text-slate-400">PAMJE MODELI</p>
          <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md bg-slate-50">
            {imageUrl ? (
              <img src={imageUrl} alt={item.emriArtikullit} className="h-full w-full object-contain" />
            ) : (
              <ImageOff size={28} className="text-slate-300" />
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <p className="mb-3 text-xs font-semibold tracking-wide text-slate-400">SKEMA</p>
          <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md bg-slate-50">
            {sketchUrl ? (
              <img src={sketchUrl} alt="Skema" className="h-full w-full object-contain" />
            ) : (
              <ImageOff size={28} className="text-slate-300" />
            )}
          </div>
        </div>
      </div>

      {/* Përmasat */}
      <div className="mt-6 px-8 pb-6">
        <div className="mb-3 rounded-md bg-slate-800 px-3 py-1.5">
          <p className="text-xs font-semibold tracking-wide text-white">PËRMASAT (CM)</p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 print:bg-white">
                <th className="w-8 px-3 py-2.5"></th>
                <th className="px-4 py-2.5">Shkallat e Masave</th>
                {item.tabelaMasave.columns.map((col) => (
                  <th key={col.id} className="px-4 py-2.5 font-semibold text-blue-600">
                    {col.label || '—'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {item.tabelaMasave.rows.map((row, i) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-3 py-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-[11px] font-semibold text-white">
                      {rowLetter(i)}
                    </span>
                  </td>
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
