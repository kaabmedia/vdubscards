import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify/types";

interface SuppliesSectionProps {
  imageUrl: string | null;
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
  products: ShopifyProduct[];
}

function formatPrice(amount: string, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency || "EUR",
  }).format(parseFloat(amount));
}

/** Tilt per productfoto in de fallback-visual, zodat ze als losse kaarten ogen. */
const TILE_TILTS = ["-rotate-6", "rotate-3", "-rotate-2"];

export function SuppliesSection({
  imageUrl,
  title,
  text,
  buttonText,
  buttonLink,
  products,
}: SuppliesSectionProps) {
  const tiles = products.filter((p) => p.featuredImage?.url).slice(0, 3);

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="mt-2 h-0.5 w-12 rounded-full bg-primary" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Visual: eigen foto uit Sanity, anders de supplies-producten op een donker paneel.
              Niet focusbaar: de knop hieronder is de toegankelijke link naar dezelfde plek. */}
          <Link
            href={buttonLink}
            tabIndex={-1}
            aria-hidden="true"
            className="relative block h-[240px] overflow-hidden rounded-xl bg-gray-900 md:h-auto md:min-h-[340px]"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple/10" />
                {tiles.length > 0 ? (
                  <div className="relative flex h-full items-center justify-center gap-4 px-8 pb-6 pt-12 md:p-8">
                    {tiles.map((product, i) => (
                      <div
                        key={product.id}
                        className={`relative aspect-square max-w-[180px] flex-1 overflow-hidden rounded-lg bg-white shadow-xl ${TILE_TILTS[i]}`}
                      >
                        <Image
                          src={product.featuredImage!.url}
                          alt=""
                          fill
                          className="object-contain p-2"
                          sizes="180px"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
                    <ShieldCheck className="mb-3 h-10 w-10 text-primary" />
                    <p className="text-lg font-bold text-white">
                      Keep your cards mint
                    </p>
                  </div>
                )}
              </>
            )}
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
              <ShieldCheck className="h-3 w-3" />
              Supplies
            </span>
          </Link>

          {/* Tekst, supplies-producten en knop */}
          <div className="flex min-w-0 flex-col md:justify-center">
            {text && <p className="text-muted-foreground md:text-lg">{text}</p>}

            {products.length > 0 && (
              <ul className="mt-5 flex flex-col gap-3">
                {products.map((product) => {
                  const price = product.priceRange.minVariantPrice;
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/producten/${product.handle}`}
                        className="group flex items-center gap-4 rounded-lg border-2 border-border bg-white p-3 transition-colors hover:border-primary"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-border">
                          {product.featuredImage && (
                            <Image
                              src={product.featuredImage.url}
                              alt={product.featuredImage.altText ?? product.title}
                              fill
                              className="object-contain p-0.5"
                              sizes="56px"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                            {product.title}
                          </h3>
                          <p className="mt-1 text-sm font-bold text-foreground">
                            {formatPrice(price.amount, price.currencyCode)}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            <Link
              href={buttonLink}
              className="group/btn mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:gap-2.5 active:scale-95"
            >
              {buttonText}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
