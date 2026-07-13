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
  columns: SizeTableColumn[];
  rows: SizeTableRow[];
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

const DEFAULT_COLUMN_LABELS = ['Supi', 'Gjerësia e gjoksit', 'Mëngë', 'Gjatësia', 'Fundi (poshtë)'];
const DEFAULT_ROW_LABELS = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function defaultSizeTable(): SizeTable {
  const columns = DEFAULT_COLUMN_LABELS.map((label) => ({ id: makeId(), label }));
  const rows = DEFAULT_ROW_LABELS.map((label) => ({
    id: makeId(),
    label,
    values: Object.fromEntries(columns.map((c) => [c.id, ''])),
  }));
  return { columns, rows };
}

// Older versions stored tabelaMasave as a fixed array of rows with hardcoded
// field keys (supi, gjeresiaGjoksit, mengesia, gjatesia, fundi, size). Convert
// those into the dynamic { columns, rows } shape so old saved items keep working.
const LEGACY_COLUMN_KEYS = ['supi', 'gjeresiaGjoksit', 'mengesia', 'gjatesia', 'fundi'] as const;

function migrateSizeTable(raw: unknown): SizeTable {
  if (raw && typeof raw === 'object' && 'columns' in raw && 'rows' in raw) {
    return raw as SizeTable;
  }
  if (Array.isArray(raw)) {
    const columns = DEFAULT_COLUMN_LABELS.map((label, i) => ({
      id: LEGACY_COLUMN_KEYS[i],
      label,
    }));
    const rows = raw.map((legacyRow) => ({
      id: makeId(),
      label: legacyRow.size ?? '',
      values: Object.fromEntries(
        LEGACY_COLUMN_KEYS.map((key) => [key, legacyRow[key] ?? '']),
      ),
    }));
    return { columns, rows };
  }
  return defaultSizeTable();
}

export function normalizeItem(raw: Item): Item {
  return { ...raw, tabelaMasave: migrateSizeTable(raw.tabelaMasave) };
}
