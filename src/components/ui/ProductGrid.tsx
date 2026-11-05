import type { Product } from '@/types/commerce';
import { useI18n } from '@/i18n/I18nProvider';
import { ProductCard } from './ProductCard';
import { Reveal } from './Reveal';
import { SkeletonCard } from './SkeletonCard';
import styles from './ProductGrid.module.css';

export function ProductGrid({ products, loading }: { products: Product[]; loading?: boolean }) {
  const { t } = useI18n();
  if (!loading && !products.length) return <p className={styles.empty}>{t('products.empty')}</p>;
  return (
    <ul className={styles.grid}>
      {loading
        ? Array.from({ length: 8 }, (_, i) => (
            <li key={i}>
              <SkeletonCard />
            </li>
          ))
        : products.map((product, i) => (
            <Reveal as="li" key={product.id} delay={(i % 4) * 0.06} y={20}>
              <ProductCard product={product} />
            </Reveal>
          ))}
    </ul>
  );
}
