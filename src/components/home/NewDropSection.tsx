import Link from "next/link";
import Image from "next/image";

interface NewDropSectionProps {
  imageUrl: string | null;
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
}

export function NewDropSection({
  imageUrl,
  title,
  text,
  buttonText,
  buttonLink,
}: NewDropSectionProps) {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          {/* Afbeelding */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 md:aspect-square">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                Geen afbeelding
              </div>
            )}
          </div>

          {/* Tekst + button */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {title}
            </h2>
            {text && (
              <p className="mt-4 text-gray-600 md:text-lg">{text}</p>
            )}
            <Link
              href={buttonLink}
              className="mt-6 inline-flex w-fit items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
