import { Plus, X } from 'lucide-react';
import { makeId, type SizeTable } from '../types';

export default function SizeTableEditor({
  table,
  onChange,
}: {
  table: SizeTable;
  onChange: (table: SizeTable) => void;
}) {
  function addColumn() {
    const col = { id: makeId(), label: '' };
    onChange({
      columns: [...table.columns, col],
      rows: table.rows.map((row) => ({ ...row, values: { ...row.values, [col.id]: '' } })),
    });
  }

  function removeColumn(colId: string) {
    onChange({
      columns: table.columns.filter((c) => c.id !== colId),
      rows: table.rows.map((row) => {
        const values = { ...row.values };
        delete values[colId];
        return { ...row, values };
      }),
    });
  }

  function renameColumn(colId: string, label: string) {
    onChange({
      ...table,
      columns: table.columns.map((c) => (c.id === colId ? { ...c, label } : c)),
    });
  }

  function addRow() {
    const row = {
      id: makeId(),
      label: '',
      values: Object.fromEntries(table.columns.map((c) => [c.id, ''])),
    };
    onChange({ ...table, rows: [...table.rows, row] });
  }

  function removeRow(rowId: string) {
    onChange({ ...table, rows: table.rows.filter((r) => r.id !== rowId) });
  }

  function renameRow(rowId: string, label: string) {
    onChange({
      ...table,
      rows: table.rows.map((r) => (r.id === rowId ? { ...r, label } : r)),
    });
  }

  function setValue(rowId: string, colId: string, value: string) {
    onChange({
      ...table,
      rows: table.rows.map((r) =>
        r.id === rowId ? { ...r, values: { ...r.values, [colId]: value } } : r,
      ),
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="text-xs font-semibold text-slate-500">
            <th className="px-2 py-2">Masa</th>
            {table.columns.map((col) => (
              <th key={col.id} className="px-2 py-2">
                <div className="flex items-center gap-1">
                  <input
                    value={col.label}
                    onChange={(e) => renameColumn(col.id, e.target.value)}
                    placeholder="Emërtimi"
                    className="w-28 rounded border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 outline-none focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeColumn(col.id)}
                    className="rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500"
                    title="Fshi kolonën"
                  >
                    <X size={13} />
                  </button>
                </div>
              </th>
            ))}
            <th className="px-2 py-2">
              <button
                type="button"
                onClick={addColumn}
                className="flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600"
              >
                <Plus size={13} />
                Kolonë
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-100">
              <td className="px-2 py-1.5">
                <input
                  value={row.label}
                  onChange={(e) => renameRow(row.id, e.target.value)}
                  placeholder="Masa"
                  className="w-16 rounded border border-slate-200 px-2 py-1.5 text-sm font-semibold text-blue-600 outline-none focus:border-blue-400"
                />
              </td>
              {table.columns.map((col) => (
                <td key={col.id} className="px-2 py-1.5">
                  <input
                    value={row.values[col.id] ?? ''}
                    onChange={(e) => setValue(row.id, col.id, e.target.value)}
                    className="w-20 rounded border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400"
                  />
                </td>
              ))}
              <td className="px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="rounded p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500"
                  title="Fshi rreshtin"
                >
                  <X size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600"
      >
        <Plus size={13} />
        Shto Rresht
      </button>
    </div>
  );
}
