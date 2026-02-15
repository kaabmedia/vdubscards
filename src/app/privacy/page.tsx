import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Privacy Policy | V-Dub's Cards",
  description:
    "Privacy policy for V-Dub's Cards. How we collect, use and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: 27 March 2024
          </p>

          <div className="mt-10 space-y-8">
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-sm leading-relaxed text-gray-600">
                This Privacy Policy describes how V-Dub&apos;s Cards (&quot;we&quot;, &quot;us&quot;,
                &quot;our&quot;) collects, uses, and discloses your personal information when you
                use our services or make purchases from our store. By using our
                services, you agree to the terms of this policy.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">
                Changes to This Privacy Policy
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                We may update this policy to reflect changes in our practices or
                for legal and regulatory reasons. We will notify you of any
                material changes by posting the updated policy on this page.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">
                How We Collect and Use Your Personal Information
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                We collect personal information over the past 12 months to
                provide our services, communicate with you, fulfill legal
                obligations, and protect our rights. Below we describe what we
                collect and how we use it.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">
                What Personal Information We Collect
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Directly from you
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>• Name, address, phone, email</li>
                    <li>• Billing and shipping details</li>
                    <li>• Order and payment information</li>
                    <li>• Account and password</li>
                    <li>• Items viewed, cart, wishlist</li>
                    <li>• Customer support messages</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Through cookies
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Usage data such as device info, browser, network activity via
                    cookies, pixels and similar technologies.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    From third parties
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    From vendors (e.g. Shopify), payment processors, and your
                    interactions with our emails and ads.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">
                How We Use Your Personal Information
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <strong className="text-gray-900">Products and services:</strong>{" "}
                  Process payments, manage orders, fulfill shipments, handle
                  returns and exchanges.
                </li>
                <li>
                  <strong className="text-gray-900">Marketing:</strong> Send
                  marketing communications and tailor ads.
                </li>
                <li>
                  <strong className="text-gray-900">Security:</strong> Detect and
                  prevent fraud and malicious activity.
                </li>
                <li>
                  <strong className="text-gray-900">Communication:</strong>{" "}
                  Provide support and maintain relationships.
                </li>
              </ul>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">Cookies</h2>
              <p className="mt-3 text-sm text-gray-600">
                We use cookies and similar technologies. Our store is powered by
                Shopify. For more information, see{" "}
                <a
                  href="https://www.shopify.com/legal/cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Shopify&apos;s cookie policy
                </a>
                . You can manage cookies in your browser settings.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">
                How We Disclose Personal Information
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                We may disclose information to vendors, payment processors,
                business partners, with your consent, to affiliates, during
                transactions, to comply with law, enforce terms, or protect
                rights.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">
                User Generated Content
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Content you post publicly (e.g. reviews) may be visible to anyone.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">
                Third Party Websites and Links
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                We may link to third-party websites. We are not responsible for
                their privacy practices. Please review their policies.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">Children&apos;s Data</h2>
              <p className="mt-3 text-sm text-gray-600">
                Our services are not intended for children. We do not knowingly
                collect personal information from children.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">
                Security and Retention
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                No security measures are perfect. We retain your information as
                needed for our services, legal obligations, and dispute
                resolution.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">
                Your Rights and Choices
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Depending on your location, you may have rights to access, delete,
                correct, port, restrict processing, withdraw consent, or appeal
                decisions. You may also manage communication preferences. To
                exercise these rights, contact us. We may verify your identity.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">Complaints</h2>
              <p className="mt-3 text-sm text-gray-600">
                If you have concerns, contact us. You may also lodge a complaint
                with your local data protection authority.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">International Users</h2>
              <p className="mt-3 text-sm text-gray-600">
                Your information may be transferred and processed outside your
                country. We use recognized mechanisms to protect your data.
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900">Contact</h2>
              <p className="mt-3 text-sm text-gray-600">
                Questions or requests about this privacy policy? Contact us at{" "}
                <a
                  href="mailto:Vdubscards@hotmail.com"
                  className="font-medium text-primary hover:underline"
                >
                  Vdubscards@hotmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
