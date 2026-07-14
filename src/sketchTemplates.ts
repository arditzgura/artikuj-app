import { makeId, type SizeTableRow, type SizeTable } from './types';

interface Anchor {
  keywords: string[]; // lowercase substrings matched against a row label
  x: number;
  y: number;
}

interface SketchTemplate {
  name: string;
  match: (kategoriaLower: string) => boolean;
  outline: string; // inner SVG markup (paths/lines) for the garment outline
  anchors: Anchor[];
  rows: string[]; // recommended measurement row labels, in A/B/C... order
}

const VIEW_W = 300;
const VIEW_H = 340;
const STROKE = '#1f2937';

const MBATHJE: SketchTemplate = {
  name: 'Mbathje',
  match: (k) => k.includes('mbathje') || k.includes('brief') || k.includes('slip'),
  outline: `
    <path d="M70,40 C70,28 96,20 150,20 C204,20 230,28 230,40 L226,128
             C224,180 200,240 150,282 C100,240 76,180 74,128 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M74,128 C92,150 116,160 150,160 C184,160 208,150 226,128"
          fill="none" stroke="${STROKE}" stroke-width="1.4" stroke-dasharray="4 4" />
  `,
  anchors: [
    { keywords: ['brez'], x: 150, y: 24 },
    { keywords: ['gjatësia totale', 'gjatesia totale', 'gjatësia', 'total'], x: 44, y: 150 },
    { keywords: ['hapja e këmbës', 'hapja e kembes', 'hapja'], x: 212, y: 150 },
    { keywords: ['gusset', 'fundit'], x: 150, y: 268 },
  ],
  rows: ['Gjerësia e Brezit', 'Gjatësia Totale', 'Hapja e Këmbës', 'Gjerësia e Fundit (Gusset)'],
};

const KANAJTERE: SketchTemplate = {
  name: 'Kanajtere',
  match: (k) => k === 'kanajtere' || (k.includes('kanajtere') && !k.includes('gjatë') && !k.includes('gjate')),
  outline: `
    <path d="M108,12 L100,46 C86,60 74,80 70,112 L66,300 L118,300 L118,150 L182,150 L182,300 L234,300 L230,112
             C226,80 214,60 200,46 L192,12
             C182,26 168,34 150,34 C132,34 118,26 108,12 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M126,34 C132,52 140,62 150,62 C160,62 168,52 174,34" fill="none" stroke="${STROKE}" stroke-width="1.6" />
  `,
  anchors: [
    { keywords: ['gjerësia e fundit', 'gjeresia e fundit', 'fundit'], x: 150, y: 290 },
    { keywords: ['gjatësia anësore', 'gjatesia anesore', 'anësore', 'anesore'], x: 40, y: 200 },
    { keywords: ['sqetull'], x: 224, y: 96 },
    { keywords: ['sup'], x: 150, y: 18 },
  ],
  rows: ['Gjerësia e Fundit', 'Gjatësia Anësore', 'Harku i Sqetullës', 'Gjerësia e Supit'],
};

const BLUZE: SketchTemplate = {
  name: 'Bluzë (mëngë të shkurtra)',
  match: (k) => (k.includes('bluz') && !k.includes('gjatë') && !k.includes('gjate')) || k === 'bluze',
  outline: `
    <path d="M118,20 L60,44 L44,90 L76,104 L92,72 L92,300 L208,300 L208,72 L224,104 L256,90 L240,44 L182,20
             C176,32 164,40 150,40 C136,40 124,32 118,20 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M128,20 C134,36 140,44 150,44 C160,44 166,36 172,20" fill="none" stroke="${STROKE}" stroke-width="1.6" />
  `,
  anchors: [
    { keywords: ['gjoks'], x: 150, y: 130 },
    { keywords: ['gjatësia totale', 'gjatesia totale', 'total'], x: 34, y: 220 },
    { keywords: ['mëngë', 'mengë', 'mengesi'], x: 240, y: 70 },
    { keywords: ['sup'], x: 150, y: 24 },
    { keywords: ['qaf'], x: 150, y: 44 },
  ],
  rows: [
    'Gjerësia e Gjoksit (1/2)',
    'Gjatësia Totale',
    'Gjatësia e Mëngës',
    'Gjerësia e Supave',
    'Hapja e Qafës',
  ],
};

