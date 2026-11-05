import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { brand, categoryOrder } from '@/config/brand';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/Button';
import { Wordmark } from '@/components/ui/Wordmark';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './Footer.module.css';

function Newsletter() {
  const { t } = useI18n();
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  // Sin backend: solo valida en cliente. Conectar aquí el proveedor de email marketing.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    setStatus(typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email) ? 'ok' : 'error');
  };

  return (
    <section className={styles.newsletter} aria-labelledby="newsletter-title">
      <div className={`container ${styles.newsletterInner}`}>
        <div>
          <h2 id="newsletter-title" className={styles.newsTitle}>
            {t('newsletter.title')}
          </h2>
          <p className={styles.newsText}>{t('newsletter.text')}</p>
        </div>
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <label className="visually-hidden" htmlFor="newsletter-email">
            {t('newsletter.placeholder')}
          </label>
          <input id="newsletter-email" name="email" type="email" placeholder={t('newsletter.placeholder')} autoComplete="email" />
          <Button type="submit" variant="primary" arrow>
            {t('newsletter.cta')}
          </Button>
          {status !== 'idle' && (
            <p className={styles.status} role="status">
              {status === 'ok' ? t('newsletter.success') : t('newsletter.invalid')}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const { t, dict } = useI18n();
  return (
    <footer className={styles.footer}>
      <Newsletter />
      <div className={`container ${styles.columns}`}>
        <div className={styles.brand}>
          <Wordmark inverse size="lg" />
          <p>{t('common.demoNotice')}</p>
          <LanguageSwitcher />
        </div>
        <nav aria-label={t('footer.columns.shop')}>
          <h3>{t('footer.columns.shop')}</h3>
          <ul>
            {categoryOrder.map((slug) => (
              <li key={slug}>
                <Link to={`/c/${slug}`}>{t(`categories.${slug}.name`)}</Link>
              </li>
            ))}
            <li>
              <Link to="/c/sale">{t('nav.sale')}</Link>
            </li>
          </ul>
        </nav>
        <nav aria-label={t('footer.columns.help')}>
          <h3>{t('footer.columns.help')}</h3>
          <ul>
            {dict.footer.help.map((label) => (
              <li key={label}>
                <a href="#">{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t('footer.columns.about')}>
          <h3>{t('footer.columns.about')}</h3>
          <ul>
            {dict.footer.about.map((label) => (
              <li key={label}>
                <a href="#">{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
        <ul>
          {dict.footer.legal.map((label) => (
            <li key={label}>
              <a href="#">{label}</a>
            </li>
          ))}
          {brand.social.map((s) => (
            <li key={s.label}>
              <a href={s.href}>{s.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
