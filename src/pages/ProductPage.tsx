import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { CategorySlug, Product } from '@/types/commerce';
import { useI18n } from '@/i18n/I18nProvider';
import { useProduct } from '@/hooks/useProduct';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/store/CartContext';
import { useUI } from '@/store/UIContext';
import { useWishlist } from '@/store/WishlistContext';
import { AccordionItem } from '@/components/product/Accordion';
import { CompleteLook } from '@/components/product/CompleteLook';
import { Gallery } from '@/components/product/Gallery';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProductMedia } from '@/components/ui/Media';
import { ProductRail } from '@/components/ui/ProductRail';
import { variantsForColor } from '@/utils/colors';
import { isComingSoon } from '@/utils/launch';
import styles from './ProductPage.module.css';

/** Categorías que combinan con cada una para «Completa el look». */
const lookPairs: Record<CategorySlug, CategorySlug[]> = {
  tops: ['skirts', 'shorts'],
  corsets: ['skirts', 'shorts'],
  skirts: ['tops', 'corsets'],
  shorts: ['tops', 'corsets'],
  dresses: [],
};
const trustIcons: IconName[] = ['truck', 'return', 'gift', 'sparkle'];

export function ProductPage() {
  const { handle = '' } = useParams();
  const { product, loading } = useProduct(handle);
  const { t } = useI18n();

  if (loading) return <div className={`container ${styles.state}`}>{t('common.loading')}</div>;
  if (!product) {
    return (
      <div className={`container ${styles.state}`}>
        <p>{t('product.notFound')}</p>
        <Link to="/" className={styles.back}>
          {t('product.backToShop')}
        </Link>
      </div>
    );
  }
  // key: reinicia talla/cantidad al navegar entre prendas.
  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const { t, tp, tr, dict, formatMoney } = useI18n();
  const { add } = useCart();
  const { notify, open } = useUI();
  const { has, toggle } = useWishlist();
  const [variantId, setVariantId] = useState<string>();
  const [qty, setQty] = useState(1);
  const [needSize, setNeedSize] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const sizesRef = useRef<HTMLDivElement>(null);

  const { products: all } = useProducts({});
  const related = useMemo(
    () => all.filter((p) => p.category === product.category && p.id !== product.id),
    [all, product],
  );
  const soon = isComingSoon(product);
  // «Completa el look» solo con prendas a la venta.
  const lookItems = useMemo(
    () =>
      soon
        ? []
        : lookPairs[product.category]
            .map((c) => all.find((p) => p.category === c && !isComingSoon(p)))
            .filter((p): p is Product => Boolean(p)),
    [all, product, soon],
  );

  const name = tr(product.name);
  const saved = has(product.id);
  const [colorIdx, setColorIdx] = useState(0);
  const color = product.colors?.[colorIdx];
  const sizeVariants = variantsForColor(product, color?.id);
  const variant = product.variants.find((v) => v.id === variantId);
  const soldOut = sizeVariants.every((v) => !v.available);
  const pct = product.compareAtPrice
    ? Math.round((1 - product.price.amount / product.compareAtPrice.amount) * 100)
    : 0;

  // Barra fija de compra cuando el botón principal sale de pantalla.
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowSticky(!soon && !entry.isIntersecting && entry.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [soon]);

  const closeGuide = useCallback(() => setGuideOpen(false), []);

  const askSize = () => {
    setNeedSize(true);
    sizesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const addToBag = () => {
    if (!variantId) return askSize();
    add(product, variantId, qty);
    notify(t('cart.addedToast', { name }));
    open('cart');
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link to="/">{t('nav.home')}</Link>
          <span>/</span>
          <Link to={`/c/${product.category}`}>{t(`categories.${product.category}.name`)}</Link>
          <span>/</span>
          <span aria-current="page">{name}</span>
        </nav>

        <div className={styles.layout}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Gallery images={product.images} start={color?.image ?? 0} />
          </motion.div>

          <motion.div
            className={styles.info}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            {soon ? (
              <div className={styles.badges}>
                <span className={`${styles.badge} ${styles.badgeSoon}`}>
                  <Icon name="sparkle" size={12} />
                  {t('products.comingSoon')}
                </span>
              </div>
            ) : (soldOut || product.badges.length > 0) && (
              <div className={styles.badges}>
                {soldOut && <span className={styles.badge}>{t('products.soldOut')}</span>}
                {!soldOut && product.badges.map((b) => (
                  <span key={b} className={`${styles.badge} ${b === 'sale' ? styles.badgeSale : ''}`}>
                    {t(`products.badges.${b}`)}
                  </span>
                ))}
              </div>
            )}

            <h1 className={styles.title}>{name}</h1>

            <div className={styles.priceRow}>
              <span className={`${styles.price} ${product.compareAtPrice ? styles.priceSale : ''}`}>{formatMoney(product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <s className={styles.compare}>{formatMoney(product.compareAtPrice)}</s>
                  <span className={styles.off}>{t('product.off', { pct })}</span>
                </>
              )}
            </div>

            <div className={styles.block}>
              <p className={styles.label}>{t('product.why')}</p>
              <ul className={styles.highlights}>
                {dict.product.highlights[product.category].map((h) => (
                  <li key={h}>
                    <span className={styles.check}>
                      <Icon name="check" size={12} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {(product.colors || tr(product.colorName)) && (
            <div className={styles.block}>
              <p className={styles.label}>
                {t('product.color')}: <strong>{tr(color?.name ?? product.colorName)}</strong>
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
                      onClick={() => {
                        setColorIdx(ci);
                        // La talla elegida se mantiene si existe en el nuevo color.
                        const same = variantsForColor(product, c.id).find((v) => v.size === variant?.size && v.available);
                        setVariantId(same?.id);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            )}

            {soon ? (
              <motion.section
                className={styles.launch}
                ref={buyRef}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                aria-labelledby="launch-title"
              >
                <span className={styles.launchSpark} aria-hidden="true">✦</span>
                <span className={`${styles.launchSpark} ${styles.launchSpark2}`} aria-hidden="true">✦</span>
                <p className={styles.launchEyebrow}>
                  <Icon name="sparkle" size={12} />
                  {t('product.launchEyebrow')}
                </p>
                <h2 id="launch-title" className={styles.launchTitle}>
                  {t('product.launchTitle')}
                </h2>
                <p className={styles.launchText}>{t('product.launchText')}</p>
                <div className={styles.launchSizes}>
                  <span>{t('product.launchSizes')}</span>
                  <ul>
                    {sizeVariants.map((v) => (
                      <li key={v.id}>{v.size}</li>
                    ))}
                  </ul>
                  <button type="button" className={styles.guideBtn} onClick={() => setGuideOpen(true)}>
                    <Icon name="ruler" size={16} />
                    {t('product.sizeGuide')}
                  </button>
                </div>
                <motion.button
                  type="button"
                  className={`${styles.addBtn} ${styles.launchBtn}`}
                  aria-pressed={saved}
                  onClick={() => toggle(product.id)}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon name="heart" filled={saved} size={18} />
                  {saved ? t('products.savedForLaunch') : t('products.saveForLaunch')}
                </motion.button>
              </motion.section>
            ) : (
              <>
              <div className={styles.block} ref={sizesRef}>
                <div className={styles.sizeHead}>
                  <p className={styles.label}>
                    {t('product.size')}
                    {variant && (
                      <>
                        : <strong>{variant.size}</strong>
                      </>
                    )}
                  </p>
                  <button type="button" className={styles.guideBtn} onClick={() => setGuideOpen(true)}>
                    <Icon name="ruler" size={16} />
                    {t('product.sizeGuide')}
                  </button>
                </div>
                <motion.div
                  className={styles.sizes}
                  role="radiogroup"
                  aria-label={t('product.size')}
                  animate={needSize ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {sizeVariants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      role="radio"
                      aria-checked={variantId === v.id}
                      disabled={!v.available}
                      title={v.available ? undefined : t('product.sizeSoldOut')}
                      className={`${styles.size} ${variantId === v.id ? styles.sizeOn : ''}`}
                      onClick={() => {
                        setVariantId(v.id);
                        setNeedSize(false);
                        setQty((q) => Math.min(q, v.stock ?? 10));
                      }}
                    >
                      {v.size}
                      {v.available && v.stock !== undefined && v.stock <= 5 && (
                        <span className={styles.lowStock}>{tp('product.lowStock', v.stock)}</span>
                      )}
                    </button>
                  ))}
                </motion.div>
                {variant?.stock !== undefined && variant.stock <= 5 && (
                  <p className={styles.lowStockHint}>
                    <span className={styles.pulse} aria-hidden="true" />
                    {t('product.lowStockHint', { count: variant.stock, size: variant.size })}
                  </p>
                )}
                <AnimatePresence>
                  {needSize && (
                    <motion.p
                      className={styles.needSize}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="alert"
                    >
                      {t('product.selectSize')}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.buy} ref={buyRef}>
                <div className={styles.qty} role="group" aria-label={t('product.quantity')}>
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t('cart.decrease')}>
                    <Icon name="minus" size={14} />
                  </button>
                  <span aria-live="polite">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(variant?.stock ?? 10, q + 1))} aria-label={t('cart.increase')}>
                    <Icon name="plus" size={14} />
                  </button>
                </div>
                <button type="button" className={styles.addBtn} onClick={addToBag} disabled={soldOut}>
                  <Icon name="bag" size={18} />
                  {soldOut ? t('products.soldOut') : t('products.addToBag')}
                </button>
                <motion.button
                  type="button"
                  className={`${styles.wish} ${saved ? styles.wishOn : ''}`}
                  aria-pressed={saved}
                  aria-label={saved ? t('products.removeFromWishlist') : t('products.addToWishlist')}
                  onClick={() => toggle(product.id)}
                  whileTap={{ scale: 0.85 }}
                >
                  <Icon name="heart" filled={saved} size={20} />
                </motion.button>
              </div>
              </>
            )}

            <div className={styles.accordion}>
              <AccordionItem title={t('product.tabs.description')} defaultOpen>
                <p>{tr(product.description)}</p>
                <p className={styles.ref}>
                  {t('product.reference')} {product.sku}
                </p>
              </AccordionItem>
              <AccordionItem title={t('product.tabs.care')}>
                <ul>
                  {dict.product.care.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </AccordionItem>
              <AccordionItem title={t('product.tabs.shipping')}>
                <p>{t('product.shippingText')}</p>
              </AccordionItem>
            </div>

            {lookItems.length > 0 && (
              <CompleteLook product={product} variantId={variantId} items={lookItems} onNeedSize={askSize} />
            )}

            <div className={styles.block}>
              <p className={styles.label}>{t('product.trust')}</p>
              <ul className={styles.trust}>
                {dict.values.map((v, i) => (
                  <li key={v.title}>
                    <Icon name={trustIcons[i]} size={20} />
                    <span>{v.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className={styles.related} aria-labelledby="related-title">
            <h2 id="related-title" className={styles.relatedTitle}>
              {t('product.related')}
            </h2>
            <ProductRail products={related} label={t('product.related')} />
          </section>
        )}
      </div>

      <AnimatePresence>
        {showSticky && (
          <motion.div
            className={styles.sticky}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`container ${styles.stickyInner}`}>
              <div className={styles.stickyThumb}>
                <ProductMedia image={product.images[0]} className={styles.stickyImg} />
              </div>
              <div className={styles.stickyText}>
                <p className={styles.stickyName}>{name}</p>
                <p className={styles.stickyPrice}>
                  {formatMoney(product.price)}
                  {variant && <span> · {t('product.size')} {variant.size}</span>}
                </p>
              </div>
              <button type="button" className={styles.addBtn} onClick={addToBag} disabled={soldOut}>
                <Icon name="bag" size={16} />
                {t('products.addToBag')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SizeGuideModal open={guideOpen} onClose={closeGuide} category={product.category} selected={variant?.size} />
    </div>
  );
}
