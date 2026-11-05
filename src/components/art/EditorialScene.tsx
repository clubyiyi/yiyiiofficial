import { useId } from 'react';
import type { ProductArt } from '@/types/commerce';
import { Bow, GarmentShape, Sparkle } from './GarmentArt';

/**
 * Composiciones editoriales originales (hero, campaña, banner) dibujadas en SVG.
 * Son marcadores de dirección de arte: sustitúyelas por fotografía real pasando `src`
 * a <EditorialMedia>.
 */
export type SceneVariant = 'hero' | 'satin' | 'coquette' | 'y2k' | 'lace';

interface SceneProps {
  variant: SceneVariant;
  title?: string;
  className?: string;
  /** Punto focal al recortar (p. ej. en móvil). */
  align?: 'xMidYMid' | 'xMaxYMid' | 'xMinYMid';
  /** Encuadre alternativo (p. ej. vertical en móvil) sin redibujar la escena. */
  viewBox?: string;
}

const place = (art: ProductArt, prefix: string, x: number, y: number, scale: number) => (
  <g transform={`translate(${x - 200 * scale} ${y}) scale(${scale})`}>
    <GarmentShape art={art} idPrefix={prefix} />
  </g>
);

const heartPath = (cx: number, cy: number, s: number) =>
  `M${cx} ${cy + 0.9 * s} C${cx - 1.4 * s} ${cy - 0.1 * s} ${cx - 1.1 * s} ${cy - 1.1 * s} ${cx - 0.5 * s} ${cy - 1.1 * s} C${cx - 0.2 * s} ${cy - 1.1 * s} ${cx} ${cy - 0.85 * s} ${cx} ${cy - 0.6 * s} C${cx} ${cy - 0.85 * s} ${cx + 0.2 * s} ${cy - 1.1 * s} ${cx + 0.5 * s} ${cy - 1.1 * s} C${cx + 1.1 * s} ${cy - 1.1 * s} ${cx + 1.4 * s} ${cy - 0.1 * s} ${cx} ${cy + 0.9 * s} Z`;

const starPath = (cx: number, cy: number, r: number) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const rad = (Math.PI / 5) * i - Math.PI / 2;
    const len = i % 2 === 0 ? r : r * 0.45;
    return `${(cx + Math.cos(rad) * len).toFixed(1)} ${(cy + Math.sin(rad) * len).toFixed(1)}`;
  });
  return `M${pts.join(' L')} Z`;
};

