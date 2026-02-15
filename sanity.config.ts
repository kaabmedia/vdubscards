import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./sanity/schemas";

// Sanity Studio gebruikt SANITY_STUDIO_ prefix; Next.js gebruikt NEXT_PUBLIC_
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

if (!projectId) {
  throw new Error(
    "SANITY_STUDIO_PROJECT_ID of NEXT_PUBLIC_SANITY_PROJECT_ID is vereist. Voeg toe aan .env.local:\n\nSANITY_STUDIO_PROJECT_ID=jouw-project-id\nSANITY_STUDIO_DATASET=production"
  );
}

export default defineConfig({
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: schema.types,
  },
});
