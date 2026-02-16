export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  tags: string[];
  productType: string;
  createdAt?: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  images?: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      };
    }>;
  };
  variants?: {
    edges: Array<{
      node: {
        id: string;
        availableForSale: boolean;
      };
    }>;
  };
}

export interface ShopifyProductWithVariants extends ShopifyProduct {
  descriptionHtml?: string;
  collections?: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        } | null;
      };
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  image: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
}

export interface ProductsResponse {
  products: {
    edges: Array<{ node: ShopifyProduct }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

export interface CollectionWithProductsResponse {
  collection: {
    id: string;
    title: string;
    handle: string;
    products: {
      edges: Array<{ node: ShopifyProduct }>;
    };
  } | null;
}

export interface ShopifyFilterValue {
  id: string;
  label: string;
  count: number;
  input: string;
}

export interface ShopifyFilter {
  id: string;
  label: string;
  type: string;
  values: ShopifyFilterValue[];
}

export interface CollectionPageResponse {
  collection: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: {
      url: string;
      altText: string | null;
      width: number;
      height: number;
    } | null;
    products: {
      edges: Array<{ node: ShopifyProduct }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      totalCount?: number;
      filters: ShopifyFilter[];
    };
  } | null;
}

export interface CollectionsResponse {
  collections: {
    edges: Array<{ node: ShopifyCollection }>;
  };
}

export interface ProductByHandleResponse {
  product: ShopifyProductWithVariants | null;
}

export interface ProductsByIdsResponse {
  nodes: (ShopifyProduct | null)[];
}

export interface ShopifyMenuItem {
  id: string;
  title: string;
  url: string | null;
  items: ShopifyMenuItem[];
}

export interface MenuResponse {
  menu: {
    id: string;
    handle: string;
    title: string;
    items: ShopifyMenuItem[];
  } | null;
}

export interface SearchResponse {
  search: {
    nodes: Array<{
      id: string;
      title: string;
      handle: string;
      description: string;
      priceRange: {
        minVariantPrice: { amount: string; currencyCode: string };
      };
      featuredImage: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      } | null;
    }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
}

export interface SearchPageResponse {
  search: {
    nodes: (ShopifyProduct | null)[];
    productFilters: ShopifyFilter[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}
