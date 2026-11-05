# YiYi! — Storefront (fase 1: frontend)

Tienda de moda femenina (vestidos, tops, faldas y shorts) con identidad Barbiecore · coquette · Y2K · lujo editorial.
Catálogo local en `src/data/demoProducts.ts` o, en producción, desde Shopify Storefront API. Los pagos los procesa el checkout de Shopify.

## Arranque
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build de producción
```

## Estructura
```
src/
  config/brand.ts            Nombre de marca, navegación, moneda, intervalo de la barra promo
  styles/tokens.css          Variables de diseño: colores, tipografía, espacios, radios, sombras, animación
  i18n/                      Diccionarios es/en (en se valida contra la forma de es) + useI18n()
  types/commerce.ts          Modelo de dominio (Product, Money, CartLine…) independiente del proveedor
  services/commerce/         Contrato CommerceAdapter + mockAdapter (demo)
  data/demoProducts.ts       Catálogo DEMO
  store/                     Carrito, favoritos y estado de UI (contextos + localStorage)
  hooks/                     useProducts, useMediaQuery
  components/
    layout/                  PromoBar, Header, SearchOverlay, MobileMenu, Footer (+ newsletter)
    sections/                Hero, Marquee, CampaignTriptych, NewArrivals, CategoryGrid, EditorialBanner, ValuesStrip
    ui/                      ProductCard, ProductRail, ProductGrid, Button, Drawer, Reveal, Media…
    art/                     Ilustraciones SVG originales (placeholder de fotografía)
    cart/                    CartDrawer (checkout deshabilitado hasta tener backend)
  pages/                     Home, Category (/c/:slug, /c/sale), Wishlist (/favoritos)
```

## Personalizar
- **Colores / tipografía / espacios / animaciones** → `src/styles/tokens.css`.
- **Textos** → `src/i18n/locales/es.ts` y `en.ts`. Añadir idioma: nuevo archivo tipado `Dictionary` y registrarlo en `I18nProvider.tsx`.
- **Fotografía real** → cada `ProductImage` acepta `src`; el hero/campaña/editorial aceptan `imageSrc`/`src`.
  Sin `src` se pinta la ilustración SVG. Coloca las fotos en `public/images/`.

## Conectar Shopify (Storefront API)
1. En Shopify: **Configuración → Apps y canales de venta → Desarrollar apps** (o canal **Headless**) y activa los alcances
   `unauthenticated_read_product_listings` y `unauthenticated_write_checkouts`
   (opcional `unauthenticated_read_product_inventory` para los avisos «¡Solo quedan N!»).
2. Copia el **token de acceso público de Storefront API**. Es público por diseño; nunca uses el de Admin API (`shpat_…`).
3. `cp .env.example .env.local`, pega el token en `VITE_SHOPIFY_STOREFRONT_TOKEN` y ejecuta `npm run dev`.
4. Convenciones del catálogo en el admin:
   - **Tipo de producto**: Vestidos, Tops, Corsets, Faldas o Shorts (o etiqueta `categoria:vestidos`).
   - **Opciones**: `Color` y `Talla`; asigna a cada variante la foto de su color.
   - **Precio de comparación** → la prenda aparece en Rebajas con su −%.
   - **Colecciones** `new-in`, `trending`, `featured` (o etiquetas iguales) → pestañas del inicio.
   - **Etiquetas** `nuevo`, `mas-vendido`, `edicion-limitada` → insignias.
   - Activa el canal de venta de la app en cada producto y el mercado **Perú (PEN)**.
5. «Finalizar compra» crea el carrito con `cartCreate` y redirige al checkout seguro de Shopify: esta web no toca datos de pago.

Código: `src/services/commerce/shopify/` (config, cliente GraphQL, consultas, mapeo al modelo y adaptador).
La vista previa (`npm run build:preview`) usa siempre el catálogo local (`.env.preview`).

## Conectar un backend real
1. Crea `src/services/commerce/<proveedor>Adapter.ts` que implemente `CommerceAdapter` y mapee la API a `types/commerce.ts`.
2. Regístralo en `services/commerce/index.ts` y define `VITE_COMMERCE_PROVIDER` (ver `.env.example`).
3. Sustituye las operaciones de `store/CartContext.tsx` por llamadas al carrito remoto manteniendo su API pública.
4. Habilita el botón de pago cuando `getCheckoutUrl()` devuelva la URL del checkout del proveedor.
