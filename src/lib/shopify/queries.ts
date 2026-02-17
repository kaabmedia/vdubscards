export const PRODUCTS_QUERY = `
  query GetProducts($first: Int = 12, $after: String) {
    products(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          description
          tags
          productType
          createdAt
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
                quantityAvailable
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const PRODUCTS_BY_COLLECTION_QUERY = `
  query GetProductsByCollection($handle: String!, $first: Int = 4) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: $first, sortKey: CREATED, reverse: true) {
        edges {
          node {
            id
            title
            handle
            description
            tags
            productType
            createdAt
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
              width
              height
            }
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                  quantityAvailable
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const COLLECTION_PAGE_QUERY = `
  query GetCollectionPage($handle: String!, $first: Int = 24, $after: String, $sortKey: ProductCollectionSortKeys = CREATED, $reverse: Boolean = true, $filters: [ProductFilter!]) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
        width
        height
      }
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        edges {
          node {
            id
            title
            handle
            description
            tags
            productType
            createdAt
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
              width
              height
            }
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                  quantityAvailable
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
    }
  }
`;

/** Lightweight query om te pagineren voor totaal aantal producten (geen totalCount in Storefront API). */
export const COLLECTION_PRODUCTS_COUNT_QUERY = `
  query GetCollectionProductsCount($handle: String!, $first: Int!, $after: String, $sortKey: ProductCollectionSortKeys = CREATED, $reverse: Boolean = true, $filters: [ProductFilter!]) {
    collection(handle: $handle) {
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        edges { node { id } }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query GetCollections($first: Int = 10) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      tags
      productType
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      collections(first: 5) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const PRODUCTS_BY_IDS_QUERY = `
  query GetProductsByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        description
        tags
        productType
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
          width
          height
        }
        images(first: 2) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              availableForSale
              quantityAvailable
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_QUERY = `
  query SearchProducts($query: String!, $first: Int = 20) {
    search(query: $query, first: $first, types: PRODUCT) {
      nodes {
        ... on Product {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const SEARCH_PAGE_QUERY = `
  query SearchPage($query: String!, $first: Int = 24, $after: String, $sortKey: SearchSortKeys = RELEVANCE, $reverse: Boolean = false, $productFilters: [ProductFilter!]) {
    search(query: $query, first: $first, after: $after, types: PRODUCT, sortKey: $sortKey, reverse: $reverse, productFilters: $productFilters) {
      nodes {
        ... on Product {
          id
          title
          handle
          description
          tags
          productType
          createdAt
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
                quantityAvailable
              }
            }
          }
        }
      }
      productFilters {
        id
        label
        type
        values {
          id
          label
          count
          input
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const CREATE_CART_MUTATION = `
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                quantityAvailable
                image {
                  url
                  altText
                  width
                  height
                }
                product {
                  title
                  handle
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const MENU_QUERY = `
  query GetMenu($handle: String!) {
    menu(handle: $handle) {
      id
      handle
      title
      items {
        id
        title
        url
        items {
          id
          title
          url
          items {
            id
            title
            url
            items {
              id
              title
              url
            }
          }
        }
      }
    }
  }
`;
