/**
 * Configuración de Shopify Storefront API (variables en `.env.local`, ver `.env.example`).
 * El token de Storefront es *público* por diseño: puede ir en el navegador.
 * Nunca pongas aquí un token de Admin API (empieza por `shpat_`).
 */
const domain = (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN ?? '').replace(/^https?:\/\//, '').replace(/\/+$/, '');
const rawToken = (import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN ?? '').trim();
/** El texto de ejemplo de `.env.local` cuenta como «sin token». */
const token = /^PEGA_AQUI/i.test(rawToken) ? '' : rawToken;
const apiVersion = import.meta.env.VITE_SHOPIFY_API_VERSION || '2025-10';

if (token.startsWith('shpat_')) {
  console.error('[shopify] VITE_SHOPIFY_STOREFRONT_TOKEN parece un token de Admin API. Usa el token público de Storefront.');
}

export const shopifyConfig = {
  domain,
  token,
  apiVersion,
  endpoint: `https://${domain}/api/${apiVersion}/graphql.json`,
  /** País de compra: fija moneda (PEN) y disponibilidad del mercado. */
  country: import.meta.env.VITE_SHOPIFY_COUNTRY || 'PE',
  isConfigured: Boolean(domain && token && !token.startsWith('shpat_')),
};
