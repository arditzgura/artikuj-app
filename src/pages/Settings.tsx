import { useRef, useState } from 'react';
import { Download, Upload, Settings as SettingsIcon, CheckCircle2, XCircle } from 'lucide-react';
import { exportBackup, importBackup } from '../backup';

type Status = { type: 'success' | 'error'; message: string } | null;

export default function Settings() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setStatus(null);
    setExporting(true);
    try {
      const count = await exportBackup();
      setStatus({ type: 'success', message: `U eksportuan ${count} artikuj në skedar.` });
    } catch {
      setStatus({ type: 'error', message: 'Eksportimi dështoi. Provo përsëri.' });
    } finally {
      setExporting(false);
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (
      !confirm(
        'Importimi do të shtojë/mbishkruajë artikujt nga ky skedar backup. Artikujt me të njëjtin ID do të zëvendësohen. Vazhdo?',
      )
    ) {
      return;
    }

    setStatus(null);
    setImporting(true);
    try {
      const count = await importBackup(file);
      setStatus({ type: 'success', message: `U importuan ${count} artikuj me sukses.` });
    } catch {
      setStatus({ type: 'error', message: 'Skedari nuk mund të lexohej. Sigurohu që është një backup i vlefshëm.' });
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <SettingsIcon size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Cilësimet</h1>
          <p className="text-sm text-slate-500">Menaxho të dhënat e ruajtura lokalisht</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Backup</h2>
        <p className="mb-5 text-sm text-slate-500">
          Të dhënat ruhen vetëm në këtë browser. Eksporto një kopje rezervë (backup) periodikisht për
          t'i pasur të sigurta, ose importoje për t'i rikthyer.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-4 text-left hover:bg-slate-50 disabled:opacity-60"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Download size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {exporting ? 'Duke eksportuar...' : 'Eksporto Backup'}
              </p>
              <p className="text-xs text-slate-500">Shkarko të gjithë artikujt në një skedar .json</p>
            </div>
          </button>

          <button
            onClick={handleImportClick}
            disabled={importing}
            className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-4 text-left hover:bg-slate-50 disabled:opacity-60"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Upload size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {importing ? 'Duke importuar...' : 'Importo Backup'}
              </p>
              <p className="text-xs text-slate-500">Rikthe artikujt nga një skedar backup .json</p>
            </div>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFileSelected}
        />

        {status && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {status.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
