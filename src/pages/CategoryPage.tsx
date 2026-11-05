import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { categoryOrder } from '@/config/brand';
import { demoCategories } from '@/data/demoProducts';
import { useI18n } from '@/i18n/I18nProvider';
import { useProducts } from '@/hooks/useProducts';
import type { CategorySlug, ProductQuery } from '@/types/commerce';
import { GarmentArt } from '@/components/art/GarmentArt';
import { ProductGrid } from '@/components/ui/ProductGrid';
import styles from './CategoryPage.module.css';

type Sort = NonNullable<ProductQuery['sort']>;
const sorts: Sort[] = ['newest', 'price-asc', 'price-desc'];

export function CategoryPage() {
  const { slug = '' } = useParams();
  const { t, tp, tr } = useI18n();
  const [sort, setSort] = useState<Sort>('newest');
  const isSale = slug === 'sale';
  const category = demoCategories.find((c) => c.slug === slug);
  const valid = isSale || Boolean(category);
  const banner = category?.banner;

  const { products, loading } = useProducts(
    isSale ? { onSale: true, sort } : { category: (category?.slug ?? 'dresses') as CategorySlug, sort },
  );

  if (!valid) {
    return (
      <div className={`container ${styles.notFound}`}>
        <p>{t('category.notFound')}</p>
        <Link to="/">{t('nav.home')}</Link>
      </div>
    );
  }

  const title = isSale ? t('nav.sale') : t(`categories.${category!.slug}.name`);
  const description = isSale ? t('category.saleDescription') : t(`categories.${category!.slug}.description`);

  return (
    <div className={styles.page}>
      {/* Con foto: banner a sangre como el de la portada. Sin foto: banner rosa con ilustración. */}
      <header className={`${styles.banner} ${banner ? styles.hero : ''} ${banner?.textSide === 'right' ? styles.heroRight : ''}`}>
        {banner && (
          <>
            <motion.div
              className={styles.heroMedia}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <picture>
                {banner.webp && <source srcSet={banner.webp} type="image/webp" />}
                <img
                  src={banner.src}
                  alt={tr(banner.alt)}
                  className={styles.heroImg}
                  style={{ objectPosition: banner.focus }}
                  decoding="async"
                />
              </picture>
            </motion.div>
            <div className={styles.heroScrim} />
          </>
        )}
        <div className={`container ${styles.bannerInner}`}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: banner ? 0.3 : 0 }}>
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <Link to="/">{t('nav.home')}</Link> / <span>{title}</span>
            </nav>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.desc}>{description}</p>
          </motion.div>
          {!banner && category && (
            <motion.div className={styles.art} initial={{ opacity: 0, scale: 0.9, rotate: 4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.9 }}>
              <GarmentArt art={category.heroArt} />
            </motion.div>
          )}
        </div>
      </header>

      <div className="container">
        <div className={styles.toolbar}>
          <ul className={styles.chips}>
            {categoryOrder.map((s) => (
              <li key={s}>
                <Link to={`/c/${s}`} className={s === slug ? styles.chipActive : undefined}>
                  {t(`categories.${s}.name`)}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/c/sale" className={isSale ? styles.chipActive : undefined}>
                {t('nav.sale')}
              </Link>
            </li>
          </ul>
          <div className={styles.sortWrap}>
            <span className={styles.count}>{loading ? t('common.loading') : tp('products.count', products.length)}</span>
            <label className={styles.sort}>
              <span>{t('category.sort')}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {sorts.map((s) => (
                  <option key={s} value={s}>
                    {t(`category.sortOptions.${s}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}
