import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type MouseEvent } from 'react';
import type { ProductImage } from '@/types/commerce';
import { useI18n } from '@/i18n/I18nProvider';
import { Icon } from '@/components/ui/Icon';
import { ProductMedia } from '@/components/ui/Media';
import styles from './Gallery.module.css';

/** Galería de la ficha: miniaturas, foto grande con zoom al pasar el ratón y flechas. */
export function Gallery({ images, start = 0 }: { images: ProductImage[]; start?: number }) {
  const { t } = useI18n();
  const [index, setIndex] = useState(start);
  // Cambiar de color mueve la galería a la foto de ese color.
  useEffect(() => setIndex(start), [start]);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const total = images.length;
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className={styles.gallery}>
      <ul className={styles.thumbs}>
        {images.map((image, i) => (
          <li key={i}>
            <button
              type="button"
              className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
              onClick={() => setIndex(i)}
              aria-label={t('product.photo', { n: i + 1, total })}
              aria-current={i === index}
            >
              <ProductMedia image={image} className={styles.thumbImg} />
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.main} onMouseMove={onMove} onMouseLeave={() => setZoom(null)}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={index}
            className={styles.slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div
              className={styles.zoomLayer}
              style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            >
              <ProductMedia image={images[index]} className={styles.mainImg} />
            </div>
          </motion.div>
        </AnimatePresence>

        {total > 1 && (
          <>
            <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => go(-1)} aria-label={t('common.previous')}>
              <Icon name="chevronLeft" size={20} />
            </button>
            <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => go(1)} aria-label={t('common.next')}>
              <Icon name="chevronRight" size={20} />
            </button>
            <span className={styles.counter} aria-hidden="true">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
