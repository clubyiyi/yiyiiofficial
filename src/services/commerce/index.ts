import { mockAdapter } from './mockAdapter';
import { shopifyAdapter } from './shopify/shopifyAdapter';
import { shopifyConfig } from './shopify/config';
import type { CommerceAdapter } from './types';

const provider = import.meta.env.VITE_COMMERCE_PROVIDER ?? 'mock';

function pick(): CommerceAdapter {
  if (provider === 'shopify') {
    if (shopifyConfig.isConfigured) return shopifyAdapter;
    console.warn(
      '[commerce] VITE_COMMERCE_PROVIDER=shopify pero faltan VITE_SHOPIFY_STORE_DOMAIN o VITE_SHOPIFY_STOREFRONT_TOKEN. Se usa el catálogo local.',
    );
  }
  return mockAdapter;
}

export const commerce: CommerceAdapter = pick();
export type { CommerceAdapter } from './types';
