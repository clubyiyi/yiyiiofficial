import type { SVGProps } from 'react';

const paths = {
  search: 'M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.3-2.2L21 21',
  heart: 'M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.8 4 7.4 4c2 0 3.5 1.1 4.6 2.7C13.1 5.1 14.6 4 16.6 4c3.6 0 5.8 3.6 4.6 7.1-1.7 4.8-9.2 9.4-9.2 9.4Z',
  bag: 'M5 8h14l-1 12.5H6L5 8Zm3.5 0V6.5a3.5 3.5 0 0 1 7 0V8',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7.5 8.5c.8-3.7 3.8-6 7.5-6s6.7 2.3 7.5 6',
  menu: 'M3 6.5h18M3 12h18M3 17.5h18',
  close: 'M5 5l14 14M19 5L5 19',
  arrowRight: 'M4 12h15m-5-6 6 6-6 6',
  chevronLeft: 'M15 5l-7 7 7 7',
  chevronRight: 'M9 5l7 7-7 7',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z',
  truck: 'M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7M6.5 18.5a1.8 1.8 0 1 0 0-.1M17 18.5a1.8 1.8 0 1 0 0-.1',
  return: 'M4 9h11a5 5 0 0 1 0 10H8M4 9l4-4M4 9l4 4',
  gift: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.2C7 7 9 7 12 7Zm0 0c1.5-3 5-3.5 5-1.2C17 7 15 7 12 7Z',
  check: 'M5 12.5l4.5 4.5L19 7',
  chevronDown: 'M5 9l7 7 7-7',
  ruler: 'M3 15.5 15.5 3 21 8.5 8.5 21Z M7.5 11l2 2 M10.5 8l2 2 M13.5 5l2 2',
  sparkle: 'M12 3c.6 4.5 2.4 6.4 7 7-4.6.6-6.4 2.5-7 7-.6-4.5-2.4-6.4-7-7 4.6-.6 6.4-2.5 7-7Z',
} as const;

export type IconName = keyof typeof paths;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  filled?: boolean;
}

/** Iconos de trazo propios (sin dependencias). */
export function Icon({ name, size = 22, filled = false, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
