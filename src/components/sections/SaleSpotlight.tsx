import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { ProductRail } from '@/components/ui/ProductRail';
import styles from './SaleSpotlight.module.css';

/** Bloque de rebajas de la portada: cinta animada, titular y carrusel de prendas rebajadas. */
export function SaleSpotlight() {
  const { t } = useI18n();
  const { products, loading } = useProducts({ onSale: true, sort: 'price-asc' });
  const available = useMemo(
    () => products.filter((p) => p.variants.some((v) => v.available)),
    [products],
  );
  // El descuento anunciado sale de los precios reales: nunca promete más de lo que hay.
  const maxOff = useMemo(
    () =>
      available.reduce((max, p) => {
        if (!p.compareAtPrice) return max;
        return Math.max(max, Math.round((1 - p.price.amount / p.compareAtPrice.amount) * 100));
      }, 0),
    [available],
  );

  if (!loading && available.length === 0) return null;

  const ticker = Array.from({ length: 8 }, (_, i) => (
    <span key={i}>
      {t('saleSpot.ticker')} <i>✦</i>
    </span>
  ));

  return (
    <section className={styles.section} aria-labelledby="sale-spot-title">
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {ticker}
          {ticker}
        </div>
      </div>

      <div className={`container ${styles.inner}`}>
        <motion.header
          className={styles.head}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className={styles.eyebrow}>{t('saleSpot.eyebrow')}</p>
            <h2 id="sale-spot-title" className={styles.title}>
              {t('saleSpot.title')}
            </h2>
          </div>
          {maxOff > 0 && (
            <motion.div
              className={styles.stamp}
              initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
              whileInView={{ scale: 1, rotate: -8, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.25 }}
            >
              <span className={styles.stampUp}>{t('saleSpot.upTo')}</span>
              <span className={styles.stampPct}>−{maxOff}%</span>
            </motion.div>
          )}
          <div className={styles.copy}>
            <p className={styles.text}>{t('saleSpot.text')}</p>
            <Button to="/c/sale" variant="light" arrow>
              {t('saleSpot.cta')}
            </Button>
          </div>
        </motion.header>

        <div className={styles.rail}>
          <ProductRail products={available} loading={loading} label={t('saleSpot.title')} />
        </div>
      </div>
    </section>
  );
}
