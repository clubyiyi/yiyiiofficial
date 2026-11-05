import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { brand } from '@/config/brand';
import { guideSizes, sizeGuides } from '@/data/sizeGuide';
import { useI18n } from '@/i18n/I18nProvider';
import type { CategorySlug } from '@/types/commerce';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { SizeDiagram } from './SizeDiagram';
import styles from './SizeGuideModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  category: CategorySlug;
  selected?: string;
}

/** Ventana centrada con la guía de tallas: dibujo con medidas numeradas, tabla por talla y ayuda por WhatsApp. */
export function SizeGuideModal({ open, onClose, category, selected }: Props) {
  const { t, dict } = useI18n();
  const rows = sizeGuides[category];

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('is-locked');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const help = t('product.sizeGuideHelp');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className={styles.head}>
              <span className={styles.headLabel}>{t('product.sizeGuide')}</span>
              <button type="button" className={styles.close} onClick={onClose} aria-label={t('common.close')}>
                <Icon name="close" size={20} />
              </button>
            </header>

            <div className={styles.body}>
              <h2 id="size-guide-title" className={styles.title}>
                {t('product.sizeGuide')}
              </h2>
              <p className={styles.subtitle}>{t('product.sizeGuideSubtitle')}</p>

              <div className={styles.diagram}>
                <SizeDiagram category={category} title={t('product.sizeGuideSubtitle')} />
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th rowSpan={2} className={styles.descHead}>
                        {t('product.sizeGuideDescription')}
                      </th>
                      <th colSpan={guideSizes.length}>{t('product.sizeGuideSizes')}</th>
                    </tr>
                    <tr>
                      {guideSizes.map((s) => (
                        <th key={s} className={s === selected ? styles.colOn : undefined}>
                          {s}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.key}>
                        <th scope="row">
                          {i + 1}. {dict.product.measures[row.key]}
                        </th>
                        {row.values.map((v, j) => (
                          <td key={j} className={guideSizes[j] === selected ? styles.colOn : undefined}>
                            {v} cm
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className={styles.note}>{t('product.sizeGuideNote')}</p>

              <div className={styles.brand}>
                <Logo className={styles.logo} title={brand.name} />
              </div>
            </div>

            <footer className={styles.foot}>
              {brand.whatsapp ? (
                <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.help}>
                  {help}
                </a>
              ) : (
                <span className={styles.help}>{help}</span>
              )}
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
