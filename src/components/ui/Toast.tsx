import { AnimatePresence, motion } from 'motion/react';
import { useUI } from '@/store/UIContext';
import { Icon } from './Icon';
import styles from './Toast.module.css';

export function Toast() {
  const { toast } = useUI();
  return (
    <div className={styles.region} aria-live="polite" role="status">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            className={styles.toast}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Icon name="sparkle" size={18} filled />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
