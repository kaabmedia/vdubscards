import { type SchemaTypeDefinition } from "sanity";
import { hero } from "./hero";
import { page } from "./page";
import { blockContent } from "./blockContent";
import { event } from "./event";
import { countdown } from "./countdown";
import { contactPage } from "./contactPage";
import { aboutPage } from "./aboutPage";
import { shippingPage } from "./shippingPage";
import { returnsPage } from "./returnsPage";
import { faqPage } from "./faqPage";
import { privacyPage } from "./privacyPage";
import { termsPage } from "./termsPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [hero, blockContent, page, event, countdown, contactPage, aboutPage, shippingPage, returnsPage, faqPage, privacyPage, termsPage],
};
