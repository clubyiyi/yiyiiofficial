import type { CategorySlug } from '@/types/commerce';

/**
 * Dibujo de la prenda con las medidas numeradas (1 y 2 contornos, 3 largo).
 * Lienzo 400×400.
 */
const shapes: Record<CategorySlug, { body: string; extra?: string; m1: number; m2: number; top: number; bottom: number; w1: number; w2: number }> = {
  tops: { body: 'M128 92 Q200 80 272 92 L282 300 Q200 322 118 300 Z', m1: 128, m2: 222, top: 90, bottom: 312, w1: 72, w2: 76 },
  corsets: {
    body: 'M122 108 Q160 78 200 104 Q240 78 278 108 L268 200 Q260 250 284 312 L200 334 L116 312 Q140 250 132 200 Z',
    extra: 'M200 104 L200 334 M170 98 L166 322 M230 98 L234 322',
    m1: 140, m2: 216, top: 92, bottom: 334, w1: 72, w2: 66,
  },
  dresses: {
    body: 'M152 58 Q200 74 248 58 L258 160 Q298 268 330 372 Q200 396 70 372 Q102 268 142 160 Z',
    extra: 'M152 58 L156 30 M248 58 L244 30',
    m1: 100, m2: 162, top: 30, bottom: 384, w1: 54, w2: 60,
  },
  skirts: {
    body: 'M138 92 L262 92 L312 332 Q200 352 88 332 Z',
    extra: 'M140 66 L260 66 L262 92 L138 92 Z',
    m1: 80, m2: 150, top: 66, bottom: 344, w1: 64, w2: 82,
  },
  shorts: {
    body: 'M136 92 L264 92 L292 262 L212 274 L200 176 L188 274 L108 262 Z',
    extra: 'M138 68 L262 68 L264 92 L136 92 Z',
    m1: 80, m2: 140, top: 68, bottom: 274, w1: 66, w2: 76,
  },
};

export function SizeDiagram({ category, title }: { category: CategorySlug; title: string }) {
  const s = shapes[category];
  const label = (x: number, y: number, n: number) => (
    <g>
      <circle cx={x} cy={y} r="11" fill="var(--color-ink)" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="DM Sans, sans-serif">
        {n}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label={title}>
      <rect width="400" height="400" fill="var(--color-pink-50)" />
      <path d={s.body} fill="var(--color-pink-200)" stroke="var(--color-pink-400)" strokeWidth="2" />
      {s.extra && <path d={s.extra} fill="var(--color-pink-200)" stroke="var(--color-pink-400)" strokeWidth="2" />}
      <g fill="none" stroke="var(--color-ink)" strokeWidth="1.6">
        <ellipse cx="200" cy={s.m1} rx={s.w1} ry="11" />
        <ellipse cx="200" cy={s.m2} rx={s.w2} ry="11" />
        <path d={`M362 ${s.top} L362 ${s.bottom} M354 ${s.top} L370 ${s.top} M354 ${s.bottom} L370 ${s.bottom}`} />
      </g>
      {label(200 - s.w1 - 22, s.m1, 1)}
      {label(200 - s.w2 - 22, s.m2, 2)}
      {label(362, (s.top + s.bottom) / 2, 3)}
    </svg>
  );
}
