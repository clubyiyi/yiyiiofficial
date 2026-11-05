/**
 * Modelo de dominio de la tienda. Es independiente del proveedor:
 * cada adaptador (mock, Shopify, Medusa, commercetools…) traduce su API a estos tipos.
 */

export type Locale = 'es' | 'en';

/** Texto traducible que llega del catálogo. Un backend real puede devolverlo ya resuelto por locale. */
export type LocalizedText = Record<Locale, string>;

export type CategorySlug = 'dresses' | 'tops' | 'skirts' | 'shorts' | 'corsets';

export interface Money {
  /** Importe en la unidad menor (céntimos) para evitar errores de coma flotante. */
  amount: number;
  currency: string;
}

export type GarmentKind = 'dress' | 'top' | 'skirt' | 'shorts' | 'corset';
export type ArtPattern = 'solid' | 'gingham' | 'dots' | 'hearts' | 'stripes' | 'lace';

/** Dirección de arte para la ilustración demo cuando no hay fotografía. */
export interface ProductArt {
  kind: GarmentKind;
  base: string;
  accent: string;
  background: string;
  pattern: ArtPattern;
  bow?: boolean;
}

export interface ProductImage {
  /** Ruta o URL de la foto real. Si falta, se pinta `art`. */
  src?: string;
  /** Versión WebP opcional de la foto (más ligera). */
  webp?: string;
  /** Punto focal al recortar la foto en la tarjeta 4:5 (CSS object-position). */
  focus?: string;
  /** Acercamiento de la foto en la tarjeta (1 = sin zoom) para igualar encuadres entre productos. */
  zoom?: number;
  alt: LocalizedText;
  art: ProductArt;
}

export interface ProductVariant {
  id: string;
  size: string;
  available: boolean;
  /** Unidades disponibles. Si es baja (≤ 5) la ficha muestra un aviso de urgencia. */
  stock?: number;
  /** Id del color al que pertenece (solo en prendas con varios colores). */
  color?: string;
}

export interface ProductColor {
  id: string;
  name: LocalizedText;
  /** Color de la muestra circular. */
  swatch: string;
  /** Índice de la foto de este color en `images`. */
  image: number;
}

export type ProductBadge = 'new' | 'bestseller' | 'limited' | 'sale';

export interface Product {
  id: string;
  /** Prefijo DEMO: identifica que no es un artículo real. */
  sku: string;
  handle: string;
  isDemo: boolean;
  name: LocalizedText;
  description: LocalizedText;
  category: CategorySlug;
  /** Nombre de la paleta, p. ej. "Rosa chicle". */
  colorName: LocalizedText;
  price: Money;
  compareAtPrice?: Money;
  images: ProductImage[];
  /** Colores disponibles (si la prenda tiene varios). Cada variante indica su color. */
  colors?: ProductColor[];
  variants: ProductVariant[];
  badges: ProductBadge[];
  collections: string[];
  createdAt: string;
}

export interface Category {
  slug: CategorySlug;
  /** Clave del diccionario i18n para nombre y descripción. */
  i18nKey: string;
  heroArt: ProductArt;
  /** Foto de la tarjeta en «Compra por categoría». Sin ella se muestra `heroArt`. */
  cover?: {
    src: string;
    webp?: string;
    /** Punto focal al recortar (CSS object-position). */
    focus?: string;
  };
  /** Foto del banner de la página de categoría. Sin ella se muestra `heroArt`. */
  banner?: {
    src: string;
    webp?: string;
    /** Punto focal al recortar (CSS object-position). */
    focus?: string;
    /** Lado del texto en escritorio, para no tapar a la modelo (por defecto 'left'). */
    textSide?: 'left' | 'right';
    alt: LocalizedText;
  };
}

export interface CartLine {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
}

export interface ProductQuery {
  category?: CategorySlug;
  collection?: string;
  search?: string;
  ids?: string[];
  onSale?: boolean;
  limit?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc';
}
