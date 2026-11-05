import type { Money } from '@/types/commerce';
import { useI18n } from '@/i18n/I18nProvider';
import styles from './Price.module.css';

export function Price({ price, compareAt }: { price: Money; compareAt?: Money }) {
  const { formatMoney } = useI18n();
  return (
    <p className={styles.price}>
      <span className={compareAt ? styles.sale : undefined}>{formatMoney(price)}</span>
      {compareAt && <s className={styles.compare}>{formatMoney(compareAt)}</s>}
    </p>
  );
}
