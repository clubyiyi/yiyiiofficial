import styles from './SkeletonCard.module.css';

export function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.media} />
      <div className={styles.line} style={{ width: '30%' }} />
      <div className={styles.line} style={{ width: '75%' }} />
      <div className={styles.line} style={{ width: '50%' }} />
    </div>
  );
}
