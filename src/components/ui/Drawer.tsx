import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Icon } from './Icon';
import styles from './Drawer.module.css';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right' | 'top';
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Panel deslizante accesible (cierra con overlay o Escape, foco inicial dentro). */
export function Drawer({ open, onClose, side = 'right', title, children, footer }: DrawerProps) {
  const { t } = useI18n();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => panel.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const offscreen = side === 'top' ? { y: '-100%' } : { x: side === 'right' ? '100%' : '-100%' };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.overlay}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            ref={panel}
            className={`${styles.panel} ${styles[side]}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={offscreen}
            animate={{ x: 0, y: 0 }}
            exit={offscreen}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className={styles.head}>
              <h2 className={styles.title}>{title}</h2>
              <button type="button" className={styles.close} onClick={onClose} aria-label={t('common.close')}>
                <Icon name="close" />
              </button>
            </header>
            <div className={styles.body}>{children}</div>
            {footer && <footer className={styles.foot}>{footer}</footer>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
