import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/Button';
import heroJpg from '@/assets/hero-beach.jpg';
import heroWebp from '@/assets/hero-beach.webp';
import styles from './Hero.module.css';

const ease = [0.22, 1, 0.36, 1] as const;

export interface HeroImage {
  jpg: string;
  webp?: string;
  /** Punto focal al recortar (CSS object-position). */
  focus?: string;
}

interface HeroProps {
  /** Foto de campaña. Cambia la imagen del banner aquí o pasando otra desde HomePage. */
  image?: HeroImage;
}

const defaultImage: HeroImage = { jpg: heroJpg, webp: heroWebp, focus: '50% 45%' };

export function Hero({ image = defaultImage }: HeroProps) {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Parallax: solo transform/opacity → se resuelve en la GPU sin repintar.
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hero-title">
      {/* Capa exterior: parallax ligado al scroll. Capa interior: zoom de entrada (WAAPI, acelerado). */}
      <motion.div className={styles.media} style={{ y }}>
        <motion.div
          className={styles.mediaInner}
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease }}
        >
          <picture>
            {image.webp && <source srcSet={image.webp} type="image/webp" />}
            <img
              src={image.jpg}
              alt={t('hero.imageAlt')}
              className={styles.image}
              style={{ objectPosition: image.focus }}
              width={1376}
              height={768}
              decoding="async"
              loading="eager"
            />
          </picture>
        </motion.div>
      </motion.div>
      <div className={styles.scrim} />

      <motion.div className={`container ${styles.content}`} style={{ y: textY, opacity: fade }}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease }}
        >
          {t('hero.eyebrow')}
        </motion.p>
        <h1 id="hero-title" className={styles.title}>
          {[t('hero.titleLine1'), t('hero.titleLine2')].map((line, i) => (
            <span key={i} className={styles.lineMask}>
              <motion.span
                className={`${styles.line} ${i === 1 ? styles.lineAccent : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ delay: 0.35 + i * 0.12, duration: 0.9, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease }}
        >
          {t('hero.subtitle')}
        </motion.p>
        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease }}
        >
          <Button to="/c/skirts" variant="light" arrow>
            {t('hero.ctaPrimary')}
          </Button>
          <Button to="/#campana" variant="primary" arrow>
            {t('hero.ctaSecondary')}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
