import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: { _type?: string; asset?: { _ref: string } }) {
  return builder.image(source);
}