const BLUZE_MENGE_GJATE: SketchTemplate = {
  name: 'Bluzë mëngë e gjatë',
  match: (k) => k.includes('mëngë e gjatë') || k.includes('mengе gjate') || k.includes('mengë gjatë') || (k.includes('bluz') && (k.includes('gjatë') || k.includes('gjate'))),
  outline: `
    <path d="M120,16 L62,40 L40,92 L72,108 L90,76 L90,300 L210,300 L210,76 L228,108 L260,92 L238,40 L180,16
             L150,44 L120,16 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M90,120 L64,150 L64,220 L90,220" fill="none" stroke="${STROKE}" stroke-width="2" />
    <path d="M210,120 L236,150 L236,220 L210,220" fill="none" stroke="${STROKE}" stroke-width="2" />
  `,
  anchors: [
    { keywords: ['gjoks'], x: 150, y: 130 },
    { keywords: ['gjatësia totale', 'gjatesia totale', 'total'], x: 30, y: 220 },
    { keywords: ['mëngë', 'mengë', 'mengesi'], x: 250, y: 150 },
    { keywords: ['sup'], x: 150, y: 30 },
    { keywords: ['qaf'], x: 150, y: 44 },
    { keywords: ['manshet', 'mansheta'], x: 64, y: 220 },
  ],
  rows: [
    'Gjoksi (1/2)',
    'Gjatësia Totale',
    'Gjatësia e Mëngës',
    'Supet',
    'Qafa',
    'Gjerësia e Manshetës',
  ],
};

const BOKSE: SketchTemplate = {
  name: 'Bokse',
  match: (k) => k.includes('bokse') || k.includes('boxer'),
  outline: `
    <path d="M76,20 L224,20 L228,60 L152,60 L152,85 L206,200 L164,200 L150,110 L136,200 L94,200 L148,85
             L148,60 L72,60 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M76,20 L72,60" fill="none" stroke="${STROKE}" stroke-width="2" />
    <path d="M224,20 L228,60" fill="none" stroke="${STROKE}" stroke-width="2" />
  `,
  anchors: [
    { keywords: ['brez'], x: 150, y: 30 },
    { keywords: ['gjatësia anësore', 'gjatesia anesore', 'anësore', 'anesore'], x: 40, y: 110 },
    { keywords: ['inseam', 'gjatësia e këmbës', 'gjatesia e kembes'], x: 150, y: 150 },
    { keywords: ['hapja e këmbës', 'hapja e kembes'], x: 190, y: 190 },
    { keywords: ['rise', 'hapi'], x: 150, y: 95 },
  ],
  rows: ['Gjerësia e Brezit', 'Gjatësia Anësore', 'Gjatësia e Këmbës (Inseam)', 'Hapja e Këmbës', 'Hapi (Rise)'],
};

const KANAJTERE_E_GJATE: SketchTemplate = {
  name: 'Kanajtere e gjatë (night dress)',
  match: (k) => k.includes('night dress') || (k.includes('kanajtere') && (k.includes('gjatë') || k.includes('gjate'))),
  outline: `
    <path d="M108,12 L100,46 C86,60 74,80 70,112 L74,175 L46,320 L254,320 L226,175 L230,112
             C226,80 214,60 200,46 L192,12
             C182,26 168,34 150,34 C132,34 118,26 108,12 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M126,34 C132,52 140,62 150,62 C160,62 168,52 174,34" fill="none" stroke="${STROKE}" stroke-width="1.6" />
    <path d="M70,175 L230,175" fill="none" stroke="${STROKE}" stroke-width="1" stroke-dasharray="3 3" />
  `,
  anchors: [
    { keywords: ['gjoks'], x: 150, y: 118 },
    { keywords: ['gjatësia totale', 'gjatesia totale', 'total'], x: 40, y: 260 },
    { keywords: ['sqetull'], x: 224, y: 96 },
    { keywords: ['sup'], x: 150, y: 18 },
    { keywords: ['gjerësia e fundit', 'gjeresia e fundit', 'fundit'], x: 150, y: 300 },
  ],
  rows: ['Gjoksi (1/2)', 'Gjatësia Totale', 'Sqetulla', 'Supi', 'Gjerësia e Fundit'],
};

const BENEVREK: SketchTemplate = {
  name: 'Benevrek (long johns)',
  match: (k) => k.includes('benevrek') || k.includes('long john'),
  outline: `
    <path d="M76,20 L224,20 L228,60 L152,60 L152,90 L200,300 L160,300 L150,120 L140,300 L100,300 L148,90
             L148,60 L72,60 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M76,20 L72,60" fill="none" stroke="${STROKE}" stroke-width="2" />
    <path d="M224,20 L228,60" fill="none" stroke="${STROKE}" stroke-width="2" />
  `,
  anchors: [
    { keywords: ['brez'], x: 150, y: 24 },
    { keywords: ['gjatësia totale', 'gjatesia totale', 'total'], x: 40, y: 180 },
    { keywords: ['inseam', 'gjatësia e këmbës', 'gjatesia e kembes'], x: 150, y: 150 },
    { keywords: ['kofsh'], x: 150, y: 68 },
    { keywords: ['kyç', 'kyc', 'hapja e fundit'], x: 150, y: 295 },
  ],
  rows: ['Gjerësia e Brezit', 'Gjatësia Totale', 'Gjatësia e Këmbës (Inseam)', 'Gjerësia e Kofshës', 'Hapja e Fundit (Kyçi)'],
};

