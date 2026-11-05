import { locales, useI18n } from '@/i18n/I18nProvider';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className={`${styles.switcher} ${compact ? styles.compact : ''}`} role="group" aria-label={t('nav.language')}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          className={code === locale ? styles.active : undefined}
          aria-pressed={code === locale}
          onClick={() => setLocale(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
