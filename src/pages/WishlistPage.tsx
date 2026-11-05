import { useI18n } from '@/i18n/I18nProvider';
import { useProducts } from '@/hooks/useProducts';
import { useWishlist } from '@/store/WishlistContext';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { SectionHeader } from '@/components/ui/SectionHeader';
import styles from './WishlistPage.module.css';

export function WishlistPage() {
  const { t } = useI18n();
  const { ids } = useWishlist();
  const { products, loading } = useProducts({ ids });

  return (
    <div className={`container ${styles.page}`}>
      <SectionHeader eyebrow="xoxo" title={t('wishlist.title')} />
      {ids.length ? (
        <ProductGrid products={products} loading={loading} />
      ) : (
        <div className={styles.empty}>
          <p>{t('wishlist.empty')}</p>
          <Button to="/#novedades" variant="pink" arrow>
            {t('cart.emptyCta')}
          </Button>
        </div>
      )}
    </div>
  );
}
