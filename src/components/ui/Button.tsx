import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import styles from './Button.module.css';

type Variant = 'primary' | 'light' | 'outline' | 'pink';

interface BaseProps {
  variant?: Variant;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined };
type LinkProps = BaseProps & { to: string; onClick?: () => void };

/** Botón rectangular editorial con flecha opcional. Usa `to` para renderizar un enlace. */
export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', arrow = false, children, className, fullWidth, ...rest } = props;
  const classes = [styles.button, styles[variant], fullWidth && styles.full, className].filter(Boolean).join(' ');
  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {arrow && <Icon name="arrowRight" size={18} className={styles.arrow} />}
    </>
  );

  if ('to' in rest && rest.to) {
    return (
      <Link to={rest.to} className={classes} onClick={rest.onClick}>
        {content}
      </Link>
    );
  }
  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
