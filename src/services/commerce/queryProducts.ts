import type { Product, ProductQuery } from '@/types/commerce';

/** Filtros, búsqueda y orden del catálogo. Lo comparten todos los adaptadores que cargan el catálogo en memoria. */
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const matchesSearch = (product: Product, term: string) => {
  const haystack = normalize(
    [product.name.es, product.name.en, product.colorName.es, product.colorName.en, product.category].join(' '),
  );
  return normalize(term)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
};

export function queryProducts(products: Product[], query: ProductQuery = {}): Product[] {
  let result = [...products];
  if (query.category) result = result.filter((p) => p.category === query.category);
  if (query.collection) result = result.filter((p) => p.collections.includes(query.collection!));
  if (query.onSale) result = result.filter((p) => Boolean(p.compareAtPrice));
  if (query.ids) result = result.filter((p) => query.ids!.includes(p.id));
  if (query.search?.trim()) result = result.filter((p) => matchesSearch(p, query.search!));

  switch (query.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price.amount - b.price.amount);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price.amount - a.price.amount);
      break;
    case 'newest':
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
  }
  return query.limit ? result.slice(0, query.limit) : result;
}