const DEFAULT_TEMPLATE: SketchTemplate = {
  name: 'Gjenerik',
  match: () => true,
  outline: `
    <rect x="70" y="30" width="160" height="270" rx="18" fill="none" stroke="${STROKE}" stroke-width="2.5" />
    <path d="M120,30 C126,44 136,52 150,52 C164,52 174,44 180,30" fill="none" stroke="${STROKE}" stroke-width="1.6" />
  `,
  anchors: [
    { keywords: ['sup'], x: 150, y: 34 },
    { keywords: ['gjoks', 'gjerësia gjithësej', 'gjeresia gjithesej'], x: 150, y: 150 },
    { keywords: ['mëngë', 'mengë', 'mengesi', 'krah'], x: 224, y: 100 },
    { keywords: ['gjatësi', 'gjatesi'], x: 46, y: 220 },
    { keywords: ['bel'], x: 150, y: 260 },
  ],
  rows: [],
};

const TEMPLATES: SketchTemplate[] = [
  MBATHJE,
  KANAJTERE_E_GJATE,
  KANAJTERE,
  BLUZE_MENGE_GJATE,
  BLUZE,
  BOKSE,
  BENEVREK,
];

export const SKETCH_CATEGORIES = TEMPLATES.map((t) => t.name);

function pickTemplate(kategoria: string): SketchTemplate {
  const k = kategoria.trim().toLowerCase();
  if (!k) return DEFAULT_TEMPLATE;
  return TEMPLATES.find((t) => t.match(k)) ?? DEFAULT_TEMPLATE;
}

export function getRecommendedRows(kategoria: string): string[] | null {
  const template = pickTemplate(kategoria);
  return template.rows.length > 0 ? template.rows : null;
}

export function applyRecommendedRows(kategoria: string, table: SizeTable): SizeTable {
  const labels = getRecommendedRows(kategoria);
  if (!labels) return table;
  const rows: SizeTableRow[] = labels.map((label) => ({
    id: makeId(),
    label,
    values: Object.fromEntries(table.columns.map((c) => [c.id, ''])),
  }));
  return { ...table, rows };
}

function rowLetter(index: number) {
  return String.fromCharCode(65 + (index % 26));
}

function badge(x: number, y: number, letter: string) {
  return `
    <g>
      <rect x="${x - 11}" y="${y - 11}" width="22" height="22" rx="5" fill="#1e293b" />
      <text x="${x}" y="${y + 5}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" font-weight="700" fill="#ffffff">${letter}</text>
    </g>
  `;
}

function matchAnchor(label: string, anchors: Anchor[], used: Set<Anchor>): Anchor | null {
  const l = label.trim().toLowerCase();
  if (!l) return null;
  for (const anchor of anchors) {
    if (used.has(anchor)) continue;
    if (anchor.keywords.some((kw) => l.includes(kw))) return anchor;
  }
  return null;
}

export function generateSketchSvg(kategoria: string, rows: SizeTableRow[]): string {
  const template = pickTemplate(kategoria);
  const used = new Set<Anchor>();
  const badges: string[] = [];
  const legend: { letter: string; label: string }[] = [];

  rows.forEach((row, i) => {
    const letter = rowLetter(i);
    const anchor = matchAnchor(row.label, template.anchors, used);
    if (anchor) {
      used.add(anchor);
      badges.push(badge(anchor.x, anchor.y, letter));
    } else {
      legend.push({ letter, label: row.label || `Masa ${letter}` });
    }
  });

  const legendY = VIEW_H - 6;
  const legendSvg =
    legend.length > 0
      ? `<text x="10" y="${legendY}" font-family="ui-monospace, monospace" font-size="10" fill="#64748b">${legend
          .map((l) => `${l.letter}: ${l.label}`)
          .join('   ')}</text>`
      : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}">
    <rect x="0" y="0" width="${VIEW_W}" height="${VIEW_H}" fill="#ffffff" />
    ${template.outline}
    ${badges.join('')}
    ${legendSvg}
  </svg>`;
}

export function generateSketchBlob(kategoria: string, rows: SizeTableRow[]): Blob {
  const svg = generateSketchSvg(kategoria, rows);
  return new Blob([svg], { type: 'image/svg+xml' });
}
