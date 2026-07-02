import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-12">
          Last updated: February 2025
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Aqsa Quran Academy (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li><strong>Account information:</strong> Name, email address, password, and profile details when you register</li>
              <li><strong>Enrollment data:</strong> Courses and classes you enroll in, progress, and quiz results</li>
              <li><strong>Communication data:</strong> Messages you send through contact forms or support</li>
              <li><strong>Technical data:</strong> IP address, browser type, and device information for security and analytics</li>
              <li><strong>Newsletter subscription:</strong> Email addresses for marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>Provide and maintain our educational services</li>
              <li>Process enrollments and payments</li>
              <li>Track your learning progress and provide certificates</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Send important updates about your account or courses</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Storage and Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We store your data securely using industry-standard practices. Passwords are encrypted, and we take steps to protect your information from unauthorized access, disclosure, or destruction. We retain your data only as long as necessary to provide our services or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Sharing of Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share data with trusted service providers (e.g., payment processors, email services) who assist in operating our platform, subject to confidentiality agreements. We may disclose information when required by law or to protect our rights and safety.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to maintain your session, remember preferences, and improve your experience. You can control cookie settings through your browser. Disabling certain cookies may affect site functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, please contact us through our Contact page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any questions about this Privacy Policy or your personal data, please contact us through our{" "}
              <Link href="/contact" className="text-primary hover:underline">Contact</Link> page.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
