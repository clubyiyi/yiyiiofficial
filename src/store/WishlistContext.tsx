import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { usePersistentState } from './usePersistentState';

interface WishlistValue {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
}

const WishlistContext = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = usePersistentState<string[]>('mc.wishlist', []);

  const toggle = useCallback(
    (productId: string) =>
      setIds((list) => (list.includes(productId) ? list.filter((id) => id !== productId) : [...list, productId])),
    [setIds],
  );

  const value = useMemo(() => ({ ids, has: (id: string) => ids.includes(id), toggle }), [ids, toggle]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
