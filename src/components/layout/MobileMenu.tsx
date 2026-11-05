import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { mainNav } from '@/config/brand';
import { useI18n } from '@/i18n/I18nProvider';
import { useUI } from '@/store/UIContext';
import { Drawer } from '@/components/ui/Drawer';
import { Icon } from '@/components/ui/Icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './MobileMenu.module.css';

export function MobileMenu() {
  const { t } = useI18n();
  const { panel, close } = useUI();

  return (
    <Drawer open={panel === 'menu'} onClose={close} side="left" title={t('nav.menu')} footer={<LanguageSwitcher />}>
      <ul className={styles.list}>
        {mainNav.map((item, i) => (
          <motion.li key={item.to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.04 }}>
            <NavLink to={item.to} onClick={close} className={`${styles.link} ${item.highlight ? styles.highlight : ''}`}>
              {t(item.labelKey)}
              <Icon name="chevronRight" size={18} />
            </NavLink>
          </motion.li>
        ))}
        <li>
          <NavLink to="/favoritos" onClick={close} className={styles.link}>
            {t('nav.wishlist')}
            <Icon name="heart" size={18} />
          </NavLink>
        </li>
      </ul>
    </Drawer>
  );
}
