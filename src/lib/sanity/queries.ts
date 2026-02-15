export const HOMEPAGE_QUERY = `
  *[_type == "page" && slug.current == "home"][0] {
    title,
    hero {
      title,
      subtitle,
      image,
      ctaText,
      ctaLink
    },
    body
  }
`;

export const PAGE_BY_SLUG_QUERY = `
  *[_type == "page" && slug.current == $slug][0] {
    title,
    hero {
      title,
      subtitle,
      image,
      ctaText,
      ctaLink
    },
    body
  }
`;
