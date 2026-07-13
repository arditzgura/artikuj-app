export interface SizeTableColumn {
  id: string;
  label: string;
}

export interface SizeTableRow {
  id: string;
  label: string;
  values: Record<string, string>; // keyed by column id
}

export interface SizeTable {
  columns: SizeTableColumn[]; // sizes (S, M, L...), shown across the top
  rows: SizeTableRow[]; // part names (Supi, Mëngë...), shown down the side
  version: 2;
}

export interface Item {
  id: string;
  kodi: string;
  data: string;
  emriArtikullit: string;
  ngjyra: string;
  ngjyraHex: string;
  pelhura: string;
  imazhi?: Blob;
  skicaTeknike?: Blob;
  tabelaMasave: SizeTable;
  toleranca: string;
  krijuarNe: string;
  perditesuarNe: string;
}

const DEFAULT_PART_LABELS = ['Supi', 'Gjerësia e gjoksit', 'Mëngë', 'Gjatësia', 'Fundi (poshtë)'];
const DEFAULT_SIZE_LABELS = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function defaultSizeTable(): SizeTable {
  const columns = DEFAULT_SIZE_LABELS.map((label) => ({ id: makeId(), label }));
  const rows = DEFAULT_PART_LABELS.map((label) => ({
    id: makeId(),
    label,
    values: Object.fromEntries(columns.map((c) => [c.id, ''])),
  }));
  return { columns, rows, version: 2 };
}

function transposeTable(table: { columns: SizeTableColumn[]; rows: SizeTableRow[] }): SizeTable {
  const newColumns = table.rows.map((r) => ({ id: makeId(), label: r.label }));
  const newRows = table.columns.map((c) => ({
    id: makeId(),
    label: c.label,
    values: Object.fromEntries(
      table.rows.map((r, i) => [newColumns[i].id, r.values[c.id] ?? '']),
    ),
  }));
  return { columns: newColumns, rows: newRows, version: 2 };
}

// v0: fixed array of rows with hardcoded field keys (supi, gjeresiaGjoksit, ...),
//     size as the row label — e.g. [{ size: 'S', supi: '43', ... }].
// v1: dynamic { columns, rows } but with parts as columns and sizes as rows
//     (no `version` marker).
// v2 (current): dynamic { columns, rows, version: 2 } with sizes as columns
//     and parts as rows.
const LEGACY_COLUMN_KEYS = ['supi', 'gjeresiaGjoksit', 'mengesia', 'gjatesia', 'fundi'] as const;

function migrateSizeTable(raw: unknown): SizeTable {
  if (raw && typeof raw === 'object' && (raw as SizeTable).version === 2) {
    return raw as SizeTable;
  }
  if (raw && typeof raw === 'object' && 'columns' in raw && 'rows' in raw) {
    return transposeTable(raw as { columns: SizeTableColumn[]; rows: SizeTableRow[] });
  }
  if (Array.isArray(raw)) {
    const legacyColumns = DEFAULT_PART_LABELS.map((label, i) => ({
      id: LEGACY_COLUMN_KEYS[i],
      label,
    }));
    const legacyRows = raw.map((legacyRow) => ({
      id: makeId(),
      label: legacyRow.size ?? '',
      values: Object.fromEntries(
        LEGACY_COLUMN_KEYS.map((key) => [key, legacyRow[key] ?? '']),
      ),
    }));
    return transposeTable({ columns: legacyColumns, rows: legacyRows });
  }
  return defaultSizeTable();
}

export function normalizeItem(raw: Item): Item {
  return { ...raw, tabelaMasave: migrateSizeTable(raw.tabelaMasave) };
}
