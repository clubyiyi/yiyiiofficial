import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import styles from './SectionHeader.module.css';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  id?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, action, id }: Props) {
  return (
    <Reveal as="header" className={styles.header}>
      <div>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2 className={styles.title} id={id}>
          {title}
        </h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </Reveal>
  );
}
