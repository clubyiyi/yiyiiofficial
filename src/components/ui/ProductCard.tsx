import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { brand } from '@/config/brand';
import type { Product } from '@/types/commerce';
import { useI18n } from '@/i18n/I18nProvider';
import { useCart } from '@/store/CartContext';
import { useWishlist } from '@/store/WishlistContext';
import { useUI } from '@/store/UIContext';
import { Icon } from './Icon';
import { ProductMedia } from './Media';
import { Price } from './Price';
import { variantsForColor } from '@/utils/colors';
import { isComingSoon } from '@/utils/launch';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  /** Prioriza la carga (primeras tarjetas visibles). */
  priority?: boolean;
}

/** Tarjeta de producto reutilizable: imagen con cambio al hover, favoritos, insignias y añadido rápido. */
export function ProductCard({ product }: ProductCardProps) {
  const { t, tr } = useI18n();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { notify } = useUI();
  const [justAdded, setJustAdded] = useState(false);

  const name = tr(product.name);
  // Descuento real calculado con los precios; se muestra en la etiqueta de rebaja.
  const pct = product.compareAtPrice
    ? Math.round((1 - product.price.amount / product.compareAtPrice.amount) * 100)
    : 0;
  const saved = has(product.id);
  const [colorIdx, setColorIdx] = useState(0);
  const color = product.colors?.[colorIdx];
  const shownVariants = variantsForColor(product, color?.id);
  const available = shownVariants.filter((v) => v.available);
  // Con colores: la foto principal es la del color elegido y no hay foto alternativa al pasar el ratón.
  const primary = color ? product.images[color.image] : product.images[0];
  const secondary = color ? undefined : product.images[1];

  const soon = isComingSoon(product);

  const handleAdd = () => {
    add(product, available[0]?.id);
    notify(t('cart.addedToast', { name }));
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className={`${styles.card} ${soon ? styles.isSoon : !available.length ? styles.isSoldOut : ''}`}>
      <div className={styles.media}>
        <ProductMedia image={primary} className={styles.image} />
        {secondary && <ProductMedia image={secondary} className={`${styles.image} ${styles.alt}`} />}
        <Link to={`/p/${product.handle}`} className={styles.mediaLink} aria-label={name} tabIndex={-1} />

        <div className={styles.badges}>
          {brand.showDemoBadge && product.isDemo && <span className={`${styles.badge} ${styles.demo}`}>{t('common.demoBadge')}</span>}
          {soon && (
            <span className={`${styles.badge} ${styles.soonBadge}`}>
              <Icon name="sparkle" size={11} />
              <span className={styles.soonLong}>{t('products.comingSoon')}</span>
              <span className={styles.soonShort}>{t('products.comingSoonShort')}</span>
            </span>
          )}
          {!soon && !available.length && <span className={`${styles.badge} ${styles.soldOutBadge}`}>{t('products.soldOut')}</span>}
          {!soon && available.length > 0 && product.badges.slice(0, 1).map((badge) => (
            <span key={badge} className={`${styles.badge} ${badge === 'sale' ? styles.saleBadge : ''}`}>
              {badge === 'sale' && pct > 0 ? `−${pct}%` : t(`products.badges.${badge}`)}
            </span>
          ))}
        </div>

        <motion.button
          type="button"
          className={`${styles.wish} ${saved ? styles.wishOn : ''}`}
          aria-pressed={saved}
          aria-label={saved ? t('products.removeFromWishlist') : t('products.addToWishlist')}
          onClick={() => toggle(product.id)}
          whileTap={{ scale: 0.8 }}
        >
          <motion.span key={String(saved)} initial={{ scale: saved ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
            <Icon name="heart" filled={saved} size={20} />
          </motion.span>
        </motion.button>

        {soon ? (
          <button
            type="button"
            className={`${styles.quickAdd} ${styles.soonSave}`}
            aria-pressed={saved}
            onClick={() => toggle(product.id)}
          >
            <span className={styles.quickAddLabel}>
              <Icon name="heart" filled={saved} size={16} />
              {saved ? t('products.savedShort') : t('products.saveShort')}
            </span>
          </button>
        ) : (
        <button type="button" className={styles.quickAdd} onClick={handleAdd} disabled={!available.length}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={justAdded ? 'added' : 'add'}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={styles.quickAddLabel}
            >
              <Icon name={justAdded ? 'sparkle' : 'bag'} size={16} />
              {available.length ? (justAdded ? t('products.added') : t('products.addToBag')) : t('products.soldOut')}
            </motion.span>
          </AnimatePresence>
        </button>
        )}
      </div>

      <div className={styles.info}>
        <Price price={product.price} compareAt={product.compareAtPrice} />
        <h3 className={styles.name}>
          <Link to={`/p/${product.handle}`} className={styles.nameLink}>
            {name}
          </Link>
        </h3>
        <p className={styles.meta}>
          {[t(`categories.${product.category}.name`), tr(color?.name ?? product.colorName)].filter(Boolean).join(' · ')}
        </p>
        {product.colors && (
          <div className={styles.swatches} role="radiogroup" aria-label={t('product.color')}>
            {product.colors.map((c, ci) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={ci === colorIdx}
                aria-label={tr(c.name)}
                title={tr(c.name)}
                className={`${styles.swatch} ${ci === colorIdx ? styles.swatchOn : ''}`}
                style={{ background: c.swatch }}
                onClick={() => setColorIdx(ci)}
                onMouseEnter={() => setColorIdx(ci)}
              />
            ))}
          </div>
        )}
        {soon ? (
          <p className={styles.soonLine}>
            <Icon name="sparkle" size={12} />
            <span>{t('products.comingSoonShort')}</span>
          </p>
        ) : (
          <p className={styles.sizes}>
            {shownVariants.map((v) => (
              <span key={v.id} className={v.available ? undefined : styles.soldOutSize}>
                {v.size}
              </span>
            ))}
          </p>
        )}
        <p className={styles.sku}>{product.sku}</p>
      </div>
    </article>
  );
}
