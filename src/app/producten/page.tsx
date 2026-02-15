import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Redirect naar collectie-pagina met filters (incl. prijsfilter) */
export default function ProductenPage() {
  redirect("/collections/all");
}
