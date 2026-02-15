import Link from "next/link";
import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Terms & Conditions | V-Dub's Cards",
  description:
    "Terms and conditions for V-Dub's Cards. Rules for using our store and services.",
};

const sections = [
  {
    title: "Section 1 - Overview",
    content:
      "These terms govern your use of V-Dub's Cards and our services. By accessing or using our store, you agree to be bound by these terms.",
  },
  {
    title: "Section 2 - Online Store Terms",
    content:
      "By agreeing to these terms, you confirm you are of legal age in your jurisdiction. You may not use our products for any illegal or unauthorized purpose.",
  },
  {
    title: "Section 3 - Accuracy, Completeness and Timeliness of Information",
    content:
      "We strive for accuracy but do not warrant that product descriptions, pricing or other content is complete or error-free. We reserve the right to correct errors and update information.",
  },
  {
    title: "Section 4 - Modifications to the Service and Prices",
    content:
      "Prices are subject to change without notice. We may modify or discontinue the service at any time. We shall not be liable to you or any third party for any modification, suspension or discontinuance.",
  },
  {
    title: "Section 5 - Products or Services",
    content:
      "Certain products may be available in limited quantities. We reserve the right to limit sales. Product images are for illustration; we cannot guarantee your device will display colors accurately.",
  },
  {
    title: "Section 6 - Accuracy of Billing and Account Information",
    content:
      "We reserve the right to refuse any order. You agree to provide current, complete and accurate purchase and account information. We may contact you regarding orders.",
  },
  {
    title: "Section 7 - Optional Tools",
    content:
      "We may provide access to third-party tools over which we have no control. Your use of optional tools is at your own risk. We may offer new tools without prior notice.",
  },
  {
    title: "Section 8 - Third-Party Links",
    content:
      "Our service may contain links to third-party websites. We are not responsible for the content or practices of these sites. We encourage you to read their terms and privacy policies.",
  },
  {
    title: "Section 9 - User Comments, Feedback and Other Submissions",
    content:
      "If you submit ideas, suggestions or other content to us, we may use them without obligation to you. We may edit, copy, publish and distribute such content without restriction.",
  },
  {
    title: "Section 10 - Personal Information",
    content:
      "Your submission of personal information is governed by our Privacy Policy. See our ",
    link: { href: "/privacy", label: "Privacy Policy" },
    contentAfter: " for details.",
  },
  {
    title: "Section 11 - Errors, Inaccuracies and Omissions",
    content:
      "Our site may contain typographical errors, inaccuracies or omissions. We reserve the right to correct any errors and to change or update information at any time without prior notice.",
  },
  {
    title: "Section 12 - Prohibited Uses",
    content:
      "You may not use the site for unlawful purposes, to harass or harm others, to transmit viruses, or to attempt to gain unauthorized access to our systems or networks.",
  },
  {
    title: "Section 13 - Disclaimer of Warranties; Limitation of Liability",
    content:
      "The service is provided \"as is\" without warranties of any kind. We shall not be liable for any indirect, incidental, special or consequential damages arising from your use of the service.",
  },
  {
    title: "Section 14 - Indemnification",
    content:
      "You agree to indemnify and hold us harmless from any claims, damages or expenses arising from your breach of these terms or your use of the service.",
  },
  {
    title: "Section 15 - Severability",
    content:
      "If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.",
  },
  {
    title: "Section 16 - Termination",
    content:
      "We may terminate or suspend your access to the service at any time for any reason, including breach of these terms.",
  },
  {
    title: "Section 17 - Entire Agreement",
    content:
      "These terms constitute the entire agreement between you and V-Dub's Cards regarding the service and supersede any prior agreements.",
  },
  {
    title: "Section 18 - Governing Law",
    content:
      "These terms shall be governed by the laws of the Netherlands. Any disputes shall be subject to the exclusive jurisdiction of the courts of the Netherlands.",
  },
  {
    title: "Section 19 - Changes to Terms of Service",
    content:
      "We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.",
  },
  {
    title: "Section 20 - Contact Information",
    content:
      "Questions about these terms? Contact us at ",
    link: { href: "mailto:Vdubscards@hotmail.com", label: "Vdubscards@hotmail.com", external: true },
    contentAfter: ".",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: 27 March 2024
          </p>

          <div className="mt-10 space-y-6">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-lg border border-gray-200 bg-white p-6"
              >
                <h2 className="font-bold text-gray-900">{section.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {section.content}
                  {"link" in section && section.link && (
                    <>
                      {section.link.external ? (
                        <a
                          href={section.link.href}
                          className="font-medium text-primary hover:underline"
                        >
                          {section.link.label}
                        </a>
                      ) : (
                        <Link
                          href={section.link.href}
                          className="font-medium text-primary hover:underline"
                        >
                          {section.link.label}
                        </Link>
                      )}
                      {section.contentAfter}
                    </>
                  )}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
