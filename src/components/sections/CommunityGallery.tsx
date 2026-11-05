import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { brand } from '@/config/brand';
import { useI18n } from '@/i18n/I18nProvider';
import { useUI } from '@/store/UIContext';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import campaign1Webp from '@/assets/campaign-1.webp';
import campaign2Webp from '@/assets/campaign-2.webp';
import campaign3Webp from '@/assets/campaign-3.webp';
import top001FrontWebp from '@/assets/products/top-001-front.webp';
import top002AltWebp from '@/assets/products/top-002-alt.webp';
import styles from './CommunityGallery.module.css';

/**
 * Galería #YiYiGirls. Mientras no haya fotos de clientas se usan fotos propias de la marca.
 * Para cambiarlas: sustituye `src` y su texto alternativo en i18n → community.photos (mismo orden).
 * Mosaico de 5 fotos: la primera es la grande (2×2) y las otras cuatro la rodean.
 */
const photos: { src: string; to: string; focus?: string }[] = [
  { src: campaign2Webp, to: '/c/dresses', focus: '50% 40%' },
  { src: campaign1Webp, to: '/c/tops', focus: '50% 30%' },
  { src: top001FrontWebp, to: '/c/tops', focus: '50% 15%' },
  { src: campaign3Webp, to: '/c/shorts', focus: '50% 35%' },
  { src: top002AltWebp, to: '/c/tops', focus: '50% 12%' },
];

const HASHTAG = '#YiYiGirls';
const instagram = brand.social.find((s) => s.label === 'Instagram')?.href ?? '#';
const hasInstagram = instagram !== '#';

export function CommunityGallery() {
  const { t, dict } = useI18n();
  const { notify } = useUI();

  // Con el perfil configurado en brand.social abre Instagram; si no, copia el hashtag.
  const onCta = () => {
    if (hasInstagram) {
      window.open(instagram, '_blank', 'noopener');
      return;
    }
    navigator.clipboard
      ?.writeText(HASHTAG)
      .then(() => notify(t('community.copied', { tag: HASHTAG })))
      .catch(() => notify(t('community.hint')));
  };

  return (
    <section className={`container ${styles.section}`} id="comunidad" aria-labelledby="community-title">
      <SectionHeader
        id="community-title"
        eyebrow={t('community.eyebrow')}
        title={t('community.title')}
        subtitle={t('community.subtitle')}
        action={
          <Button variant="pink" arrow onClick={onCta}>
            {t('community.cta')}
          </Button>
        }
      />

      <ul className={styles.grid}>
        {photos.map((photo, i) => (
          <motion.li
            key={photo.src}
            className={styles.tile}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to={photo.to} className={styles.link}>
              <img
                src={photo.src}
                alt={dict.community.photos[i]}
                className={styles.image}
                style={{ objectPosition: photo.focus }}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.overlay} aria-hidden="true">
                <Icon name="heart" filled size={22} />
                <span className={styles.tag}>#YiYiGirls</span>
                <span className={styles.view}>
                  {t('community.viewLook')} <Icon name="arrowRight" size={14} />
                </span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>

      <p className={styles.hint}>
        <Icon name="sparkle" size={14} filled /> {t('community.hint')}
      </p>
    </section>
  );
}
