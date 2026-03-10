import { Header } from "@/components/landing/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and Conditions for [COMPANY_NAME]",
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-3.5rem)] bg-background">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Terms and Conditions
          </h1>
          <p className="text-muted-foreground mb-10">
            Last updated: [LAST_UPDATED_DATE]
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                1. Agreement to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using the service provided by [COMPANY_NAME]
                (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) at{" "}
                <strong>[WEBSITE_URL]</strong> (the &ldquo;Service&rdquo;), you
                agree to be bound by these Terms and Conditions. If you disagree
                with any part, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                2. Description of Service
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                [SERVICE_DESCRIPTION]
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the
                Service at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                To use certain features, you must register for an account. You
                agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Accept responsibility for all activity under your account
                </li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                We reserve the right to suspend or terminate accounts that
                violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Violate any applicable law or regulation</li>
                <li>Infringe on the rights of others</li>
                <li>Transmit harmful, offensive, or objectionable content</li>
                <li>
                  Attempt to gain unauthorized access to the Service or its
                  systems
                </li>
                <li>Interfere with or disrupt the Service&rsquo;s operation</li>
                <li>Use the Service for any fraudulent or deceptive purpose</li>
                <li>[ADDITIONAL_RESTRICTIONS]</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                5. Payment and Billing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                [PRICING_MODEL_DESCRIPTION]
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  <strong>Billing Cycle:</strong> [BILLING_CYCLE]
                </li>
                <li>
                  <strong>Payment Methods:</strong> [PAYMENT_METHODS]
                </li>
                <li>
                  <strong>Refund Policy:</strong> [REFUND_POLICY]
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                We reserve the right to change pricing with
                [PRICE_CHANGE_NOTICE] notice. Continued use after a price change
                constitutes acceptance of the new pricing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                6. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content (excluding content provided
                by users) are and will remain the exclusive property of
                [COMPANY_NAME]. The Service is protected by copyright,
                trademark, and other laws. Our trademarks may not be used
                without prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. User Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of content you submit to the Service. By
                submitting content, you grant us a non-exclusive, worldwide,
                royalty-free license to use, reproduce, and display such content
                solely for the purpose of operating and providing the Service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You are solely responsible for the content you submit and
                represent that you have all necessary rights to grant this
                license.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your access immediately, without
                prior notice, for any reason, including breach of these Terms.
                Upon termination, your right to use the Service will immediately
                cease.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You may terminate your account at any time by
                [ACCOUNT_DELETION_METHOD]. Upon termination,
                [DATA_HANDLING_ON_TERMINATION].
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                9. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, [COMPANY_NAME] shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, including loss of profits, data, use, or
                goodwill, arising from your use of the Service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our total liability for any claim arising out of or relating to
                these Terms or the Service shall not exceed the amount you paid
                us in the [LIABILITY_PERIOD] preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                10. Disclaimer of Warranties
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; basis, without warranties of any kind, either
                express or implied, including but not limited to warranties of
                merchantability, fitness for a particular purpose, or
                non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by and construed in accordance with the
                laws of <strong>[GOVERNING_JURISDICTION]</strong>, without
                regard to conflict of law principles. Any disputes arising under
                these Terms shall be subject to the exclusive jurisdiction of
                the courts in [GOVERNING_JURISDICTION].
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                12. Changes to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will
                provide notice of significant changes by posting the new Terms
                on this page and updating the &ldquo;Last updated&rdquo; date.
                Continued use of the Service after changes constitutes
                acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms, please contact us at:
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
