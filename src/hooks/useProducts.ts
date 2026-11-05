import { useEffect, useState } from 'react';
import { commerce } from '@/services/commerce';
import type { Product, ProductQuery } from '@/types/commerce';

interface State {
  products: Product[];
  loading: boolean;
  error: Error | null;
}

/** Hook de datos del catálogo. Cuando haya backend, puede migrarse a TanStack Query sin tocar los componentes. */
export function useProducts(query: ProductQuery): State {
  const key = JSON.stringify(query);
  const [state, setState] = useState<State>({ products: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    commerce
      .listProducts(JSON.parse(key) as ProductQuery)
      .then((products) => !cancelled && setState({ products, loading: false, error: null }))
      .catch((error: Error) => !cancelled && setState({ products: [], loading: false, error }));
    return () => {
      cancelled = true;
    };
  }, [key]);

  return state;
}
