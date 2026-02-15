import { type SchemaTypeDefinition } from "sanity";
import { hero } from "./hero";
import { page } from "./page";
import { blockContent } from "./blockContent";
import { event } from "./event";
import { countdown } from "./countdown";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [hero, blockContent, page, event, countdown],
};
