import type { ImageFrame } from '@/types/commerce';

/**
 * Encuadre de las fotos de Shopify, para que se vean igual que el diseño original.
 * Las fotos se subieron a Shopify sin recortar (3:4); aquí se guarda qué parte mostrar en el formato 4:5 de la tienda.
 * Clave: handle del producto → nombre del archivo de la foto en Shopify (así no importa el orden de las fotos).
 * - focus: punto que queda fijo al recortar (CSS object-position), «x% y%».
 * - zoom: acercamiento (1 = la foto ocupa todo el ancho).
 * Una foto nueva sin entrada aquí se muestra centrada.
 */
export const shopifyFraming: Record<string, Record<string, ImageFrame>> = {
  'top-bow-kiss': {
    'cf50cdd9-123a-4b5f-8483-b15217163453.jpg_21544489_2K.jpg': { focus: '59.4% 0%', zoom: 1.333 },
    'Woman_standing_on_city_street_69213b14_2K.jpg': { focus: '48.4% 0%', zoom: 1.323 },
    'WhatsApp_Image_2026-11-04_at_4.50.35_PM.jpg': { focus: '51.6% 100%', zoom: 1.323 },
  },
  'cardigan-pink-matcha': {
    'Woman_holding_cup_and_bag_3fc9aed0_2K.jpg': { focus: '50% 23.1%', zoom: 1 },
    'Woman_holding_cup_and_bag_82fbeea5_2K.jpg': { focus: '50% 0%', zoom: 1 },
  },
  'vestido-cherry-ruffle': {
    'Woman_posing_in_red_dress_2cf3c06f_2K.jpg': { focus: '50% 83.3%', zoom: 1.021 },
    'Woman_posing_in_red_dress_952a8fbd_2K.jpg': { focus: '50% 77.8%', zoom: 1 },
  },
  'top-camo-coquette': {
    'ec83d6ca-4b71-4148-9388-496923a5c663.jpg_91fe882e.jpg': { focus: '50% 50%', zoom: 1 },
    'ec83d6ca-4b71-4148-9388-496923a5c663.jpg_564862b7_2K.jpg': { focus: '50% 33.3%', zoom: 1 },
  },
  'vestido-wild-kitty': {
    'Woman_standing_on_city_sidewalk_f12b659f_2K_1.jpg': { focus: '57.1% 94.4%', zoom: 1.073 },
    'Woman_standing_on_city_sidewalk_45844cd0_2K_1.jpg': { focus: '42.9% 94.4%', zoom: 1.073 },
  },
  'set-pink-siren': {
    'Woman_posing_in_pink_outfit_ca4a6c60_2K_1_274f6bf8-e8d4-453d-a904-806c26365e51.jpg': { focus: '50% 90.9%', zoom: 1.188 },
    'Woman_posing_in_pink_outfit_12fc2ed5_2K_1_8615994b-e8ce-4649-ab25-0df8ca0529b6.jpg': { focus: '50% 96.7%', zoom: 1.167 },
  },
  'vestido-rose-garden': {
    '25c38005-8877-4680-bf00-ba828c6fe4b4.jpg_36087dbf_2K.jpg': { focus: '50% 11.1%', zoom: 1 },
    '25c38005-8877-4680-bf00-ba828c6fe4b4.jpg_c54fe1bb_2K.jpg': { focus: '50% 11.1%', zoom: 1 },
  },
  'set-rose-holiday': {
    'Woman_holding_ice_cream_7ce9a3a8_2K.jpg': { focus: '50% 44.4%', zoom: 1 },
    'Woman_standing_in_stone_alleyway_fd065462_2K.jpg': { focus: '50% 77.8%', zoom: 1 },
  },
  'set-golden-hour': {
    'Woman_posing_in_gold_outfit_8ff8fb2e_2K.jpg': { focus: '63.2% 85.3%', zoom: 1.198 },
    'Woman_posing_in_gold_outfit_a5df464d_2K.jpg': { focus: '29% 100%', zoom: 1.323 },
  },
  'skirt-preppy-plaid': {
    'WhatsApp_Image_2026-11-04_at_5.22.00_9db7c71e.jpg': { focus: '22.7% 94.9%', zoom: 1.229 },
    'WhatsApp_Image_2026-11-04_at_5.22.00_fc643c6a_2K.jpg': { focus: '45.8% 95.1%', zoom: 1.25 },
  },
};
