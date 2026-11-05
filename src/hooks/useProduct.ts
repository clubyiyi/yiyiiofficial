import { useEffect, useState } from 'react';
import { commerce } from '@/services/commerce';
import type { Product } from '@/types/commerce';

/** Carga una prenda por su handle (URL). `product` es null si no existe. */
export function useProduct(handle: string) {
  const [state, setState] = useState<{ product: Product | null; loading: boolean }>({ product: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    setState({ product: null, loading: true });
    commerce.getProductByHandle(handle).then((product) => !cancelled && setState({ product, loading: false }));
    return () => {
      cancelled = true;
    };
  }, [handle]);

  return state;
}
