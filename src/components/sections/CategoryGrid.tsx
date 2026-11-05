import { Link } from 'react-router-dom';
import { categoryOrder } from '@/config/brand';
import { demoCategories } from '@/data/demoProducts';
import { useI18n } from '@/i18n/I18nProvider';
import { GarmentArt } from '@/components/art/GarmentArt';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import styles from './CategoryGrid.module.css';

export function CategoryGrid() {
  const { t } = useI18n();
  const categories = categoryOrder.map((slug) => demoCategories.find((c) => c.slug === slug)!);

  return (
    <section className={`container ${styles.section}`} aria-labelledby="cat-title">
      <SectionHeader id="cat-title" eyebrow="Wardrobe" title={t('categories.title')} subtitle={t('categories.subtitle')} />
      <ul className={styles.grid}>
        {categories.map((category, i) => (
          <Reveal as="li" key={category.slug} delay={i * 0.08}>
            <Link to={`/c/${category.slug}`} className={styles.card}>
              {/* El fondo del contenedor rellena los laterales cuando la tarjeta es más ancha que la ilustración. */}
              <div className={styles.media} style={{ background: category.heroArt.background }}>
                {category.cover ? (
                  <picture>
                    {category.cover.webp && <source srcSet={category.cover.webp} type="image/webp" />}
                    <img
                      src={category.cover.src}
                      alt=""
                      className={`${styles.art} ${styles.photo}`}
                      style={{ objectPosition: category.cover.focus }}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                ) : (
                  <GarmentArt art={category.heroArt} className={styles.art} fit="contain" />
                )}
                <span className={styles.index}>0{i + 1}</span>
              </div>
              <div className={styles.copy}>
                <h3 className={styles.name}>{t(`categories.${category.slug}.name`)}</h3>
                <p className={styles.desc}>{t(`categories.${category.slug}.description`)}</p>
              </div>
              <span className={styles.arrow} aria-hidden="true">
                <Icon name="arrowRight" size={18} />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
