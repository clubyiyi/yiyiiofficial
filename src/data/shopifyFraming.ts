import type { ImageFrame } from '@/types/commerce';

/**
 * Puente entre el catálogo de Shopify y el diseño original de la tienda.
 *
 * shopifyDesign: handle en Shopify → handle de la prenda en el diseño (src/data/demoProducts.ts).
 *   Sirve para mostrar cada prenda en la misma posición que en el diseño y, si en Shopify
 *   no tiene colecciones ni insignias, usar las del diseño.
 *
 * shopifyFraming: encuadre de cada foto de Shopify para que se vea igual que en el diseño.
 *   Las fotos se subieron sin recortar; aquí se guarda qué parte mostrar en el formato 4:5.
 *   Clave: handle del producto → nombre del archivo de la foto (el orden de las fotos no importa).
 *   - focus: punto fijo del recorte (CSS object-position), «x% y%».
 *   - zoom: acercamiento (1 = la foto ocupa todo el ancho).
 *   - pos: posición de la foto en el diseño (0 = foto principal de la tarjeta).
 *   Una foto sin entrada se muestra centrada.
 */
export const shopifyDesign: Record<string, string> = {
  'top-bow-kiss': 'top-bow-kiss',
  'cardigan-pink-matcha': 'cardigan-pink-matcha',
  'vestido-cherry-ruffle': 'vestido-cherry-ruffle',
  'top-camo-coquette': 'set-camo-coquette',
  'vestido-wild-kitty': 'vestido-wild-kitty',
  'set-pink-siren': 'set-pink-siren',
  'vestido-rose-garden': 'vestido-rose-garden',
  'set-rose-holiday': 'set-rose-holiday',
  'set-golden-hour': 'set-golden-hour',
  'skirt-preppy-plaid': 'set-preppy-plaid',
  'vestido-lazo-saten': 'vestido-lazo-saten',
  'vestido-vichy-picnic': 'vestido-vichy-picnic',
  'vestido-midi-encaje': 'vestido-midi-encaje',
  'vestido-mini-cereza': 'vestido-mini-cereza',
  'top-corse-perlas': 'top-corse-perlas',
  'top-baby-tee-y2k': 'top-baby-tee-y2k',
  'top-cardigan-lazos': 'top-cardigan-lazos',
  'top-halter-cromado': 'top-halter-cromado',
  'corset-brown-sugar': 'corset-negro-cordones',
  'corset-cocoa-lace': 'corset-vichy-lila',
  'corset-vanilla-dream': 'corset-encaje-marfil',
  'corset-black-swan': 'corset-saten-rosa',
  'falda-rebel-belt': 'falda-satin-midi',
  'falda-polka-noir': 'falda-vichy-colegiala',
  'falda-mocha-mermaid': 'falda-mini-plisada',
  'falda-fluffy-denim': 'falda-tul-ballet',
  'short-lunares-retro': 'short-denim-corazones',
  'short-sastre-perla': 'short-sastre-perla',
  'short-lunares-retro-1': 'short-lunares-retro',
  'short-bloomer-volantes': 'short-bloomer-volantes',
};

