import { motion } from 'motion/react';
import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { ProductRail } from '@/components/ui/ProductRail';
import { SectionHeader } from '@/components/ui/SectionHeader';
import styles from './NewArrivals.module.css';

const tabs = [
  { id: 'new-in', labelKey: 'products.tabs.newIn' },
  { id: 'trending', labelKey: 'products.tabs.trending' },
  { id: 'featured', labelKey: 'products.tabs.featured' },
] as const;

/** Novedades y destacados: pestañas por colección + carrusel de tarjetas. */
export function NewArrivals() {
  const { t } = useI18n();
  const [active, setActive] = useState<(typeof tabs)[number]['id']>('new-in');
  const { products, loading } = useProducts({ collection: active, sort: 'newest' });

  return (
    <section className={`container ${styles.section}`} id="novedades" aria-labelledby="new-title">
      <SectionHeader
        id="new-title"
        eyebrow="Fresh drop"
        title={t('products.sectionTitle')}
        action={
          <Button to="/c/dresses" variant="outline" arrow>
            {t('common.viewAll')}
          </Button>
        }
      />
      <div className={styles.tabs} role="tablist" aria-label={t('products.sectionTitle')}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            className={`${styles.tab} ${active === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {t(tab.labelKey)}
            {active === tab.id && <motion.span layoutId="tab-indicator" className={styles.indicator} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          </button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <ProductRail products={products} loading={loading} label={t('products.sectionTitle')} />
      </motion.div>
    </section>
  );
}