function Butterfly({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(-12)`} opacity="0.9">
      <path d="M0 0 C-30 -40 -60 -20 -40 6 C-60 20 -30 40 0 8 Z" fill={color} />
      <path d="M0 0 C30 -40 60 -20 40 6 C60 20 30 40 0 8 Z" fill={color} opacity="0.85" />
      <rect x="-2" y="-14" width="4" height="30" rx="2" fill="#5a3c4a" />
    </g>
  );
}

function PearlStrand({ d, count, from, to }: { d: (t: number) => [number, number]; count: number; from?: number; to?: number }) {
  const start = from ?? 0;
  const end = to ?? 1;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const [x, y] = d(start + ((end - start) * i) / (count - 1));
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="7" fill="#fffaf5" stroke="#e7d6da" strokeWidth="1" />
            <circle cx={x - 2} cy={y - 2.5} r="2" fill="#fff" />
          </g>
        );
      })}
    </g>
  );
}

export function EditorialScene({ variant, title, className, align = 'xMidYMid', viewBox }: SceneProps) {
  const uid = useId().replace(/:/g, '');
  const id = (name: string) => `${uid}-${name}`;
  const ratio = `${align} slice`;

  const chrome = (
    <linearGradient id={id('chrome')} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.3" stopColor="#f2d4e4" />
      <stop offset="0.5" stopColor="#ffffff" />
      <stop offset="0.72" stopColor="#d9c9f5" />
      <stop offset="1" stopColor="#fdf2f8" />
    </linearGradient>
  );
  const blur = (
    <filter id={id('blur')} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="40" />
    </filter>
  );

  if (variant === 'hero') {
    return (
      <svg viewBox={viewBox ?? '0 0 1600 900'} className={className} preserveAspectRatio={ratio} role="img" aria-label={title}>
        <defs>
          <linearGradient id={id('bg')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e0137a" />
            <stop offset="0.45" stopColor="#ff4fa3" />
            <stop offset="1" stopColor="#ffb3d4" />
          </linearGradient>
          <linearGradient id={id('ribbon')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffd1e6" />
            <stop offset="0.5" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ff9fcb" />
          </linearGradient>
          {chrome}
          {blur}
        </defs>
        <rect x="-400" y="-600" width="2400" height="2100" fill={`url(#${id('bg')})`} />
        <circle cx="300" cy="180" r="220" fill="#ffc6e0" opacity="0.35" filter={`url(#${id('blur')})`} />
        <circle cx="1450" cy="760" r="260" fill="#fff" opacity="0.35" filter={`url(#${id('blur')})`} />
        <text
          x="800"
          y="560"
          textAnchor="middle"
          fontFamily="Bodoni Moda, Georgia, serif"
          fontSize="330"
          fontStyle="italic"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.22"
          strokeWidth="2"
          letterSpacing="-8"
        >
          Dollhouse
        </text>
        {/* Arco del decorado */}
        <path d="M1040 900 V380 a260 260 0 0 1 520 0 V900 Z" fill="#ffe3f0" opacity="0.55" />
        <path d="M1080 900 V390 a220 220 0 0 1 440 0 V900 Z" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="3" />
        {/* Corazón cromado */}
        <path d={heartPath(1300, 380, 230)} fill={`url(#${id('chrome')})`} opacity="0.95" />
        <path d={heartPath(1300, 380, 230)} fill="none" stroke="#fff" strokeWidth="4" opacity="0.8" />
        {/* Cinta de satén */}
        <path
          d="M-20 760 C300 640 520 860 820 740 S1260 560 1620 700 C1700 720 1760 700 1800 690 L1800 750 C1700 760 1660 770 1620 760 C1280 640 1080 820 820 810 S280 720 -20 830 Z"
          fill={`url(#${id('ribbon')})`}
          opacity="0.85"
        />
        {place(
          { kind: 'dress', base: '#ff2e93', accent: '#ffffff', background: '#fff', pattern: 'solid', bow: true },
          id('dress'),
          1300,
          70,
          1.55,
        )}
        <rect x="-400" y="860" width="2400" height="700" fill="#b10a5f" opacity="0.18" />
        <Sparkle x={1040} y={180} r={22} />
        <Sparkle x={1540} y={260} r={14} />
        <Sparkle x={980} y={520} r={10} />
        <Sparkle x={1500} y={600} r={18} />
        <Sparkle x={720} y={140} r={12} opacity={0.6} />
        <Bow x={1530} y={130} size={1.3} color="#ffffff" knot="#ffd1e6" />
      </svg>
    );
  }

  if (variant === 'satin') {
    return (
      <svg viewBox="0 0 600 800" className={className} preserveAspectRatio={ratio} role="img" aria-label={title}>
        <defs>
          <linearGradient id={id('bg')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff6eb0" />
            <stop offset="1" stopColor="#e0137a" />
          </linearGradient>
          <linearGradient id={id('drape')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffb3d4" />
            <stop offset="0.4" stopColor="#ffe3f0" />
            <stop offset="0.6" stopColor="#ff9fcb" />
            <stop offset="1" stopColor="#ff4fa3" />
          </linearGradient>
        </defs>
        <rect width="600" height="800" fill={`url(#${id('bg')})`} />
        <path d="M0 0 C120 200 40 500 140 800 L0 800 Z" fill={`url(#${id('drape')})`} opacity="0.7" />
        <path d="M600 0 C470 220 570 520 460 800 L600 800 Z" fill={`url(#${id('drape')})`} opacity="0.7" />
        {place(
          { kind: 'dress', base: '#ffe3f0', accent: '#ff2e93', background: '#fff', pattern: 'solid', bow: true },
          id('g'),
          300,
          130,
          1.3,
        )}
        <Sparkle x={110} y={140} r={16} />
        <Sparkle x={500} y={220} r={10} />
        <Sparkle x={480} y={620} r={14} />
      </svg>
    );
  }

  if (variant === 'coquette') {
    return (
      <svg viewBox="0 0 600 800" className={className} preserveAspectRatio={ratio} role="img" aria-label={title}>
        <defs>
          <pattern id={id('gingham')} width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#fff" />
            <rect width="20" height="40" fill="#ff9fcb" opacity="0.5" />
            <rect width="40" height="20" fill="#ff9fcb" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="600" height="800" fill="#fbf3ee" />
        <path d="M0 600 L600 560 L600 800 L0 800 Z" fill={`url(#${id('gingham')})`} />
        <circle cx="300" cy="330" r="210" fill="#ffe3f0" />
        <PearlStrand d={(t) => [80 + t * 440, 90 + Math.sin(t * Math.PI) * 90]} count={20} />
        {place(
          { kind: 'top', base: '#ffc6e0', accent: '#ffffff', background: '#fff', pattern: 'dots', bow: true },
          id('g'),
          300,
          150,
          1.2,
        )}
        <Bow x={90} y={520} size={1.1} color="#ff6eb0" knot="#ffc6e0" />
        <Bow x={520} y={460} size={0.8} color="#ff6eb0" knot="#ffc6e0" />
        <path d={heartPath(500, 680, 30)} fill="#c8102e" />
        <path d={heartPath(110, 700, 22)} fill="#ff2e93" />
      </svg>
    );
  }

  if (variant === 'y2k') {
    return (
      <svg viewBox="0 0 600 800" className={className} preserveAspectRatio={ratio} role="img" aria-label={title}>
        <defs>
          <linearGradient id={id('bg')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d9c6ff" />
            <stop offset="0.5" stopColor="#ffd1e6" />
            <stop offset="1" stopColor="#c9e6ff" />
          </linearGradient>
          {chrome}
        </defs>
        <rect width="600" height="800" fill={`url(#${id('bg')})`} />
        <path d={starPath(130, 160, 80)} fill={`url(#${id('chrome')})`} stroke="#fff" strokeWidth="3" />
        <path d={starPath(500, 640, 60)} fill={`url(#${id('chrome')})`} stroke="#fff" strokeWidth="3" />
        <path d={starPath(480, 150, 30)} fill="#fff" opacity="0.8" />
        <ellipse cx="300" cy="420" rx="230" ry="60" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7" transform="rotate(-14 300 420)" />
        {place(
          { kind: 'skirt', base: '#ff2e93', accent: '#ffc6e0', background: '#fff', pattern: 'stripes', bow: true },
          id('g'),
          300,
          140,
          1.25,
        )}
        <Butterfly x={120} y={560} s={1.3} color="#c9e6ff" />
        <Butterfly x={470} y={330} s={0.9} color="#ff9fcb" />
        <Sparkle x={540} y={60} r={14} />
        <Sparkle x={70} y={700} r={12} />
      </svg>
    );
  }

  // lace — banner editorial apaisado
  return (
    <svg viewBox="0 0 1200 800" className={className} preserveAspectRatio={ratio} role="img" aria-label={title}>
      <defs>
        <pattern id={id('lace')} width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="14" fill="none" stroke="#f2c7d8" strokeWidth="2" />
          <circle cx="30" cy="30" r="4" fill="#f2c7d8" />
          <circle cx="0" cy="0" r="8" fill="none" stroke="#f2c7d8" strokeWidth="1.5" />
          <circle cx="60" cy="60" r="8" fill="none" stroke="#f2c7d8" strokeWidth="1.5" />
        </pattern>
        {chrome}
      </defs>
      <rect width="1200" height="800" fill="#fbf3ee" />
      <rect width="1200" height="800" fill={`url(#${id('lace')})`} opacity="0.6" />
      <path d="M380 800 V330 a220 220 0 0 1 440 0 V800 Z" fill="#ffe3f0" />
      <path d={heartPath(600, 360, 180)} fill={`url(#${id('chrome')})`} opacity="0.9" />
      {place(
        { kind: 'dress', base: '#fbf3ee', accent: '#f2c7d8', background: '#fff', pattern: 'lace', bow: true },
        id('g'),
        600,
        110,
        1.35,
      )}
      <PearlStrand d={(t) => [420 + t * 360, 250 + Math.sin(t * Math.PI) * 70]} count={16} />
      <Bow x={200} y={200} size={1.6} color="#ff9fcb" knot="#ffe3f0" />
      <Bow x={1000} y={600} size={1.2} color="#ff9fcb" knot="#ffe3f0" />
      <Sparkle x={960} y={180} r={18} color="#ff9fcb" />
      <Sparkle x={240} y={620} r={14} color="#ff9fcb" />
    </svg>
  );
}
