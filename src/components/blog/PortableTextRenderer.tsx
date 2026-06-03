import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";

interface CalloutBlock {
  _type: "callout";
  type: "tip" | "info" | "warning" | "success";
  text: string;
}

interface SanityImageBlock {
  _type: "image";
  asset: { _ref: string };
  alt?: string;
  caption?: string;
}

const CALLOUT_STYLES: Record<string, { bg: string; border: string; icon: string }> = {
  tip: { bg: "bg-yellow-50", border: "border-yellow-300", icon: "💡" },
  info: { bg: "bg-blue-50", border: "border-blue-300", icon: "ℹ️" },
  warning: { bg: "bg-orange-50", border: "border-orange-300", icon: "⚠️" },
  success: { bg: "bg-green-50", border: "border-green-300", icon: "✅" },
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageBlock }) => {
      if (!value?.asset?._ref) return null;
      const src = urlFor(value).width(1200).height(675).fit("crop").auto("format").url();
      return (
        <figure className="my-8 overflow-hidden rounded-xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={src}
              alt={value.alt ?? "Blog image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    callout: ({ value }: { value: CalloutBlock }) => {
      const style = CALLOUT_STYLES[value.type] ?? CALLOUT_STYLES.tip;
      return (
        <div className={`my-6 flex gap-3 rounded-xl border-l-4 ${style.border} ${style.bg} p-4`}>
          <span className="text-xl leading-relaxed">{style.icon}</span>
          <p className="text-sm leading-relaxed text-gray-800">{value.text}</p>
        </div>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="mb-5 leading-7 text-gray-700">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 text-2xl font-bold text-gray-900 md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 text-xl font-bold text-gray-900">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-6 text-lg font-semibold text-gray-900">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary bg-primary/5 py-3 pl-5 pr-4 text-gray-800 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-5 list-disc space-y-1.5 text-gray-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-5 list-decimal space-y-1.5 text-gray-700">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800">
        {children}
      </code>
    ),
    underline: ({ children }) => <span className="underline">{children}</span>,
    "strike-through": ({ children }) => (
      <span className="line-through">{children}</span>
    ),
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const isExternal = href.startsWith("http");
      if (isExternal) {
        return (
          <a
            href={href}
            target={value?.blank ? "_blank" : undefined}
            rel={value?.blank ? "noopener noreferrer" : undefined}
            className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
        >
          {children}
        </Link>
      );
    },
    internalLink: ({ value, children }) => (
      <Link
        href={value?.href ?? "/"}
        className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
      >
        {children}
      </Link>
    ),
  },
};

interface PortableTextRendererProps {
  body: PortableTextBlock[];
}

export function PortableTextRenderer({ body }: PortableTextRendererProps) {
  return (
    <div className="max-w-none">
      <PortableText value={body} components={components} />
    </div>
  );
}
