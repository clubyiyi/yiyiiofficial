import type { CategorySlug } from '@/types/commerce';

export type MeasureKey = 'bustWidth' | 'bust' | 'waist' | 'hips' | 'length' | 'totalLength';

/** Orden de tallas de la tabla. */
export const guideSizes = ['XS', 'S', 'M', 'L', 'XL'];

/**
 * Medidas de prenda en cm por categoría (una fila por medida, un valor por talla de `guideSizes`).
 * VALORES DE EJEMPLO: sustitúyelos por las medidas reales de tu patronaje.
 * El número de cada fila coincide con el número del dibujo.
 */
export const sizeGuides: Record<CategorySlug, { key: MeasureKey; values: number[] }[]> = {
  tops: [
    { key: 'bustWidth', values: [60, 64, 68, 72, 76] },
    { key: 'waist', values: [56, 59, 64, 68, 72] },
    { key: 'length', values: [43, 45, 47, 49, 51] },
  ],
  corsets: [
    { key: 'bust', values: [76, 80, 84, 88, 92] },
    { key: 'waist', values: [60, 64, 68, 72, 76] },
    { key: 'length', values: [36, 37, 38, 39, 40] },
  ],
  dresses: [
    { key: 'bust', values: [80, 84, 88, 92, 96] },
    { key: 'waist', values: [62, 66, 70, 74, 78] },
    { key: 'totalLength', values: [88, 89, 90, 91, 92] },
  ],
  skirts: [
    { key: 'waist', values: [62, 66, 70, 74, 78] },
    { key: 'hips', values: [86, 90, 94, 98, 102] },
    { key: 'totalLength', values: [38, 39, 40, 41, 42] },
  ],
  shorts: [
    { key: 'waist', values: [62, 66, 70, 74, 78] },
    { key: 'hips', values: [86, 90, 94, 98, 102] },
    { key: 'totalLength', values: [24, 25, 26, 27, 28] },
  ],
};
