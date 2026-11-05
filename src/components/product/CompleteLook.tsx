import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types/commerce';
import { useI18n } from '@/i18n/I18nProvider';
import { useCart } from '@/store/CartContext';
import { useUI } from '@/store/UIContext';
import { Icon } from '@/components/ui/Icon';
import { ProductMedia } from '@/components/ui/Media';
import { Price } from '@/components/ui/Price';
import { variantsForColor } from '@/utils/colors';
import styles from './CompleteLook.module.css';

interface Props {
  product: Product;
  /** Talla elegida de la prenda principal (sin ella no se puede añadir el look). */
  variantId?: string;
  items: Product[];
  onNeedSize: () => void;
}

/** Caja «Completa el look»: prenda actual + prendas que combinan, con sus tallas y total. */
export function CompleteLook({ product, variantId, items, onNeedSize }: Props) {
  const { t, tr, formatMoney } = useI18n();
  const { add } = useCart();
  const { notify, open } = useUI();
  const [sizes, setSizes] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((p) => [p.id, variantsForColor(p).find((v) => v.available)?.id ?? ''])),
  );

  const total = { amount: product.price.amount + items.reduce((s, p) => s + p.price.amount, 0), currency: product.price.currency };

  const addLook = () => {
    if (!variantId) return onNeedSize();
    add(product, variantId);
    items.forEach((p) => add(p, sizes[p.id]));
    notify(t('product.lookAdded'));
    open('cart');
  };

  const row = (p: Product, current: boolean) => (
    <li key={p.id} className={`${styles.row} ${current ? styles.current : ''}`}>
      <Link to={`/p/${p.handle}`} className={styles.thumb}>
        <ProductMedia image={p.images[0]} className={styles.thumbImg} />
      </Link>
      <div className={styles.info}>
        {current && <p className={styles.eyebrow}>{t('product.youAreViewing')}</p>}
        <Link to={`/p/${p.handle}`} className={styles.name}>
          {tr(p.name)}
        </Link>
        <Price price={p.price} compareAt={p.compareAtPrice} />
        {!current && (
          <div className={styles.sizes} role="group" aria-label={t('product.size')}>
            {variantsForColor(p).map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={!v.available}
                aria-pressed={sizes[p.id] === v.id}
                className={`${styles.size} ${sizes[p.id] === v.id ? styles.sizeOn : ''}`}
                onClick={() => setSizes((s) => ({ ...s, [p.id]: v.id }))}
              >
                {v.size}
              </button>
            ))}
          </div>
        )}
      </div>
    </li>
  );

  return (
    <section className={styles.box} aria-labelledby="look-title">
      <h2 id="look-title" className={styles.title}>
        {t('product.completeLook')}
      </h2>
      <p className={styles.sub}>{t('product.completeLookSub')}</p>
      <ul className={styles.list}>
        {row(product, true)}
        {items.map((p) => (
          <li key={`plus-${p.id}`} className={styles.plusRow} aria-hidden="true">
            <span className={styles.plus}>
              <Icon name="plus" size={12} />
            </span>
          </li>
        )).flatMap((plus, i) => [plus, row(items[i], false)])}
      </ul>
      <div className={styles.total}>
        <span>{t('product.lookTotal')}</span>
        <strong>{formatMoney(total)}</strong>
      </div>
      <button type="button" className={styles.cta} onClick={addLook}>
        <Icon name="bag" size={16} />
        {t('product.addLook')}
      </button>
    </section>
  );
}
