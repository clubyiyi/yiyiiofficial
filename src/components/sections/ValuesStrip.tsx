import { useI18n } from '@/i18n/I18nProvider';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import styles from './ValuesStrip.module.css';

const icons: IconName[] = ['truck', 'return', 'gift', 'sparkle'];

export function ValuesStrip() {
  const { dict } = useI18n();
  return (
    <section className={`container ${styles.section}`}>
      <ul className={styles.list}>
        {dict.values.map((value, i) => (
          <Reveal as="li" key={value.title} delay={i * 0.06} className={styles.item}>
            <Icon name={icons[i]} size={26} />
            <div>
              <p className={styles.title}>{value.title}</p>
              <p className={styles.text}>{value.text}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
