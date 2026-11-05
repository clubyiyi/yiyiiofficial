import { useId } from 'react';
import type { ArtPattern, GarmentKind, ProductArt } from '@/types/commerce';

/**
 * Ilustraciones vectoriales originales para el catálogo de demostración.
 * Coordenadas en un lienzo 400×500 (formato retrato 4:5, como la fotografía de moda).
 */

const shapes: Record<GarmentKind, { body: string; details?: string; hangerY: number; bowAt: [number, number] }> = {
  dress: {
    body: 'M168 150 Q200 166 232 150 L240 228 Q275 320 314 428 Q200 462 86 428 Q125 320 160 228 Z',
    details: 'M168 150 L170 112 M232 150 L230 112 M160 228 Q200 240 240 228',
    hangerY: 110,
    bowAt: [200, 234],
  },
  top: {
    body: 'M152 132 Q200 160 248 132 L282 146 L318 210 L278 228 L258 196 L258 330 Q200 346 142 330 L142 196 L122 228 L82 210 L118 146 Z',
    details: 'M152 132 Q200 176 248 132 M142 300 Q200 314 258 300',
    hangerY: 128,
    bowAt: [200, 170],
  },
  skirt: {
    body: 'M134 176 L266 176 L268 200 Q296 290 326 392 Q200 420 74 392 Q104 290 132 200 Z',
    details: 'M132 200 L268 200 M170 202 L140 398 M200 202 L200 408 M230 202 L260 398',
    hangerY: 150,
    bowAt: [236, 190],
  },
  corset: {
    body: 'M140 152 Q170 128 200 152 Q230 128 260 152 L252 232 Q244 282 262 334 L200 356 L138 334 Q156 282 148 232 Z',
    details:
      'M150 150 L158 138 M250 150 L242 138 M172 146 L168 342 M228 146 L232 342 M192 176 L208 192 M208 176 L192 192 M192 206 L208 222 M208 206 L192 222 M192 236 L208 252 M208 236 L192 252 M192 266 L208 282 M208 266 L192 282',
    hangerY: 130,
    bowAt: [200, 158],
  },
  shorts: {
    body: 'M140 176 L260 176 L262 200 L292 340 L212 352 L200 262 L188 352 L108 340 L138 200 Z',
    details: 'M138 200 L262 200 M200 200 L200 262 M112 322 L190 334 M210 334 L288 322',
    hangerY: 150,
    bowAt: [164, 190],
  },
};

function PatternDef({ id, pattern, accent }: { id: string; pattern: ArtPattern; accent: string }) {
  switch (pattern) {
    case 'gingham':
      return (
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
          <rect width="14" height="28" fill={accent} opacity="0.45" />
          <rect width="28" height="14" fill={accent} opacity="0.45" />
        </pattern>
      );
    case 'dots':
      return (
        <pattern id={id} width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="3.4" fill={accent} />
          <circle cx="19" cy="19" r="3.4" fill={accent} />
        </pattern>
      );
    case 'hearts':
      return (
        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M12 16c-3-4-9-2-8 3 1 4 8 8 8 8s7-4 8-8c1-5-5-7-8-3z" fill={accent} opacity="0.9" />
          <path d="M32 36c-2-3-6-1.5-5.5 2 .6 2.8 5.5 5.5 5.5 5.5" fill={accent} opacity="0.9" />
        </pattern>
      );
    case 'stripes':
      return (
        <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse">
          <rect width="5" height="18" fill={accent} opacity="0.55" />
        </pattern>
      );
    case 'lace':
      return (
        <pattern id={id} width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="6" fill="none" stroke={accent} strokeWidth="1.6" />
          <circle cx="15" cy="15" r="1.8" fill={accent} />
          <circle cx="0" cy="0" r="3" fill="none" stroke={accent} strokeWidth="1.2" />
          <circle cx="30" cy="30" r="3" fill="none" stroke={accent} strokeWidth="1.2" />
        </pattern>
      );
    default:
      return null;
  }
}

