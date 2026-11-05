import { useEffect, useRef, useState } from 'react';
import type { Product } from '@/types/commerce';
import { useI18n } from '@/i18n/I18nProvider';
import { Icon } from './Icon';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from './SkeletonCard';
import styles from './ProductRail.module.css';

interface Props {
  products: Product[];
  loading?: boolean;
  label: string;
}

/** Carrusel horizontal con scroll-snap y flechas (patrón de "Nuevos lanzamientos"). */
export function ProductRail({ products, loading, label }: Props) {
  const { t } = useI18n();
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = () => {
    const el = track.current;
    if (!el) return;
    const start = el.scrollLeft < 8;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  };

  useEffect(update, [products, loading]);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className={styles.rail}>
      <ul ref={track} className={styles.track} aria-label={label} onScroll={update}>
        {loading
          ? Array.from({ length: 5 }, (_, i) => (
              <li key={i} className={styles.item}>
                <SkeletonCard />
              </li>
            ))
          : products.map((product) => (
              <li key={product.id} className={styles.item}>
                <ProductCard product={product} />
              </li>
            ))}
      </ul>
      <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => scroll(-1)} disabled={edges.start} aria-label={t('common.previous')}>
        <Icon name="chevronLeft" />
      </button>
      <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => scroll(1)} disabled={edges.end} aria-label={t('common.next')}>
        <Icon name="chevronRight" />
      </button>
    </div>
  );
}
