import { brand } from '@/config/brand';
import type { Product } from '@/types/commerce';

/**
 * «Próximo lanzamiento»: con `brand.comingSoonUnlessOnSale`, toda prenda que no está en rebaja
 * se muestra como próximo lanzamiento y no se puede comprar.
 * Para lanzarla: ponle la etiqueta `disponible` en Shopify (o un precio de comparación).
 */
export const isComingSoon = (product: Product) =>
  brand.comingSoonUnlessOnSale && !product.compareAtPrice && !product.collections.includes('disponible');
