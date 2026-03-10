import { Header } from "@/components/landing/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for [COMPANY_NAME]",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-3.5rem)] bg-background">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-10">
            Last updated: [LAST_UPDATED_DATE]
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to [COMPANY_NAME] (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
                or &ldquo;our&rdquo;). We are committed to protecting your
                personal information and your right to privacy. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our service at{" "}
                <strong>[WEBSITE_URL]</strong> (the &ldquo;Service&rdquo;).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Please read this policy carefully. If you do not agree with the
                terms, please do not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-medium mt-4 mb-2">
                Personal Information You Provide
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We collect personal information that you voluntarily provide
                when you register, make a purchase, or contact us. This may
                include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Name and email address</li>
                <li>Billing and payment information</li>
                <li>Account credentials</li>
                <li>[ADDITIONAL_DATA_COLLECTED]</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-2">
                Information Collected Automatically
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                When you access the Service, we may automatically collect
                certain information, including your IP address, browser type,
                operating system, access times, and the pages you viewed
                directly before and after accessing the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect for purposes including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Providing, operating, and maintaining the Service</li>
                <li>Processing transactions and sending related information</li>
                <li>Sending administrative information and updates</li>
                <li>Responding to inquiries and offering support</li>
                <li>
                  Monitoring and analyzing usage trends to improve the Service
                </li>
                <li>[ADDITIONAL_USE_CASES]</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                4. Sharing Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  <strong>Service Providers:</strong> With third-party vendors
                  who perform services on our behalf (e.g., payment processing,
                  hosting, analytics).
                </li>
                <li>
                  <strong>Legal Requirements:</strong> If required by law or in
                  response to valid requests by public authorities.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets.
                </li>
                <li>
                  <strong>With Your Consent:</strong> For any other purpose with
                  your consent.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                5. Cookies and Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to track
                activity on our Service and store certain information. You can
                instruct your browser to refuse all cookies or indicate when a
                cookie is being sent. However, some parts of the Service may not
                function properly without cookies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                [COOKIE_DETAILS]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We will retain your personal information only for as long as is
                necessary for the purposes set out in this policy. We will
                retain and use your information to the extent necessary to
                comply with our legal obligations, resolve disputes, and enforce
                our policies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                [DATA_RETENTION_PERIOD]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use administrative, technical, and physical security measures
                to protect your personal information. While we have taken
                reasonable steps to secure the information you provide, no
                method of transmission over the Internet or electronic storage
                is 100% secure, and we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                8. Your Privacy Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>The right to access the personal data we hold about you</li>
                <li>The right to request correction of inaccurate data</li>
                <li>The right to request deletion of your data</li>
                <li>The right to withdraw consent at any time</li>
                <li>The right to data portability</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                To exercise these rights, contact us at{" "}
                <strong>[CONTACT_EMAIL]</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                9. Third-Party Services
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service may contain links to third-party websites or use
                third-party services that are not operated by us. We are not
                responsible for the privacy practices of these third parties. We
                encourage you to review their privacy policies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>[THIRD_PARTY_SERVICES]</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                10. Children&rsquo;s Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service does not address anyone under the age of{" "}
                <strong>[MINIMUM_AGE]</strong>. We do not knowingly collect
                personal information from children. If we become aware that we
                have collected personal data from a child without verification
                of parental consent, we take steps to remove that information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                11. Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the &ldquo;Last updated&rdquo; date. You are
                advised to review this page periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions or concerns about this Privacy Policy,
                please contact us at:
              </p>
              <ul className="list-none pl-0 text-muted-foreground space-y-1 mt-2">
                <li>
                  <strong>[COMPANY_NAME]</strong>
                </li>
                <li>Email: [CONTACT_EMAIL]</li>
                <li>[COMPANY_ADDRESS]</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
