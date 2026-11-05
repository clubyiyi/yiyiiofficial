import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { SceneVariant } from '@/components/art/EditorialScene';
import { useI18n } from '@/i18n/I18nProvider';
import { Icon } from '@/components/ui/Icon';
import { EditorialMedia } from '@/components/ui/Media';
import { SectionHeader } from '@/components/ui/SectionHeader';
import campaign1Jpg from '@/assets/campaign-1.jpg';
import campaign1Webp from '@/assets/campaign-1.webp';
import campaign2Jpg from '@/assets/campaign-2.jpg';
import campaign2Webp from '@/assets/campaign-2.webp';
import campaign3Jpg from '@/assets/campaign-3.jpg';
import campaign3Webp from '@/assets/campaign-3.webp';
import styles from './CampaignTriptych.module.css';

/**
 * Los tres capítulos de la campaña: foto, destino del enlace y punto focal.
 * Textos (título, CTA, alt) en i18n → triptych.panels. Sin `src` se pinta la escena SVG.
 */
const panels: { scene: SceneVariant; to: string; src?: string; webp?: string; focus?: string; dark?: boolean }[] = [
  { scene: 'satin', to: '/c/tops', src: campaign1Jpg, webp: campaign1Webp, focus: '50% 30%' },
  { scene: 'coquette', to: '/c/dresses', src: campaign2Jpg, webp: campaign2Webp, focus: '50% 35%' },
  { scene: 'y2k', to: '/c/shorts', src: campaign3Jpg, webp: campaign3Webp, focus: '50% 40%' },
];

export function CampaignTriptych() {
  const { t, dict } = useI18n();
  return (
    <section className={`container ${styles.section}`} id="campana" aria-labelledby="campaign-title">
      <SectionHeader id="campaign-title" eyebrow="Dollhouse" title={t('triptych.title')} />
      <div className={styles.grid}>
        {panels.map((panel, i) => {
          const copy = dict.triptych.panels[i];
          return (
            <motion.div
              key={panel.scene}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={panel.to} className={`${styles.panel} ${panel.dark ? styles.dark : ''}`}>
                <div className={styles.mediaWrap}>
                  <EditorialMedia
                    src={panel.src}
                    webp={panel.webp}
                    focus={panel.focus}
                    scene={panel.scene}
                    alt={copy.alt}
                    className={styles.media}
                  />
                </div>
                <div className={styles.copy}>
                  <p className={styles.eyebrow}>{copy.eyebrow}</p>
                  <h3 className={styles.title}>{copy.title}</h3>
                  <span className={styles.cta}>
                    {copy.cta}
                    <Icon name="arrowRight" size={16} />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
