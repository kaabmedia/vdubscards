import { sanityClient } from "./client";

export interface TermsSection { title: string; content: string }

export interface TermsPageData {
  pageTitle: string;
  lastUpdated: string;
  sections: TermsSection[];
}

const QUERY = `*[_type == "termsPage"][0]{ pageTitle, lastUpdated, sections[]{ title, content } }`;

const DEFAULTS: TermsPageData = {
  pageTitle: "Terms & Conditions",
  lastUpdated: "27 March 2024",
  sections: [
    { title: "Section 1 - Overview", content: "These terms govern your use of V-Dub's Cards and our services. By accessing or using our store, you agree to be bound by these terms." },
    { title: "Section 2 - Online Store Terms", content: "By agreeing to these terms, you confirm you are of legal age in your jurisdiction. You may not use our products for any illegal or unauthorized purpose." },
    { title: "Section 3 - Accuracy, Completeness and Timeliness of Information", content: "We strive for accuracy but do not warrant that product descriptions, pricing or other content is complete or error-free. We reserve the right to correct errors and update information." },
    { title: "Section 4 - Modifications to the Service and Prices", content: "Prices are subject to change without notice. We may modify or discontinue the service at any time. We shall not be liable to you or any third party for any modification, suspension or discontinuance." },
    { title: "Section 5 - Products or Services", content: "Certain products may be available in limited quantities. We reserve the right to limit sales. Product images are for illustration; we cannot guarantee your device will display colors accurately." },
    { title: "Section 6 - Accuracy of Billing and Account Information", content: "We reserve the right to refuse any order. You agree to provide current, complete and accurate purchase and account information. We may contact you regarding orders." },
    { title: "Section 7 - Optional Tools", content: "We may provide access to third-party tools over which we have no control. Your use of optional tools is at your own risk. We may offer new tools without prior notice." },
    { title: "Section 8 - Third-Party Links", content: "Our service may contain links to third-party websites. We are not responsible for the content or practices of these sites. We encourage you to read their terms and privacy policies." },
    { title: "Section 9 - User Comments, Feedback and Other Submissions", content: "If you submit ideas, suggestions or other content to us, we may use them without obligation to you. We may edit, copy, publish and distribute such content without restriction." },
    { title: "Section 10 - Personal Information", content: "Your submission of personal information is governed by our Privacy Policy." },
    { title: "Section 11 - Errors, Inaccuracies and Omissions", content: "Our site may contain typographical errors, inaccuracies or omissions. We reserve the right to correct any errors and to change or update information at any time without prior notice." },
    { title: "Section 12 - Prohibited Uses", content: "You may not use the site for unlawful purposes, to harass or harm others, to transmit viruses, or to attempt to gain unauthorized access to our systems or networks." },
    { title: "Section 13 - Disclaimer of Warranties; Limitation of Liability", content: "The service is provided \"as is\" without warranties of any kind. We shall not be liable for any indirect, incidental, special or consequential damages arising from your use of the service." },
    { title: "Section 14 - Indemnification", content: "You agree to indemnify and hold us harmless from any claims, damages or expenses arising from your breach of these terms or your use of the service." },
    { title: "Section 15 - Severability", content: "If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect." },
    { title: "Section 16 - Termination", content: "We may terminate or suspend your access to the service at any time for any reason, including breach of these terms." },
    { title: "Section 17 - Entire Agreement", content: "These terms constitute the entire agreement between you and V-Dub's Cards regarding the service and supersede any prior agreements." },
    { title: "Section 18 - Governing Law", content: "These terms shall be governed by the laws of the Netherlands. Any disputes shall be subject to the exclusive jurisdiction of the courts of the Netherlands." },
    { title: "Section 19 - Changes to Terms of Service", content: "We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms." },
    { title: "Section 20 - Contact Information", content: "Questions about these terms? Contact us at Vdubscards@hotmail.com" },
  ],
};

export async function getTermsPage(): Promise<TermsPageData> {
  if (!sanityClient) return DEFAULTS;
  try {
    const data = await sanityClient.fetch<Partial<TermsPageData> | null>(QUERY);
    if (!data) return DEFAULTS;
    return {
      pageTitle: data.pageTitle || DEFAULTS.pageTitle,
      lastUpdated: data.lastUpdated || DEFAULTS.lastUpdated,
      sections: data.sections?.length ? data.sections : DEFAULTS.sections,
    };
  } catch {
    return DEFAULTS;
  }
}
