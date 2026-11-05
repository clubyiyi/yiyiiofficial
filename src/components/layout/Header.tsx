import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { mainNav } from '@/config/brand';
import { useI18n } from '@/i18n/I18nProvider';
import { useCart } from '@/store/CartContext';
import { useWishlist } from '@/store/WishlistContext';
import { useUI } from '@/store/UIContext';
import { Icon } from '@/components/ui/Icon';
import { Wordmark } from '@/components/ui/Wordmark';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PromoBar } from './PromoBar';
import styles from './Header.module.css';

/** Hook: oculta la cabecera al bajar y la muestra al subir (patrón e-commerce). */
function useHideOnScroll() {
  const [state, setState] = useState({ hidden: false, scrolled: false });
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      // Umbral de 6px para no alternar con micro-movimientos del trackpad.
      if (Math.abs(y - last) < 6) return;
      const hidden = y > 240 && y > last;
      const scrolled = y > 8;
      last = y;
      // Devolver el mismo objeto evita re-renderizar la cabecera en cada frame.
      setState((prev) => (prev.hidden === hidden && prev.scrolled === scrolled ? prev : { hidden, scrolled }));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return state;
}

function CountBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <motion.span key={count} className={styles.count} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 18 }}>
      {count > 9 ? '9+' : count}
    </motion.span>
  );
}

export function Header() {
  const { t } = useI18n();
  const { count } = useCart();
  const { ids } = useWishlist();
  const { open } = useUI();
  const { hidden, scrolled } = useHideOnScroll();

  return (
    <header className={`${styles.header} ${hidden ? styles.hidden : ''} ${scrolled ? styles.scrolled : ''}`}>
      <PromoBar />
      <div className={styles.main}>
        <div className={styles.left}>
          <button type="button" className={`${styles.iconButton} ${styles.menuButton}`} onClick={() => open('menu')} aria-label={t('nav.menu')}>
            <Icon name="menu" />
          </button>
          <Wordmark />
        </div>

        <nav className={styles.nav} aria-label="Principal">
          <ul>
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    [styles.navLink, item.highlight && styles.highlight, isActive && !item.to.includes('#') && styles.active]
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.right}>
          <button type="button" className={styles.searchField} onClick={() => open('search')}>
            <span>{t('nav.searchPlaceholder')}</span>
            <Icon name="search" size={18} />
          </button>
          <button type="button" className={`${styles.iconButton} ${styles.searchIcon}`} onClick={() => open('search')} aria-label={t('nav.search')}>
            <Icon name="search" />
          </button>
          <div className={styles.lang}>
            <LanguageSwitcher compact />
          </div>
          <NavLink to="/favoritos" className={styles.iconButton} aria-label={`${t('nav.wishlist')} (${ids.length})`}>
            <Icon name="heart" />
            <CountBadge count={ids.length} />
          </NavLink>
          <button type="button" className={styles.iconButton} onClick={() => open('cart')} aria-label={`${t('nav.cart')} (${count})`}>
            <Icon name="bag" />
            <CountBadge count={count} />
          </button>
        </div>
      </div>
    </header>
  );
}
