import type { SizeTableRow } from './types';

type AnchorKey = 'supi' | 'gjoksi' | 'mengesia' | 'gjatesia' | 'beli';

interface SketchTemplate {
  match: (kategoriaLower: string) => boolean;
  outline: string; // inner SVG markup (paths/lines) for the garment outline
  anchors: Record<AnchorKey, { x: number; y: number }>;
}

const VIEW_W = 300;
const VIEW_H = 340;
const STROKE = '#1f2937';

const TANK_TOP: SketchTemplate = {
  match: (k) => k.includes('fanell') || (k.includes('bluz') && k.includes('pa mëngë')),
  outline: `
    <path d="M108,12 L100,46 C86,60 74,80 70,112 L66,300 L118,300 L118,150 L182,150 L182,300 L234,300 L230,112
             C226,80 214,60 200,46 L192,12
             C182,26 168,34 150,34 C132,34 118,26 108,12 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M126,34 C132,52 140,62 150,62 C160,62 168,52 174,34" fill="none" stroke="${STROKE}" stroke-width="1.6" />
  `,
  anchors: {
    supi: { x: 150, y: 18 },
    gjoksi: { x: 150, y: 118 },
    mengesia: { x: 224, y: 96 },
    beli: { x: 150, y: 210 },
    gjatesia: { x: 40, y: 260 },
  },
};

const HOODIE: SketchTemplate = {
  match: (k) => k.includes('kapuç') || k.includes('kapuc') || k.includes('hoodie'),
  outline: `
    <path d="M114,22 C110,6 128,2 150,2 C172,2 190,6 186,22" fill="none" stroke="${STROKE}" stroke-width="2" />
    <path d="M120,20 L62,44 L40,96 L72,112 L90,80 L90,300 L210,300 L210,80 L228,112 L260,96 L238,44 L180,20
             L150,48 L120,20 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M138,22 L134,58" fill="none" stroke="${STROKE}" stroke-width="1.4" />
    <path d="M162,22 L166,58" fill="none" stroke="${STROKE}" stroke-width="1.4" />
    <rect x="118" y="185" width="64" height="32" rx="4" fill="none" stroke="${STROKE}" stroke-width="1.4" />
    <path d="M90,220 L90,260" fill="none" stroke="${STROKE}" stroke-width="2" />
    <path d="M210,220 L210,260" fill="none" stroke="${STROKE}" stroke-width="2" />
  `,
  anchors: {
    supi: { x: 150, y: 12 },
    gjoksi: { x: 150, y: 140 },
    mengesia: { x: 246, y: 100 },
    beli: { x: 150, y: 230 },
    gjatesia: { x: 28, y: 220 },
  },
};

const TSHIRT: SketchTemplate = {
  match: (k) => k.includes('bluz') || k.includes('t-shirt') || k.includes('tshirt') || k.includes('t shirt'),
  outline: `
    <path d="M118,20 L60,44 L44,90 L76,104 L92,72 L92,300 L208,300 L208,72 L224,104 L256,90 L240,44 L182,20
             C176,32 164,40 150,40 C136,40 124,32 118,20 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M128,20 C134,36 140,44 150,44 C160,44 166,36 172,20" fill="none" stroke="${STROKE}" stroke-width="1.6" />
  `,
  anchors: {
    supi: { x: 150, y: 24 },
    gjoksi: { x: 150, y: 130 },
    mengesia: { x: 240, y: 70 },
    beli: { x: 150, y: 220 },
    gjatesia: { x: 34, y: 220 },
  },
};

const SHIRT: SketchTemplate = {
  match: (k) => k.includes('këmish') || k.includes('kemish') || k.includes('shirt'),
  outline: `
    <path d="M120,16 L62,40 L40,92 L72,108 L90,76 L90,300 L210,300 L210,76 L228,108 L260,92 L238,40 L180,16
             L150,44 L120,16 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M150,44 L150,300" fill="none" stroke="${STROKE}" stroke-width="1.2" stroke-dasharray="4 4" />
    <path d="M120,16 L108,60 L138,50 Z" fill="none" stroke="${STROKE}" stroke-width="1.6" />
    <path d="M180,16 L192,60 L162,50 Z" fill="none" stroke="${STROKE}" stroke-width="1.6" />
    <path d="M90,120 L64,150 L64,220 L90,220" fill="none" stroke="${STROKE}" stroke-width="2" />
    <path d="M210,120 L236,150 L236,220 L210,220" fill="none" stroke="${STROKE}" stroke-width="2" />
  `,
  anchors: {
    supi: { x: 150, y: 30 },
    gjoksi: { x: 150, y: 130 },
    mengesia: { x: 250, y: 150 },
    beli: { x: 150, y: 220 },
    gjatesia: { x: 30, y: 220 },
  },
};

const JACKET: SketchTemplate = {
  match: (k) => k.includes('xhaket') || k.includes('jacket') || k.includes('kapardaj'),
  outline: `
    <path d="M120,16 L62,40 L40,92 L72,108 L90,76 L90,300 L210,300 L210,76 L228,108 L260,92 L238,40 L180,16
             L150,44 L120,16 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M120,16 L100,66 L140,52 Z" fill="none" stroke="${STROKE}" stroke-width="1.6" />
    <path d="M180,16 L200,66 L160,52 Z" fill="none" stroke="${STROKE}" stroke-width="1.6" />
    <rect x="106" y="112" width="30" height="10" fill="none" stroke="${STROKE}" stroke-width="1.4" />
    <path d="M84,196 L112,196" fill="none" stroke="${STROKE}" stroke-width="1.6" />
    <path d="M188,196 L216,196" fill="none" stroke="${STROKE}" stroke-width="1.6" />
    <path d="M90,120 L64,150 L64,220 L90,220" fill="none" stroke="${STROKE}" stroke-width="2" />
    <path d="M210,120 L236,150 L236,220 L210,220" fill="none" stroke="${STROKE}" stroke-width="2" />
  `,
  anchors: {
    supi: { x: 150, y: 26 },
    gjoksi: { x: 150, y: 130 },
    mengesia: { x: 250, y: 150 },
    beli: { x: 150, y: 220 },
    gjatesia: { x: 30, y: 220 },
  },
};

