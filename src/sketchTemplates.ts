import { makeId, type SizeTableRow, type SizeTable } from './types';

interface Anchor {
  keywords: string[]; // lowercase substrings matched against a row label
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  labelX: number;
  labelY: number;
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
    { keywords: ['brez'], x1: 86, y1: 26, x2: 214, y2: 26, labelX: 150, labelY: 40 },
    { keywords: ['gjatësia totale', 'gjatesia totale', 'gjatësia', 'total'], x1: 24, y1: 26, x2: 24, y2: 280, labelX: 14, labelY: 156 },
    { keywords: ['hapja e këmbës', 'hapja e kembes', 'hapja'], x1: 200, y1: 112, x2: 226, y2: 158, labelX: 240, labelY: 138 },
    { keywords: ['gusset', 'fundit'], x1: 120, y1: 270, x2: 180, y2: 270, labelX: 150, labelY: 285 },
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
    { keywords: ['gjerësia e fundit', 'gjeresia e fundit', 'fundit'], x1: 70, y1: 312, x2: 230, y2: 312, labelX: 150, labelY: 327 },
    { keywords: ['gjatësia anësore', 'gjatesia anesore', 'anësore', 'anesore'], x1: 20, y1: 20, x2: 20, y2: 300, labelX: 10, labelY: 162 },
    { keywords: ['sqetull'], x1: 233, y1: 68, x2: 233, y2: 118, labelX: 249, labelY: 96 },
    { keywords: ['sup'], x1: 108, y1: 4, x2: 140, y2: 4, labelX: 124, labelY: 17 },
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
    { keywords: ['gjoks'], x1: 92, y1: 312, x2: 208, y2: 312, labelX: 150, labelY: 327 },
    { keywords: ['gjatësia totale', 'gjatesia totale', 'total'], x1: 20, y1: 20, x2: 20, y2: 300, labelX: 10, labelY: 162 },
    { keywords: ['mëngë', 'mengë', 'mengesi'], x1: 206, y1: 56, x2: 246, y2: 84, labelX: 258, labelY: 78 },
    { keywords: ['sup'], x1: 118, y1: 8, x2: 182, y2: 8, labelX: 150, labelY: 20 },
    { keywords: ['qaf'], x1: 134, y1: 26, x2: 166, y2: 26, labelX: 150, labelY: 40 },
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
    { keywords: ['gjoks'], x1: 90, y1: 312, x2: 210, y2: 312, labelX: 150, labelY: 327 },
    { keywords: ['gjatësia totale', 'gjatesia totale', 'total'], x1: 20, y1: 16, x2: 20, y2: 300, labelX: 10, labelY: 160 },
    { keywords: ['mëngë', 'mengë', 'mengesi'], x1: 210, y1: 60, x2: 246, y2: 140, labelX: 258, labelY: 105 },
    { keywords: ['sup'], x1: 120, y1: 6, x2: 180, y2: 6, labelX: 150, labelY: 18 },
    { keywords: ['qaf'], x1: 134, y1: 26, x2: 166, y2: 26, labelX: 150, labelY: 40 },
    { keywords: ['manshet', 'mansheta'], x1: 218, y1: 208, x2: 240, y2: 228, labelX: 252, labelY: 224 },
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
    { keywords: ['brez'], x1: 86, y1: 12, x2: 214, y2: 12, labelX: 150, labelY: 24 },
    { keywords: ['gjatësia anësore', 'gjatesia anesore', 'anësore', 'anesore'], x1: 20, y1: 20, x2: 20, y2: 195, labelX: 10, labelY: 112 },
    { keywords: ['inseam', 'gjatësia e këmbës', 'gjatesia e kembes'], x1: 150, y1: 92, x2: 150, y2: 195, labelX: 164, labelY: 148 },
    { keywords: ['hapja e këmbës', 'hapja e kembes'], x1: 168, y1: 192, x2: 204, y2: 200, labelX: 216, labelY: 210 },
    { keywords: ['rise', 'hapi'], x1: 150, y1: 20, x2: 150, y2: 88, labelX: 164, labelY: 58 },
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
    { keywords: ['gjoks'], x1: 70, y1: 118, x2: 230, y2: 118, labelX: 150, labelY: 106 },
    { keywords: ['gjatësia totale', 'gjatesia totale', 'total'], x1: 20, y1: 12, x2: 20, y2: 320, labelX: 10, labelY: 168 },
    { keywords: ['sqetull'], x1: 233, y1: 68, x2: 233, y2: 118, labelX: 249, labelY: 96 },
    { keywords: ['sup'], x1: 108, y1: 4, x2: 140, y2: 4, labelX: 124, labelY: 17 },
    { keywords: ['gjerësia e fundit', 'gjeresia e fundit', 'fundit'], x1: 46, y1: 330, x2: 254, y2: 330, labelX: 150, labelY: 325 },
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
    { keywords: ['brez'], x1: 86, y1: 10, x2: 214, y2: 10, labelX: 150, labelY: 22 },
    { keywords: ['gjatësia totale', 'gjatesia totale', 'total'], x1: 20, y1: 20, x2: 20, y2: 296, labelX: 10, labelY: 160 },
    { keywords: ['inseam', 'gjatësia e këmbës', 'gjatesia e kembes'], x1: 150, y1: 96, x2: 150, y2: 290, labelX: 164, labelY: 196 },
    { keywords: ['kofsh'], x1: 76, y1: 64, x2: 224, y2: 64, labelX: 150, labelY: 78 },
    { keywords: ['kyç', 'kyc', 'hapja e fundit'], x1: 160, y1: 292, x2: 200, y2: 300, labelX: 214, labelY: 297 },
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
    { keywords: ['sup'], x1: 118, y1: 12, x2: 182, y2: 12, labelX: 150, labelY: 24 },
    { keywords: ['gjoks', 'gjerësia gjithësej', 'gjeresia gjithesej'], x1: 70, y1: 312, x2: 230, y2: 312, labelX: 150, labelY: 327 },
    { keywords: ['mëngë', 'mengë', 'mengesi', 'krah'], x1: 234, y1: 80, x2: 234, y2: 130, labelX: 250, labelY: 108 },
    { keywords: ['gjatësi', 'gjatesi'], x1: 20, y1: 30, x2: 20, y2: 300, labelX: 10, labelY: 168 },
    { keywords: ['bel'], x1: 100, y1: 175, x2: 200, y2: 175, labelX: 150, labelY: 190 },
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

// Draws a straight dimension line with small open arrowheads at both ends,
// matching the hand-drawn technical-sketch convention (arrows along the
// garment edges rather than badges on top of the fabric).
function arrowLine(x1: number, y1: number, x2: number, y2: number): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 6;
  const headAngle = Math.PI / 7;
  const head = (x: number, y: number, dir: number) => {
    const ax = x - headLen * Math.cos(dir - headAngle);
    const ay = y - headLen * Math.sin(dir - headAngle);
    const bx = x - headLen * Math.cos(dir + headAngle);
    const by = y - headLen * Math.sin(dir + headAngle);
    return `M${x},${y} L${ax},${ay} M${x},${y} L${bx},${by}`;
  };
  return `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${STROKE}" stroke-width="1.3" />
    <path d="${head(x1, y1, angle + Math.PI)}" stroke="${STROKE}" stroke-width="1.3" fill="none" stroke-linecap="round" />
    <path d="${head(x2, y2, angle)}" stroke="${STROKE}" stroke-width="1.3" fill="none" stroke-linecap="round" />
  `;
}

function anchorMarkup(anchor: Anchor, letter: string): string {
  return `
    ${arrowLine(anchor.x1, anchor.y1, anchor.x2, anchor.y2)}
    <text x="${anchor.labelX}" y="${anchor.labelY}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" font-weight="700" fill="${STROKE}">${letter}</text>
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
  const marks: string[] = [];
  const legend: { letter: string; label: string }[] = [];

  rows.forEach((row, i) => {
    const letter = rowLetter(i);
    const anchor = matchAnchor(row.label, template.anchors, used);
    if (anchor) {
      used.add(anchor);
      marks.push(anchorMarkup(anchor, letter));
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
    ${marks.join('')}
    ${legendSvg}
  </svg>`;
}

export function generateSketchBlob(kategoria: string, rows: SizeTableRow[]): Blob {
  const svg = generateSketchSvg(kategoria, rows);
  return new Blob([svg], { type: 'image/svg+xml' });
}
