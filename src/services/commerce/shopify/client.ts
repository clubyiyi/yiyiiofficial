import { shopifyConfig } from './config';

export class ShopifyError extends Error {}

/** Llamada GraphQL a Storefront API. Lanza ShopifyError ante errores HTTP o de GraphQL. */
export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(shopifyConfig.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': shopifyConfig.token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const hint =
      res.status === 401 || res.status === 403
        ? ' (revisa el token de Storefront y que la app esté instalada y con los alcances activos)'
        : '';
    throw new ShopifyError(`Shopify respondió ${res.status}${hint}`);
  }
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new ShopifyError(json.errors.map((e) => e.message).join(' · '));
  if (!json.data) throw new ShopifyError('Respuesta vacía de Shopify');
  return json.data;
}