const PANTS: SketchTemplate = {
  match: (k) => k.includes('pantallon') || k.includes('pants') || k.includes('trouser'),
  outline: `
    <path d="M76,20 L224,20 L228,60 L152,60 L152,90 L200,300 L160,300 L150,120 L140,300 L100,300 L148,90
             L148,60 L72,60 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M76,20 L72,60" fill="none" stroke="${STROKE}" stroke-width="2" />
    <path d="M224,20 L228,60" fill="none" stroke="${STROKE}" stroke-width="2" />
  `,
  anchors: {
    supi: { x: 150, y: 12 },
    gjoksi: { x: 150, y: 70 },
    mengesia: { x: 200, y: 180 },
    beli: { x: 150, y: 34 },
    gjatesia: { x: 40, y: 200 },
  },
};

const SKIRT: SketchTemplate = {
  match: (k) => k.includes('fund') || k.includes('skirt'),
  outline: `
    <rect x="118" y="20" width="64" height="14" rx="2" fill="none" stroke="${STROKE}" stroke-width="2" />
    <path d="M118,34 L182,34 L226,290 L74,290 Z" fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M150,34 L150,290" fill="none" stroke="${STROKE}" stroke-width="1" stroke-dasharray="4 4" />
  `,
  anchors: {
    supi: { x: 150, y: 14 },
    gjoksi: { x: 150, y: 120 },
    mengesia: { x: 216, y: 150 },
    beli: { x: 150, y: 27 },
    gjatesia: { x: 40, y: 200 },
  },
};

const DRESS: SketchTemplate = {
  match: (k) => k.includes('fustan') || k.includes('dress') || k.includes('rrobë') || k.includes('robe'),
  outline: `
    <path d="M108,12 L100,46 C86,60 74,80 70,112 L74,175 L46,320 L254,320 L226,175 L230,112
             C226,80 214,60 200,46 L192,12
             C182,26 168,34 150,34 C132,34 118,26 108,12 Z"
          fill="none" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M126,34 C132,52 140,62 150,62 C160,62 168,52 174,34" fill="none" stroke="${STROKE}" stroke-width="1.6" />
    <path d="M70,175 L230,175" fill="none" stroke="${STROKE}" stroke-width="1" stroke-dasharray="3 3" />
  `,
  anchors: {
    supi: { x: 150, y: 18 },
    gjoksi: { x: 150, y: 118 },
    mengesia: { x: 224, y: 96 },
    beli: { x: 150, y: 178 },
    gjatesia: { x: 40, y: 260 },
  },
};

const DEFAULT_TEMPLATE: SketchTemplate = {
  match: () => true,
  outline: `
    <rect x="70" y="30" width="160" height="270" rx="18" fill="none" stroke="${STROKE}" stroke-width="2.5" />
    <path d="M120,30 C126,44 136,52 150,52 C164,52 174,44 180,30" fill="none" stroke="${STROKE}" stroke-width="1.6" />
  `,
  anchors: {
    supi: { x: 150, y: 34 },
    gjoksi: { x: 150, y: 150 },
    mengesia: { x: 224, y: 100 },
    beli: { x: 150, y: 220 },
    gjatesia: { x: 46, y: 200 },
  },
};

const TEMPLATES: SketchTemplate[] = [TANK_TOP, HOODIE, TSHIRT, SHIRT, JACKET, PANTS, SKIRT, DRESS];

export const SKETCH_CATEGORIES = [
  'Fanellë',
  'Bluzë me Kapuç',
  'Bluzë / T-Shirt',
  'Këmishë',
  'Xhaketë',
  'Pantallona',
  'Fund',
  'Fustan',
];

function pickTemplate(kategoria: string): SketchTemplate {
  const k = kategoria.trim().toLowerCase();
  if (!k) return DEFAULT_TEMPLATE;
  return TEMPLATES.find((t) => t.match(k)) ?? DEFAULT_TEMPLATE;
}

function matchAnchorKey(label: string): AnchorKey | null {
  const l = label.trim().toLowerCase();
  if (l.includes('bel')) return 'beli';
  if (l.includes('gjatësi') || l.includes('gjatesi')) return 'gjatesia';
  if (l.includes('gjoks') || l.includes('gjerësia gjithësej') || l.includes('gjeresia gjithesej')) return 'gjoksi';
  if (l.includes('sup')) return 'supi';
  if (l.includes('mëngë') || l.includes('mengë') || l.includes('mengesi') || l.includes('krah')) return 'mengesia';
  return null;
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

export function generateSketchSvg(kategoria: string, rows: SizeTableRow[]): string {
  const template = pickTemplate(kategoria);
  const usedAnchors = new Set<AnchorKey>();
  const badges: string[] = [];
  const legend: { letter: string; label: string }[] = [];

  rows.forEach((row, i) => {
    const letter = rowLetter(i);
    const anchorKey = matchAnchorKey(row.label);
    if (anchorKey && !usedAnchors.has(anchorKey)) {
      usedAnchors.add(anchorKey);
      const { x, y } = template.anchors[anchorKey];
      badges.push(badge(x, y, letter));
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