export const shopifyFraming: Record<string, Record<string, ImageFrame>> = {
  'top-bow-kiss': {
    'cf50cdd9-123a-4b5f-8483-b15217163453.jpg_21544489_2K.jpg': { focus: '59.4% 0%', zoom: 1.333, pos: 0 },
    'Woman_standing_on_city_street_69213b14_2K.jpg': { focus: '48.5% 0%', zoom: 1.344, pos: 1 },
    'WhatsApp_Image_2026-11-04_at_4.50.35_PM.jpg': { focus: '50% 100%', zoom: 1.312, pos: 2 },
  },
  'cardigan-pink-matcha': {
    'Woman_holding_cup_and_bag_3fc9aed0_2K.jpg': { focus: '50% 23.1%', zoom: 1, pos: 0 },
    'Woman_holding_cup_and_bag_82fbeea5_2K.jpg': { focus: '50% 0%', zoom: 1, pos: 1 },
  },
  'vestido-cherry-ruffle': {
    'Woman_posing_in_red_dress_2cf3c06f_2K.jpg': { focus: '50% 87.9%', zoom: 1.021, pos: 0 },
    'Woman_posing_in_red_dress_952a8fbd_2K.jpg': { focus: '50% 80.8%', zoom: 1, pos: 1 },
  },
  'top-camo-coquette': {
    'ec83d6ca-4b71-4148-9388-496923a5c663.jpg_91fe882e.jpg': { focus: '50% 50%', zoom: 1, pos: 0 },
    'ec83d6ca-4b71-4148-9388-496923a5c663.jpg_564862b7_2K.jpg': { focus: '50% 34.6%', zoom: 1, pos: 1 },
  },
  'vestido-wild-kitty': {
    'Woman_standing_on_city_sidewalk_f12b659f_2K_1.jpg': { focus: '57.1% 94.4%', zoom: 1.073, pos: 0 },
    'Woman_standing_on_city_sidewalk_45844cd0_2K_1.jpg': { focus: '42.9% 94.4%', zoom: 1.073, pos: 1 },
  },
  'set-pink-siren': {
    'Woman_posing_in_pink_outfit_ca4a6c60_2K_1_274f6bf8-e8d4-453d-a904-806c26365e51.jpg': { focus: '50% 91.4%', zoom: 1.188, pos: 0 },
    'Woman_posing_in_pink_outfit_12fc2ed5_2K_1_8615994b-e8ce-4649-ab25-0df8ca0529b6.jpg': { focus: '50% 96.5%', zoom: 1.167, pos: 1 },
  },
  'vestido-rose-garden': {
    '25c38005-8877-4680-bf00-ba828c6fe4b4.jpg_36087dbf_2K.jpg': { focus: '50% 11.5%', zoom: 1, pos: 0 },
    '25c38005-8877-4680-bf00-ba828c6fe4b4.jpg_c54fe1bb_2K.jpg': { focus: '50% 34.6%', zoom: 1, pos: 1 },
  },
  'set-rose-holiday': {
    'Woman_holding_ice_cream_7ce9a3a8_2K.jpg': { focus: '50% 46.2%', zoom: 1, pos: 0 },
    'Woman_standing_in_stone_alleyway_fd065462_2K.jpg': { focus: '50% 80.8%', zoom: 1, pos: 1 },
  },
  'set-golden-hour': {
    'Woman_posing_in_gold_outfit_8ff8fb2e_2K.jpg': { focus: '63.2% 85.1%', zoom: 1.198, pos: 0 },
    'Woman_posing_in_gold_outfit_a5df464d_2K.jpg': { focus: '29% 100%', zoom: 1.323, pos: 1 },
  },
  'skirt-preppy-plaid': {
    'WhatsApp_Image_2026-11-04_at_5.22.00_9db7c71e.jpg': { focus: '22.7% 95%', zoom: 1.229, pos: 0 },
    'WhatsApp_Image_2026-11-04_at_5.22.00_fc643c6a_2K.jpg': { focus: '45.8% 95.5%', zoom: 1.25, pos: 1 },
  },
  'vestido-lazo-saten': {
    'Woman_posing_in_studio_6a848c23_2K.jpg': { focus: '50% 34.6%', zoom: 1, pos: 0 },
    'Model_posing_in_studio_b28b9981_2K.jpg': { focus: '50% 45%', zoom: 1, pos: 1 },  // ajuste manual
  },
  'vestido-vichy-picnic': {
    'Model_posing_in_slip_dress_42b6d7af_2K.jpg': { focus: '50% 34.6%', zoom: 1, pos: 0 },
    'Model_posing_in_beige_dress_ebddfc2c_2K.jpg': { focus: '50% 34.6%', zoom: 1, pos: 1 },
  },
  'vestido-midi-encaje': {
    'WhatsApp_Image_2026-11-02_at_4.54.53_PM_2.jpg': { focus: '50% 53.4%', zoom: 1, pos: 0 },
    'WhatsApp_Image_2026-11-02_at_5.00.39_PM.jpg': { focus: '50% 53.4%', zoom: 1, pos: 1 },
  },
  'vestido-mini-cereza': {
    'WhatsApp_Image_2026-11-02_at_5.20.07_PM.jpg': { focus: '50% 37.2%', zoom: 1, pos: 0 },
  },
  'top-corse-perlas': {
    'image.png_d07a3a39_2K.jpg': { focus: '50% 0%', zoom: 1.292, pos: 1 },
    'image.png_e910582f_2K.jpg': { focus: '50% 0%', zoom: 1.292, pos: 0 },
  },
  'top-baby-tee-y2k': {
    'image.png_e66f35e1_2K.jpg': { focus: '50% 0%', zoom: 1.167, pos: 1 },
    'image.png_831fc62a_2K.jpg': { focus: '50% 0%', zoom: 1.167, pos: 0 },
  },
  'top-cardigan-lazos': {
    'image.png_6a9d0ebd_2K.jpg': { focus: '50% 5.8%', zoom: 1, pos: 0 },
    'image.png_fa7e3d24_2K.jpg': { focus: '50% 5.8%', zoom: 1, pos: 1 },
  },
  'top-halter-cromado': {
    'image.png_a1838881_2K.jpg': { focus: '50% 21.6%', zoom: 1.438, pos: 0 },
    'image.png_51503578_2K.jpg': { focus: '50% 20.9%', zoom: 1.417, pos: 1 },
  },
  'corset-brown-sugar': {
    'image.png_e69ed975_2K.jpg': { focus: '50% 14.8%', zoom: 1.208, pos: 0 },
    'image.png_089c5089_2K.jpg': { focus: '50% 14.8%', zoom: 1.208, pos: 1 },
  },
  'corset-cocoa-lace': {
    'image.png_1eef3451_2K.jpg': { focus: '50% 0%', zoom: 1.062, pos: 1 },
    'image.png_49c76317_2K.jpg': { focus: '50% 0%', zoom: 1.146, pos: 0 },
  },
  'corset-vanilla-dream': {
    'image.png_a961aa91_2K.jpg': { focus: '50% 21.6%', zoom: 1.438, pos: 0 },
    'image.png_b94d2a11_2K_1.jpg': { focus: '50% 15.4%', zoom: 1.438, pos: 1 },
  },
  'corset-black-swan': {
    'image.png_8c36a389_2K.jpg': { focus: '50% 0%', zoom: 1.292, pos: 0 },
    'image.png_0a067070_2K.jpg': { focus: '50% 0%', zoom: 1.292, pos: 1 },
  },
  'falda-rebel-belt': {
    'image.png_29163edc_2K.jpg': { focus: '50% 46.2%', zoom: 1, pos: 0 },
    'image.png_83be891c_2K.jpg': { focus: '50% 46.2%', zoom: 1, pos: 1 },
  },
  'falda-polka-noir': {
    'image.png_c73671b3_2K.jpg': { focus: '50% 46.2%', zoom: 1, pos: 0 },
    'image.png_9c41c702_2K.jpg': { focus: '50% 46.2%', zoom: 1, pos: 1 },
  },
  'falda-mocha-mermaid': {
    'image.png_3e32197d_2K.jpg': { focus: '50% 46.2%', zoom: 1, pos: 0 },
    'image.png_e46e8bc7_2K.jpg': { focus: '50% 46.2%', zoom: 1, pos: 1 },
  },
  'falda-fluffy-denim': {
    'image.png_0c49bc67_2K_1.jpg': { focus: '50% 46.2%', zoom: 1, pos: 0 },
    'image.png_b5218b92_2K.jpg': { focus: '50% 46.2%', zoom: 1, pos: 1 },
  },
  'short-lunares-retro': {
    'image.png_de8c2369_2K.jpg': { focus: '50% 46.2%', zoom: 1, pos: 0 },
    'image.png_fb6298c0_2K.jpg': { focus: '38.1% 0%', zoom: 1.15, pos: 1 },
  },
  'short-sastre-perla': {
    'image.png_75bae6e8_1.jpg': { focus: '48.1% 0%', zoom: 1.802, pos: 0 },
    'image.png_05c0790d_2K.jpg': { focus: '56.2% 0%', zoom: 1.5, pos: 1 },
  },
  'short-lunares-retro-1': {
    'image.png_dac3450b_2K.jpg': { focus: '43.5% 22.7%', zoom: 1.24, pos: 0 },
    'image.png_01d57ac7_2K.jpg': { focus: '52.2% 12.6%', zoom: 1.24, pos: 1 },
  },
  'short-bloomer-volantes': {
    'Model_posing_in_studio_photoshoot_28b3b222_2K.jpg': { focus: '50.5% 7.8%', zoom: 1.856, pos: 0 },
    'Model_posing_in_studio_photoshoot_fdf36fac_2K.jpg': { focus: '51% 42.2%', zoom: 2.345, pos: 1 },
  },
};
