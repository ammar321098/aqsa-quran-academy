import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Terms &amp; Agreements
        </h1>
        <p className="text-muted-foreground mb-12">
          Last updated: February 2025
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the Aqsa Quran Academy website and its services, you accept and agree to be bound by these Terms and Agreements. If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Aqsa Quran Academy provides online Quran and Islamic education services, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>Quran recitation and memorization courses</li>
              <li>Tajweed and Arabic language instruction</li>
              <li>Live and recorded classes</li>
              <li>Quizzes and assessments</li>
              <li>Student dashboards and progress tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration and to notify us of any unauthorized use of your account. Aqsa Quran Academy reserves the right to suspend or terminate accounts that violate these terms or engage in misconduct.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Payment and Refunds</h2>
            <p className="text-muted-foreground leading-relaxed">
              Fees for paid courses and services are as displayed at the time of enrollment. Payment is due upon enrollment unless otherwise specified. Refund policies apply as outlined during the checkout process. Contact us for any payment-related inquiries.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree to use our services only for lawful purposes and in accordance with Islamic values. You must not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>Share account access with others</li>
              <li>Distribute course materials without permission</li>
              <li>Engage in harassment or disrespect toward teachers or staff</li>
              <li>Use the platform for any purpose other than learning</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on the Aqsa Quran Academy platform, including course materials, videos, and design elements, is the property of Aqsa Quran Academy or its licensors. You may not copy, modify, or distribute this content without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms &amp; Agreements, please contact us through our{" "}
              <Link href="/contact" className="text-primary hover:underline">Contact</Link> page.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
