import { demoCategories } from '@/data/demoProducts';
import { shopifyFraming } from '@/data/shopifyFraming';
import type {
  CategorySlug,
  LocalizedText,
  Money,
  Product,
  ProductBadge,
  ProductColor,
  ProductImage,
  ProductVariant,
} from '@/types/commerce';
import type { ShopifyMoney, ShopifyProduct } from './queries';

/**
 * Traduce un producto de Storefront API al modelo de la tienda.
 *
 * Convenciones en el admin de Shopify:
 * - Categoría: «Tipo de producto» (Vestidos, Tops, Corsets, Faldas, Shorts) o etiqueta `categoria:vestidos`.
 * - Pestañas del inicio: colecciones con identificador `new-in`, `trending`, `featured` (o etiquetas con esos nombres).
 * - Insignias: etiquetas `nuevo`, `mas-vendido`, `edicion-limitada`. «Rebaja» sale sola si hay «Precio de comparación».
 * - Opciones: «Color» y «Talla». Asigna a cada variante la foto de su color para que el selector cambie la imagen.
 */

const CATEGORY_ALIASES: Record<CategorySlug, string[]> = {
  dresses: ['dresses', 'dress', 'vestido', 'vestidos'],
  tops: ['tops', 'top', 'blusa', 'blusas', 'cardigan', 'cárdigan', 'cardigans'],
  corsets: ['corsets', 'corset', 'corsé', 'corse', 'corsés'],
  skirts: ['skirts', 'skirt', 'falda', 'faldas', 'set', 'sets'],
  shorts: ['shorts', 'short'],
};

const BADGE_TAGS: Record<string, ProductBadge> = {
  new: 'new',
  nuevo: 'new',
  bestseller: 'bestseller',
  'mas-vendido': 'bestseller',
  'más vendido': 'bestseller',
  limited: 'limited',
  'edicion-limitada': 'limited',
  'edición limitada': 'limited',
};

const COLOR_OPTION = /^(colou?r|color)$/i;
const SIZE_OPTION = /^(talla|size|tamaño)$/i;

/** Color de muestra cuando Shopify no trae swatch para el valor. */
const SWATCH_FALLBACK: Record<string, string> = {
  rosa: '#f4a6c1', pink: '#f4a6c1', fucsia: '#e0399b', blanco: '#ffffff', white: '#ffffff',
  negro: '#111111', black: '#111111', rojo: '#d22a3a', red: '#d22a3a', celeste: '#9fd3f0',
  azul: '#3c64c8', blue: '#3c64c8', lila: '#c8a8e8', morado: '#8a4fbf', verde: '#7fbf8a',
  amarillo: '#f6d65a', beige: '#e8d6bd', marrón: '#7a4b32', marron: '#7a4b32', brown: '#7a4b32',
  crema: '#f3e9d6', gris: '#9a9a9a', grey: '#9a9a9a', gray: '#9a9a9a',
};

const slug = (v: string) =>
  v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const toMoney = (m: ShopifyMoney): Money => ({
  amount: Math.round(parseFloat(m.amount) * 100),
  currency: m.currencyCode,
});

const loc = (es: string, en?: string): LocalizedText => ({ es, en: en || es });

function categoryOf(p: ShopifyProduct): CategorySlug {
  const candidates = [
    p.productType,
    ...p.tags.map((t) => t.replace(/^(categoria|category|cat):/i, '')),
  ].map((v) => v.trim().toLowerCase());
  for (const value of candidates) {
    for (const [cat, aliases] of Object.entries(CATEGORY_ALIASES)) {
      if (aliases.includes(value)) return cat as CategorySlug;
    }
  }
  console.warn(`[shopify] «${p.title}» no tiene categoría reconocible (Tipo de producto o etiqueta). Se muestra en Tops.`);
  return 'tops';
}

/** `es` es el producto en español; `en`, la misma consulta en inglés (si la tienda tiene traducciones). */
export function mapProduct(es: ShopifyProduct, en?: ShopifyProduct): Product {
  const category = categoryOf(es);
  const art = demoCategories.find((c) => c.slug === category)!.heroArt;
  const tags = es.tags.map((t) => t.trim().toLowerCase());

  const colorOpt = es.options.find((o) => COLOR_OPTION.test(o.name));
  const colorOptEn = en?.options.find((o) => o.name === colorOpt?.name) ?? en?.options[es.options.indexOf(colorOpt!)];
  const sizeOpt = es.options.find((o) => SIZE_OPTION.test(o.name));

  const fileName = (url: string) => url.split('?')[0].split('/').pop() ?? '';
  const images: ProductImage[] = es.images.nodes.map((img, i) => ({
    src: img.url,
    webp: img.webp,
    frame: shopifyFraming[es.handle]?.[fileName(img.original)],
    alt: loc(img.altText || es.title, en?.images.nodes[i]?.altText || en?.title),
    art,
  }));
  if (!images.length) images.push({ alt: loc(es.title, en?.title), art });
  const imageIndex = (id?: string) => Math.max(0, es.images.nodes.findIndex((n) => n.id === id));

  // Colores: solo si la prenda tiene más de uno.
  let colors: ProductColor[] | undefined;
  if (colorOpt && colorOpt.optionValues.length > 1) {
    colors = colorOpt.optionValues.map((v, i) => {
      const variant = es.variants.nodes.find((n) =>
        n.selectedOptions.some((o) => o.name === colorOpt.name && o.value === v.name),
      );
      return {
        id: slug(v.name),
        name: loc(v.name, colorOptEn?.optionValues[i]?.name),
        swatch: v.swatch?.color ?? SWATCH_FALLBACK[v.name.toLowerCase()] ?? '#f4a6c1',
        image: imageIndex(variant?.image?.id),
      };
    });
  }

  const variants: ProductVariant[] = es.variants.nodes.map((v) => {
    const opt = (name?: string) => v.selectedOptions.find((o) => o.name === name)?.value;
    const colorValue = opt(colorOpt?.name);
    return {
      id: v.id,
      // Sin opción «Talla» la prenda es de talla única (nunca se usa el título de la variante, que puede ser el color).
      size: opt(sizeOpt?.name) ?? 'Única',
      available: v.availableForSale,
      // `quantityAvailable` solo llega con el alcance unauthenticated_read_product_inventory.
      stock: v.quantityAvailable ?? undefined,
      color: colors && colorValue ? slug(colorValue) : undefined,
    };
  });

  // Precio: el de la primera variante disponible (o la primera).
  const ref = es.variants.nodes.find((v) => v.availableForSale) ?? es.variants.nodes[0];
  const price = toMoney(ref.price);
  const compareAt = ref.compareAtPrice ? toMoney(ref.compareAtPrice) : undefined;
  const compareAtPrice = compareAt && compareAt.amount > price.amount ? compareAt : undefined;

  const badges = [...new Set(tags.map((t) => BADGE_TAGS[t]).filter(Boolean))];
  if (compareAtPrice) badges.push('sale');

  const collections = [...new Set([...es.collections.nodes.map((c) => c.handle), ...tags])];

  const singleColor = colorOpt?.optionValues.length === 1 ? colorOpt.optionValues[0].name : '';

  return {
    id: es.id,
    sku: ref.sku || es.handle.toUpperCase(),
    handle: es.handle,
    isDemo: false,
    name: loc(es.title, en?.title),
    description: loc(es.description, en?.description),
    category,
    colorName: loc(singleColor, colorOptEn?.optionValues[0]?.name),
    price,
    compareAtPrice,
    images,
    colors,
    variants,
    badges,
    collections,
    createdAt: es.publishedAt,
  };
}
