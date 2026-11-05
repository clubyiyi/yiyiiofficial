import type { CSSProperties } from 'react';
import { GarmentArt } from '@/components/art/GarmentArt';
import { EditorialScene, type SceneVariant } from '@/components/art/EditorialScene';
import type { ProductImage } from '@/types/commerce';
import { useI18n } from '@/i18n/I18nProvider';

/**
 * Capa de medios: si existe una foto real (`src`) la muestra; si no, pinta la ilustración demo.
 * Así basta con añadir URLs del CMS/backend para pasar a fotografía sin tocar los componentes.
 */
export function ProductMedia({ image, className }: { image: ProductImage; className?: string }) {
  const { tr } = useI18n();
  if (image.src) {
    const img = (
      <img
        src={image.src}
        alt={tr(image.alt)}
        className={className}
        style={{
          objectPosition: image.focus,
          transformOrigin: image.focus,
          ...(image.zoom ? ({ '--zoom': image.zoom } as CSSProperties) : null),
        }}
        loading="lazy"
        decoding="async"
      />
    );
    return image.webp ? (
      <picture style={{ display: 'contents' }}>
        <source srcSet={image.webp} type="image/webp" />
        {img}
      </picture>
    ) : (
      img
    );
  }
  return <GarmentArt art={image.art} title={tr(image.alt)} className={className} />;
}

interface EditorialMediaProps {
  src?: string;
  /** Versión WebP opcional (más ligera); el navegador elige la que soporte. */
  webp?: string;
  /** Punto focal al recortar la foto (CSS object-position). */
  focus?: string;
  scene: SceneVariant;
  alt: string;
  className?: string;
  align?: 'xMidYMid' | 'xMaxYMid' | 'xMinYMid';
  viewBox?: string;
  priority?: boolean;
}

export function EditorialMedia({ src, webp, focus, scene, alt, className, align, viewBox, priority }: EditorialMediaProps) {
  if (src) {
    const img = (
      <img
        src={src}
        alt={alt}
        className={className}
        style={focus ? { objectPosition: focus } : undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
    return webp ? (
      <picture style={{ display: 'contents' }}>
        <source srcSet={webp} type="image/webp" />
        {img}
      </picture>
    ) : (
      img
    );
  }
  return <EditorialScene variant={scene} title={alt} className={className} align={align} viewBox={viewBox} />;
}
