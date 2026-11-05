import type { CartLine, Category, CategorySlug, Locale, Product, ProductQuery } from '@/types/commerce';

/**
 * Contrato que debe cumplir cualquier backend de comercio (mock, Shopify…).
 * La UI solo habla con esta interfaz: cambiar de proveedor no toca componentes.
 */
export interface CommerceAdapter {
  readonly name: string;
  /** true si el proveedor tiene un checkout real (la bolsa habilita el botón de pago). */
  readonly supportsCheckout: boolean;
  listProducts(query?: ProductQuery): Promise<Product[]>;
  getProductByHandle(handle: string): Promise<Product | null>;
  listCategories(): Promise<Category[]>;
  getCategory(slug: CategorySlug): Promise<Category | null>;
  /**
   * Crea el carrito en el proveedor con las líneas de la bolsa y devuelve la URL de su checkout seguro.
   * Devuelve null si no hay checkout real. Los pagos los procesa siempre el proveedor, nunca esta web.
   */
  getCheckoutUrl(lines: CartLine[], locale: Locale): Promise<string | null>;
}
