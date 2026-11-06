import type { CategorySlug, Locale } from '@/types/commerce';
import type { TranslationKey } from '@/i18n/types';

/** Identidad y ajustes generales de la tienda. Cambia el nombre aquí. */
export const brand = {
  name: 'YiYi!',
  defaultLocale: 'es' as Locale,
  currency: 'PEN',
  /** Formato de precios (S/ 39.90). */
  moneyLocale: 'es-PE',
  promoIntervalMs: 4500,
  /** Muestra la etiqueta «DEMO» en las tarjetas de productos de demostración. */
  showDemoBadge: false,
  /** Toda prenda que no esté en rebaja se muestra como «Próximo lanzamiento» (no se puede comprar). */
  comingSoonUnlessOnSale: true,
  /** Enlace de WhatsApp para asesoría de tallas, p. ej. 'https://wa.me/34600000000'. Vacío = solo texto. */
  whatsapp: '',
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'Pinterest', href: '#' },
  ],
};

export interface NavItem {
  labelKey: TranslationKey;
  to: string;
  highlight?: boolean;
}

export const categoryOrder: CategorySlug[] = ['dresses', 'tops', 'corsets', 'skirts', 'shorts'];

export const mainNav: NavItem[] = [
  { labelKey: 'nav.newIn', to: '/#novedades' },
  { labelKey: 'nav.dresses', to: '/c/dresses' },
  { labelKey: 'nav.tops', to: '/c/tops' },
  { labelKey: 'nav.corsets', to: '/c/corsets' },
  { labelKey: 'nav.skirts', to: '/c/skirts' },
  { labelKey: 'nav.shorts', to: '/c/shorts' },
  { labelKey: 'nav.community', to: '/#comunidad' },
  { labelKey: 'nav.sale', to: '/c/sale', highlight: true },
];
