import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { commerce } from '@/services/commerce';
import type { CartLine, Money, Product, ProductVariant } from '@/types/commerce';
import { usePersistentState } from './usePersistentState';
import { isComingSoon } from '@/utils/launch';

/**
 * Bolsa local (localStorage). Con Shopify, las líneas guardan el id de variante de Shopify
 * y al pagar se crea el carrito remoto con `commerce.getCheckoutUrl()`.
 */
export interface ResolvedLine extends CartLine {
  product: Product;
  variant: ProductVariant;
  lineTotal: Money;
}

interface CartValue {
  lines: ResolvedLine[];
  count: number;
  subtotal: Money;
  add: (product: Product, variantId?: string, quantity?: number) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);
const MAX_QTY = 10;

export function CartProvider({ children }: { children: ReactNode }) {
  // Una bolsa por proveedor: los ids del catálogo local y de Shopify no se mezclan.
  const [rawLines, setRawLines] = usePersistentState<CartLine[]>(`mc.cart.${commerce.name}`, []);
  const { products } = useProducts({});
  const productIndex = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const maxFor = useCallback(
    (line: CartLine) => {
      const stock = productIndex.get(line.productId)?.variants.find((v) => v.id === line.variantId)?.stock;
      return Math.min(MAX_QTY, stock ?? MAX_QTY);
    },
    [productIndex],
  );

  const add = useCallback(
    (product: Product, variantId?: string, quantity = 1) => {
      if (isComingSoon(product)) return; // aún no se vende
      const variant =
        product.variants.find((v) => v.id === variantId) ?? product.variants.find((v) => v.available);
      if (!variant) return;
      const max = Math.min(MAX_QTY, variant.stock ?? MAX_QTY);
      setRawLines((lines) => {
        const existing = lines.find((l) => l.variantId === variant.id);
        if (existing) {
          return lines.map((l) =>
            l.id === existing.id ? { ...l, quantity: Math.min(max, l.quantity + quantity) } : l,
          );
        }
        return [...lines, { id: variant.id, productId: product.id, variantId: variant.id, quantity: Math.min(max, quantity) }];
      });
    },
    [setRawLines],
  );

  const setQuantity = useCallback(
    (lineId: string, quantity: number) =>
      setRawLines((lines) =>
        quantity <= 0
          ? lines.filter((l) => l.id !== lineId)
          : lines.map((l) => (l.id === lineId ? { ...l, quantity: Math.min(maxFor(l), quantity) } : l)),
      ),
    [setRawLines, maxFor],
  );

  const remove = useCallback(
    (lineId: string) => setRawLines((lines) => lines.filter((l) => l.id !== lineId)),
    [setRawLines],
  );

  const clear = useCallback(() => setRawLines([]), [setRawLines]);

  const value = useMemo<CartValue>(() => {
    // Hasta que llega el catálogo las líneas no se pueden resolver (pero siguen guardadas).
    const lines = rawLines.flatMap<ResolvedLine>((line) => {
      const product = productIndex.get(line.productId);
      const variant = product?.variants.find((v) => v.id === line.variantId);
      if (!product || !variant || isComingSoon(product)) return [];
      return [
        {
          ...line,
          product,
          variant,
          lineTotal: { amount: product.price.amount * line.quantity, currency: product.price.currency },
        },
      ];
    });
    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: {
        amount: lines.reduce((sum, l) => sum + l.lineTotal.amount, 0),
        currency: lines[0]?.product.price.currency ?? 'PEN',
      },
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [rawLines, productIndex, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
