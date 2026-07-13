export const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'] as const;
export type Size = (typeof SIZES)[number];

export interface SizeRow {
  size: Size;
  supi: string;
  gjeresiaGjoksit: string;
  mengesia: string;
  gjatesia: string;
  fundi: string;
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
  tabelaMasave: SizeRow[];
  toleranca: string;
  krijuarNe: string;
  perditesuarNe: string;
}

export function emptySizeTable(): SizeRow[] {
  return SIZES.map((size) => ({
    size,
    supi: '',
    gjeresiaGjoksit: '',
    mengesia: '',
    gjatesia: '',
    fundi: '',
  }));
}
