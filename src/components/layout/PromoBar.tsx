import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { brand } from '@/config/brand';
import { useI18n } from '@/i18n/I18nProvider';
import { Icon } from '@/components/ui/Icon';
import styles from './PromoBar.module.css';

/** Barra promocional superior con mensajes rotatorios (textos en i18n). */
export function PromoBar() {
  const { dict, t } = useI18n();
  const messages = dict.promo.messages;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), brand.promoIntervalMs);
    return () => window.clearInterval(id);
  }, [messages.length, paused]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + messages.length) % messages.length);

  return (
    <div className={styles.bar} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <button type="button" className={styles.arrow} onClick={() => go(-1)} aria-label={t('common.previous')}>
        <Icon name="chevronLeft" size={14} />
      </button>
      <div className={styles.viewport} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            className={styles.message}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Icon name="sparkle" size={12} filled />
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button type="button" className={styles.arrow} onClick={() => go(1)} aria-label={t('common.next')}>
        <Icon name="chevronRight" size={14} />
      </button>
    </div>
  );
}
