import { useI18n } from '@/i18n/I18nProvider';
import styles from './Marquee.module.css';

/** Cinta de texto en movimiento continuo. Los mensajes están en i18n → marquee. */
export function Marquee() {
  const { dict } = useI18n();
  // Se repiten los mensajes para que una sola copia cubra pantallas anchas.
  const words = [...dict.marquee, ...dict.marquee];
  const row = (hidden: boolean) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {words.map((word, i) => (
        <li key={i}>
          {word}
          <span className={styles.star} aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
