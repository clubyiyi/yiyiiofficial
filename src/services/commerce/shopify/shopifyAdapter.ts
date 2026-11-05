import { demoCategories } from '@/data/demoProducts';
import type { Locale, Product } from '@/types/commerce';
import type { CommerceAdapter } from '../types';
import { queryProducts } from '../queryProducts';
import { storefront, ShopifyError } from './client';
import { shopifyConfig } from './config';
import { mapProduct } from './mapProduct';
import { cartCreateMutation, productsQuery, type ShopifyProduct } from './queries';

const withInventory = import.meta.env.VITE_SHOPIFY_INVENTORY === 'true';
const LANGUAGE: Record<Locale, string> = { es: 'ES', en: 'EN' };

async function fetchAll(language: string): Promise<ShopifyProduct[]> {
  const all: ShopifyProduct[] = [];
  let after: string | null = null;
  do {
    const data: { products: { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: ShopifyProduct[] } } =
      await storefront(productsQuery(withInventory), { first: 50, after, country: shopifyConfig.country, language });
    all.push(...data.products.nodes);
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (after);
  return all;
}

/**
 * Catálogo completo en memoria: se pide una vez por visita (en español y en inglés)
 * y los filtros, la búsqueda y el orden se resuelven en el navegador, igual que en el modo local.
 * Pensado para catálogos de boutique (cientos de prendas, no decenas de miles).
 */
let catalog: Promise<Product[]> | null = null;
function loadCatalog(): Promise<Product[]> {
  catalog ??= Promise.all([fetchAll(LANGUAGE.es), fetchAll(LANGUAGE.en).catch(() => [])])
    .then(([es, en]) => {
      const enById = new Map(en.map((p) => [p.id, p]));
      return es.filter((p) => p.variants.nodes.length).map((p) => mapProduct(p, enById.get(p.id)));
    })
    .catch((err) => {
      catalog = null; // permite reintentar en la siguiente navegación
      console.error('[shopify] No se pudo cargar el catálogo:', err);
      throw err;
    });
  return catalog;
}

export const shopifyAdapter: CommerceAdapter = {
  name: 'shopify',
  supportsCheckout: true,

  async listProducts(query = {}) {
    return queryProducts(await loadCatalog(), query);
  },

  async getProductByHandle(handle) {
    return (await loadCatalog()).find((p) => p.handle === handle) ?? null;
  },

  // Las categorías (portadas y banners) son parte del diseño y viven en el código.
  async listCategories() {
    return demoCategories;
  },

  async getCategory(slug) {
    return demoCategories.find((c) => c.slug === slug) ?? null;
  },

  /** Crea un carrito de Shopify con la bolsa y devuelve su checkout (alcance unauthenticated_write_checkouts). */
  async getCheckoutUrl(lines, locale) {
    if (!lines.length) return null;
    const data = await storefront<{
      cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
    }>(cartCreateMutation, {
      input: {
        lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
        buyerIdentity: { countryCode: shopifyConfig.country },
      },
      country: shopifyConfig.country,
      language: LANGUAGE[locale],
    });
    const { cart, userErrors } = data.cartCreate;
    if (userErrors.length || !cart) throw new ShopifyError(userErrors.map((e) => e.message).join(' · ') || 'Sin carrito');
    return cart.checkoutUrl;
  },
};