export function Bow({ x, y, size = 1, color, knot }: { x: number; y: number; size?: number; color: string; knot?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path d="M0 0 C-14 -20 -42 -22 -40 -2 C-38 16 -14 10 0 0 Z" fill={color} />
      <path d="M0 0 C14 -20 42 -22 40 -2 C38 16 14 10 0 0 Z" fill={color} />
      <path d="M-3 3 L-18 40 L-8 36 L-2 44 L2 4 Z" fill={color} />
      <path d="M3 3 L18 40 L8 36 L2 44 L-2 4 Z" fill={color} opacity="0.9" />
      <path d="M-30 -8 C-22 -12 -12 -8 -6 -2" stroke="#fff" strokeOpacity="0.45" strokeWidth="2" fill="none" />
      <ellipse cx="0" cy="1" rx="6.5" ry="7.5" fill={knot ?? color} stroke="#000" strokeOpacity="0.08" />
    </g>
  );
}

export function Sparkle({ x, y, r = 10, color = '#fff', opacity = 0.9 }: { x: number; y: number; r?: number; color?: string; opacity?: number }) {
  return (
    <path
      d={`M${x} ${y - r} Q${x + r * 0.15} ${y - r * 0.15} ${x + r} ${y} Q${x + r * 0.15} ${y + r * 0.15} ${x} ${y + r} Q${x - r * 0.15} ${y + r * 0.15} ${x - r} ${y} Q${x - r * 0.15} ${y - r * 0.15} ${x} ${y - r} Z`}
      fill={color}
      opacity={opacity}
    />
  );
}

/** Prenda + percha como grupo SVG reutilizable dentro de composiciones mayores. */
export function GarmentShape({ art, idPrefix }: { art: ProductArt; idPrefix: string }) {
  const shape = shapes[art.kind];
  const patternId = `${idPrefix}-pattern`;
  const sheenId = `${idPrefix}-sheen`;
  const hasPattern = art.pattern !== 'solid';

  return (
    <g>
      <defs>
        {hasPattern && <PatternDef id={patternId} pattern={art.pattern} accent={art.accent} />}
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#000" stopOpacity="0.14" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.42" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      {/* Percha */}
      <g stroke="#b8a9b0" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d={`M200 ${shape.hangerY - 40} q0 -14 12 -14 q12 0 12 12 q0 10 -12 14 L200 ${shape.hangerY - 24}`} />
        <path d={`M200 ${shape.hangerY - 24} L130 ${shape.hangerY + 8} L270 ${shape.hangerY + 8} Z`} strokeLinejoin="round" />
      </g>

      {/* Sombra proyectada */}
      <ellipse cx="200" cy="470" rx="120" ry="12" fill="#000" opacity="0.07" />

      <path d={shape.body} fill={art.base} />
      {hasPattern && <path d={shape.body} fill={`url(#${patternId})`} />}
      <path d={shape.body} fill={`url(#${sheenId})`} />
      {shape.details && (
        <path d={shape.details} stroke="#000" strokeOpacity="0.14" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}

      {art.bow && (
        <Bow
          x={shape.bowAt[0]}
          y={shape.bowAt[1]}
          size={art.kind === 'dress' ? 1 : 0.8}
          color={art.base === art.accent || art.pattern === 'solid' ? art.accent : art.base}
          knot={art.accent}
        />
      )}
    </g>
  );
}

interface GarmentArtProps {
  art: ProductArt;
  title?: string;
  className?: string;
  /** 'cover' recorta para llenar el hueco; 'contain' muestra la ilustración entera (cajas anchas). */
  fit?: 'cover' | 'contain';
}

/** Ilustración completa de producto (fondo + prenda + brillos). */
export function GarmentArt({ art, title, className, fit = 'cover' }: GarmentArtProps) {
  const uid = useId().replace(/:/g, '');
  const bgId = `${uid}-bg`;

  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label={title} preserveAspectRatio={fit === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice'}>
      {title && <title>{title}</title>}
      <defs>
        <radialGradient id={bgId} cx="0.5" cy="0.35" r="0.85">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.55" stopColor={art.background} />
          <stop offset="1" stopColor={art.background} />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill={art.background} />
      <rect width="400" height="500" fill={`url(#${bgId})`} />
      <rect y="440" width="400" height="60" fill="#000" opacity="0.025" />
      <Sparkle x={70} y={90} r={9} color={art.accent === '#ffffff' ? art.base : art.accent} opacity={0.6} />
      <Sparkle x={338} y={140} r={6} color={art.accent === '#ffffff' ? art.base : art.accent} opacity={0.5} />
      <Sparkle x={330} y={400} r={8} color="#fff" />
      <GarmentShape art={art} idPrefix={uid} />
    </svg>
  );
}
