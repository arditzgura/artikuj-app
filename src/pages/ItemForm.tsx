import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, ImageOff, Plus, Save, Upload, X } from 'lucide-react';
import { getAllItems, getItem, saveItem } from '../db';
import { defaultSizeTable, emptyColorEntry, type ColorEntry, type Item, type SizeTable } from '../types';
import { useObjectUrl } from '../hooks/useObjectUrl';
import SizeTableEditor from '../components/SizeTableEditor';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function ItemForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [kodi, setKodi] = useState('');
  const [data, setData] = useState(todayIso());
  const [emriArtikullit, setEmriArtikullit] = useState('');
  const [ngjyrat, setNgjyrat] = useState<ColorEntry[]>([emptyColorEntry()]);
  const [pelhura, setPelhura] = useState('');
  const [pelhuraSuggestions, setPelhuraSuggestions] = useState<string[]>([]);
  const [imazhi, setImazhi] = useState<Blob | undefined>(undefined);
  const [skicaTeknike, setSkicaTeknike] = useState<Blob | undefined>(undefined);
  const [tabelaMasave, setTabelaMasave] = useState<SizeTable>(defaultSizeTable());
  const [toleranca, setToleranca] = useState('± 1 cm, përveç rasteve të specifikuara ndryshe.');
  const [krijuarNe, setKrijuarNe] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const imageUrl = useObjectUrl(imazhi);
  const sketchUrl = useObjectUrl(skicaTeknike);

  useEffect(() => {
    getAllItems().then((items) => {
      const fabrics = new Set(items.map((i) => i.pelhura.trim()).filter(Boolean));
      setPelhuraSuggestions(Array.from(fabrics).sort());

      if (!isEdit) {
        setKodi(`ART-${String(items.length + 1).padStart(4, '0')}`);
      }
    });

    if (isEdit && id) {
      getItem(id).then((item) => {
        if (item) {
          setKodi(item.kodi);
          setData(item.data);
          setEmriArtikullit(item.emriArtikullit);
          setNgjyrat(item.ngjyrat.length ? item.ngjyrat : [emptyColorEntry()]);
          setPelhura(item.pelhura);
          setImazhi(item.imazhi);
          setSkicaTeknike(item.skicaTeknike);
          setTabelaMasave(item.tabelaMasave);
          setToleranca(item.toleranca);
          setKrijuarNe(item.krijuarNe);
        }
        setLoading(false);
      });
    }
  }, [isEdit, id]);

  function addColor() {
    setNgjyrat((colors) => [...colors, emptyColorEntry()]);
  }

  function removeColor(colorId: string) {
    setNgjyrat((colors) => colors.filter((c) => c.id !== colorId));
  }

  function updateColor(colorId: string, patch: Partial<ColorEntry>) {
    setNgjyrat((colors) => colors.map((c) => (c.id === colorId ? { ...c, ...patch } : c)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const now = new Date().toISOString();
    const item: Item = {
      id: id ?? uuidv4(),
      kodi,
      data,
      emriArtikullit,
      ngjyrat,
      pelhura,
      imazhi,
      skicaTeknike,
      tabelaMasave,
      toleranca,
      krijuarNe: krijuarNe || now,
      perditesuarNe: now,
    };
    await saveItem(item);
    setSaving(false);
    navigate(`/artikuj/${item.id}`);
  }

  if (loading) {
    return <div className="px-8 py-8 text-sm text-slate-400">Duke ngarkuar...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <Link
        to={isEdit && id ? `/artikuj/${id}` : '/artikuj'}
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} />
        Anulo
      </Link>

      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        {isEdit ? 'Ndrysho Artikullin' : 'Artikull i Ri'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
          <Field label="Kodi">
            <input
              value={kodi}
              onChange={(e) => setKodi(e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="Data">
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="Emri i Artikullit" full>
            <input
              value={emriArtikullit}
              onChange={(e) => setEmriArtikullit(e.target.value)}
              className="input"
              placeholder="p.sh. Këmishë Oxford Slim Fit"
              required
            />
          </Field>
          <Field label="Ngjyrat" full>
            <div className="space-y-2">
              {ngjyrat.map((color) => (
                <div key={color.id} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(color.id, { hex: e.target.value })}
                    className="h-10 w-12 shrink-0 cursor-pointer rounded border border-slate-200"
                  />
                  <input
                    value={color.emri}
                    onChange={(e) => updateColor(color.id, { emri: e.target.value })}
                    className="input"
                    placeholder="p.sh. Blu Marino"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(color.id)}
                    className="shrink-0 rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500"
                    title="Fshi ngjyrën"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addColor}
                className="flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600"
              >
                <Plus size={13} />
                Shto Ngjyrë
              </button>
            </div>
          </Field>
          <Field label="Pëlhura" full>
            <input
              value={pelhura}
              onChange={(e) => setPelhura(e.target.value)}
              className="input"
              placeholder="p.sh. 100% Pambuk, Oxford 130 g/m²"
              list="pelhura-suggestions"
            />
            <datalist id="pelhura-suggestions">
              {pelhuraSuggestions.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ImageField
            label="Imazhi i Artikullit"
            url={imageUrl}
            onChange={setImazhi}
          />
          <ImageField
            label="Skica Teknike"
            url={sketchUrl}
            onChange={setSkicaTeknike}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Tabela e Masave (cm)
          </p>
          <SizeTableEditor table={tabelaMasave} onChange={setTabelaMasave} />

          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Tolerancë
            </label>
            <input
              value={toleranca}
              onChange={(e) => setToleranca(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link
            to={isEdit && id ? `/artikuj/${id}` : '/artikuj'}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Anulo
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? 'Duke ruajtur...' : 'Ruaj Artikullin'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function ImageField({
  label,
  url,
  onChange,
}: {
  label: string;
  url: string | null;
  onChange: (blob: Blob | undefined) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </label>
      <label className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-md bg-slate-50">
        {url ? (
          <img src={url} alt={label} className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-blue-400">
            <ImageOff size={28} />
            <span className="text-xs font-medium">Kliko për të ngarkuar</span>
          </div>
        )}
        {url && (
          <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/40 text-xs font-medium text-white group-hover:flex">
            <Upload size={14} />
            Ndrysho imazhin
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);
          }}
        />
      </label>
      {url && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
        >
          Hiq imazhin
        </button>
      )}
    </div>
  );
}
