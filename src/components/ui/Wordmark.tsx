import { Link } from 'react-router-dom';
import { brand } from '@/config/brand';
import { Logo } from './Logo';
import styles from './Wordmark.module.css';

/** Logotipo enlazado a la home. Negro sobre claro; `inverse` para fondos oscuros. */
export function Wordmark({ inverse = false, size = 'md' }: { inverse?: boolean; size?: 'md' | 'lg' }) {
  return (
    <Link to="/" className={`${styles.wordmark} ${styles[size]} ${inverse ? styles.inverse : ''}`} aria-label={brand.name}>
      <Logo className={styles.logo} title={brand.name} />
    </Link>
  );
}
