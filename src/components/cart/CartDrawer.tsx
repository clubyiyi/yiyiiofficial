import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { commerce } from '@/services/commerce';
import { useI18n } from '@/i18n/I18nProvider';
import { useCart } from '@/store/CartContext';
import { useUI } from '@/store/UIContext';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { Icon } from '@/components/ui/Icon';
import { ProductMedia } from '@/components/ui/Media';
import { colorOf } from '@/utils/colors';
import styles from './CartDrawer.module.css';

/**
 * Bolsa lateral. «Finalizar compra» lleva al checkout seguro del proveedor (Shopify):
 * esta web nunca recoge datos de pago. Sin proveedor real el botón queda deshabilitado.
 */
export function CartDrawer() {
  const { t, tp, tr, formatMoney, locale } = useI18n();
  const { panel, close } = useUI();
  const { lines, count, subtotal, setQuantity, remove } = useCart();
  const [checkout, setCheckout] = useState<'idle' | 'loading' | 'error'>('idle');

  const goToCheckout = async () => {
    setCheckout('loading');
    try {
      const url = await commerce.getCheckoutUrl(lines, locale);
      if (!url) throw new Error('Sin checkout');
      window.location.assign(url);
    } catch (err) {
      console.error('[checkout]', err);
      setCheckout('error');
    }
  };

  const footer = lines.length ? (
    <div className={styles.summary}>
      <div className={styles.row}>
        <span>{t('cart.subtotal')}</span>
        <strong>{formatMoney(subtotal)}</strong>
      </div>
      <Button
        fullWidth
        arrow
        disabled={!commerce.supportsCheckout || checkout === 'loading'}
        aria-describedby="checkout-note"
        onClick={goToCheckout}
      >
        {checkout === 'loading' ? t('cart.redirecting') : t('cart.checkout')}
      </Button>
      <p id="checkout-note" className={styles.note} role={checkout === 'error' ? 'alert' : undefined}>
        {!commerce.supportsCheckout
          ? t('cart.checkoutUnavailable')
          : checkout === 'error'
            ? t('cart.checkoutError')
            : t('cart.secureCheckout')}
      </p>
    </div>
  ) : undefined;

  return (
    <Drawer
      open={panel === 'cart'}
      onClose={close}
      title={`${t('cart.title')}${count ? ` · ${tp('cart.items', count)}` : ''}`}
      footer={footer}
    >
      {!lines.length ? (
        <div className={styles.empty}>
          <Icon name="bag" size={44} />
          <p>{t('cart.empty')}</p>
          <Button to="/#novedades" onClick={close} variant="pink" arrow>
            {t('cart.emptyCta')}
          </Button>
        </div>
      ) : (
        <ul className={styles.lines}>
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <motion.li
                key={line.id}
                layout
                className={styles.line}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.thumb}>
                  <ProductMedia image={line.product.images[line.product.colors?.find((c) => c.id === line.variant.color)?.image ?? 0]} className={styles.thumbImg} />
                </div>
                <div className={styles.details}>
                  <p className={styles.name}>{tr(line.product.name)}</p>
                  <p className={styles.meta}>
                    {[tr(colorOf(line.product, line.variant)), `${t('cart.size')} ${line.variant.size}`].filter(Boolean).join(' · ')}
                  </p>
                  <p className={styles.meta}>{line.product.sku}</p>
                  <div className={styles.controls}>
                    <div className={styles.qty} role="group" aria-label={t('cart.quantity')}>
                      <button type="button" onClick={() => setQuantity(line.id, line.quantity - 1)} aria-label={t('cart.decrease')}>
                        <Icon name="minus" size={14} />
                      </button>
                      <span>{line.quantity}</span>
                      <button type="button" onClick={() => setQuantity(line.id, line.quantity + 1)} aria-label={t('cart.increase')}>
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                    <button type="button" className={styles.remove} onClick={() => remove(line.id)}>
                      {t('cart.remove')}
                    </button>
                  </div>
                </div>
                <strong className={styles.total}>{formatMoney(line.lineTotal)}</strong>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Drawer>
  );
}
