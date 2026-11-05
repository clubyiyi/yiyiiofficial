/** Consultas GraphQL de Storefront API y sus tipos de respuesta. */

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  tags: string[];
  publishedAt: string;
  collections: { nodes: { handle: string }[] };
  options: { name: string; optionValues: { name: string; swatch: { color: string | null } | null }[] }[];
  images: { nodes: { id: string; altText: string | null; url: string; webp: string }[] };
  variants: {
    nodes: {
      id: string;
      title: string;
      sku: string | null;
      availableForSale: boolean;
      quantityAvailable?: number | null;
      selectedOptions: { name: string; value: string }[];
      image: { id: string } | null;
      price: ShopifyMoney;
      compareAtPrice: ShopifyMoney | null;
    }[];
  };
}

/**
 * `withInventory`: añade `quantityAvailable` (avisos «¡Solo quedan N!»).
 * Requiere el alcance unauthenticated_read_product_inventory; sin él Shopify rechaza la consulta.
 */
export const productsQuery = (withInventory: boolean) => /* GraphQL */ `
  query Products($first: Int!, $after: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        handle
        title
        description
        productType
        tags
        publishedAt
        collections(first: 20) { nodes { handle } }
        options { name optionValues { name swatch { color } } }
        images(first: 20) {
          nodes {
            id
            altText
            url(transform: { maxWidth: 1000 })
            webp: url(transform: { maxWidth: 1000, preferredContentType: WEBP })
          }
        }
        variants(first: 100) {
          nodes {
            id
            title
            sku
            availableForSale
            ${withInventory ? 'quantityAvailable' : ''}
            selectedOptions { name value }
            image { id }
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
          }
        }
      }
    }
  }
`;

export const cartCreateMutation = /* GraphQL */ `
  mutation CartCreate($input: CartInput!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;
