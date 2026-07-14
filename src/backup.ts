import { getAllItems, saveItem } from './db';
import { normalizeItem, type Item } from './types';

const BACKUP_VERSION = 1;

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

type SerializedItem = Omit<Item, 'imazhi' | 'skicaTeknike'> & {
  imazhi?: string;
  skicaTeknike?: string;
};

export async function exportBackup(): Promise<number> {
  const items = await getAllItems();
  const serialized: SerializedItem[] = await Promise.all(
    items.map(async (item) => ({
      ...item,
      imazhi: item.imazhi ? await blobToDataUrl(item.imazhi) : undefined,
      skicaTeknike: item.skicaTeknike ? await blobToDataUrl(item.skicaTeknike) : undefined,
    })),
  );

  const payload = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    items: serialized,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `artikuj-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);

  return items.length;
}

export async function importBackup(file: File): Promise<number> {
  const text = await file.text();
  const payload = JSON.parse(text);
  const rawItems: SerializedItem[] = Array.isArray(payload) ? payload : payload.items;

  if (!Array.isArray(rawItems)) {
    throw new Error('Skedari nuk përmban artikuj të vlefshëm.');
  }

  for (const raw of rawItems) {
    const item: Item = {
      ...raw,
      imazhi: raw.imazhi ? await dataUrlToBlob(raw.imazhi) : undefined,
      skicaTeknike: raw.skicaTeknike ? await dataUrlToBlob(raw.skicaTeknike) : undefined,
    } as Item;
    await saveItem(normalizeItem(item));
  }

  return rawItems.length;
}
