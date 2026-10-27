import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface SuppliesSectionProps {
  imageUrl: string;
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
}

export function SuppliesSection({
  imageUrl,
  title,
  text,
  buttonText,
  buttonLink,
}: SuppliesSectionProps) {
  return (
    <section className="bg-white py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="relative isolate rounded-3xl bg-primary px-5 pt-6 md:px-12 md:py-10">
          {/* Lichtvlek achter de slab, zodat de foto loskomt van het geel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_72%_50%,rgba(255,255,255,0.6),transparent_60%)]"
          />

          <div className="grid items-center gap-6 md:mx-auto md:max-w-5xl md:grid-cols-[1fr_440px] md:gap-14">
            {/* Foto in een "graded slab": label bovenin, acryl rand, diepe schaduw.
                Niet focusbaar: de knop is de toegankelijke link naar dezelfde plek. */}
            <Link
              href={buttonLink}
              tabIndex={-1}
              aria-hidden="true"
              className="group/slab block w-full md:order-last"
            >
              <div className="relative rotate-[1.5deg] rounded-[1.1rem] border border-white/80 bg-white/55 p-2 shadow-[0_40px_70px_-20px_rgba(76,29,149,0.55),0_16px_30px_-10px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-transform duration-500 ease-out group-hover/slab:-translate-y-1 group-hover/slab:rotate-0 motion-reduce:rotate-0 motion-reduce:transition-none md:p-2.5">
                <div className="flex items-center justify-between gap-4 rounded-md border-2 border-purple bg-white px-3 py-1.5">
                  <div className="min-w-0 leading-tight">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      V-Dub&apos;s Cards
                    </p>
                    <p className="truncate text-xs font-extrabold uppercase tracking-wide text-foreground">
                      Card supplies
                    </p>
                  </div>
                  <div className="shrink-0 text-right leading-none">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Gem mt
                    </p>
                    <p className="mt-0.5 text-lg font-black text-purple">10</p>
                  </div>
                </div>
                <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-md bg-gray-100 ring-1 ring-black/5">
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 440px"
                  />
                </div>
                {/* Glans over het acryl */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[1.1rem] bg-[linear-gradient(115deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_35%,rgba(255,255,255,0)_70%,rgba(255,255,255,0.18)_100%)]"
                />
              </div>
            </Link>

            {/* Tekst en knop */}
            <div className="min-w-0">
              <h2 className="text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-gray-900 md:text-5xl">
                {title}
              </h2>
              {text && (
                <p className="mt-3 max-w-md text-gray-900/75 md:mt-4 md:text-lg">{text}</p>
              )}

              {/* Knop met de mascotte eronder; die springt op als je over de knop hovert.
                  Mobiel staat de mascotte op de onderrand van het gele vlak. */}
              <div className="mt-6 inline-flex flex-col items-center md:mt-7">
                <Link
                  href={buttonLink}
                  className="peer/btn group/btn inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:gap-3 hover:bg-black active:scale-95 focus-visible:outline-gray-900"
                >
                  {buttonText}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
                <Image
                  src="/mascot-eagle.png"
                  alt=""
                  width={388}
                  height={334}
                  sizes="144px"
                  className="pointer-events-none mt-2 h-auto w-28 transition-transform duration-300 ease-out peer-hover/btn:-translate-y-1.5 peer-hover/btn:-rotate-3 motion-reduce:transition-none motion-reduce:peer-hover/btn:transform-none md:mt-3 md:w-36"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
