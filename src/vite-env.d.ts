/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMMERCE_PROVIDER?: 'mock' | 'shopify';
  readonly VITE_ROUTER?: 'browser' | 'memory';
  readonly VITE_SHOPIFY_STORE_DOMAIN?: string;
  readonly VITE_SHOPIFY_STOREFRONT_TOKEN?: string;
  readonly VITE_SHOPIFY_API_VERSION?: string;
  readonly VITE_SHOPIFY_COUNTRY?: string;
  readonly VITE_SHOPIFY_INVENTORY?: 'true' | 'false';
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
