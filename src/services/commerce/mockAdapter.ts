import { demoCategories, demoProducts } from '@/data/demoProducts';
import type { CommerceAdapter } from './types';
import { queryProducts } from './queryProducts';

/** Simula la latencia de red para que los estados de carga sean realistas. */
const delay = <T,>(value: T, ms = 180) => new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const mockAdapter: CommerceAdapter = {
  name: 'mock',
  supportsCheckout: false,

  async listProducts(query = {}) {
    return delay(queryProducts(demoProducts, query));
  },

  async getProductByHandle(handle) {
    return delay(demoProducts.find((p) => p.handle === handle) ?? null);
  },

  async listCategories() {
    return delay(demoCategories);
  },

  async getCategory(slug) {
    return delay(demoCategories.find((c) => c.slug === slug) ?? null);
  },

  async getCheckoutUrl() {
    // Sin backend no hay checkout: nunca se simulan pagos.
    return null;
  },
};
