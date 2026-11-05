import type { Product, ProductVariant } from '@/types/commerce';

/** Variantes (tallas) del color indicado; si la prenda no tiene colores, todas. */
export const variantsForColor = (product: Product, colorId?: string): ProductVariant[] =>
  product.colors ? product.variants.filter((v) => v.color === (colorId ?? product.colors![0].id)) : product.variants;

/** Nombre del color de una variante (o el color general de la prenda). */
export const colorOf = (product: Product, variant?: ProductVariant) =>
  product.colors?.find((c) => c.id === variant?.color)?.name ?? product.colorName;
