"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

export default function TermsPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <AnplexaLogo size={24} />
            <span className="font-heading text-lg sm:text-xl lowercase">anplexa</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-heading font-semibold mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground font-medium">Last updated: December 2025</p>
          
          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using Anplexa ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Service.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">2. Age Requirement</h2>
            <p>Anplexa is intended for users aged 18 and over. By using this Service, you confirm that you are at least 18 years old. We reserve the right to terminate accounts of users who do not meet this age requirement.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">3. Service Description</h2>
            <p>Anplexa is a private AI companion service designed for meaningful adult conversations. The Service uses artificial intelligence to provide conversational experiences. While we strive for helpful and engaging interactions, the AI is not a substitute for professional advice, therapy, or medical guidance.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">4. User Accounts</h2>
            <p>To access certain features, you may need to create an account. You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorised use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">5. Subscription and Payments</h2>
            <p>Anplexa offers both free and paid subscription tiers. By subscribing to our PRO service:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>You authorise us to charge your payment method on a recurring basis</li>
              <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
              <li>Refunds are handled in accordance with applicable consumer protection laws</li>
              <li>Prices are displayed in GBP and include applicable taxes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">6. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Engage in any illegal activities</li>
              <li>Harass, abuse, or harm others</li>
              <li>Attempt to circumvent security measures</li>
              <li>Share content involving minors inappropriately</li>
              <li>Distribute malware or harmful content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">7. Intellectual Property</h2>
            <p>All content, features, and functionality of the Service are owned by Anplexa and protected by international copyright, trademark, and other intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Anplexa shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">9. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our sole discretion.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">10. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">11. Contact</h2>
            <p>For questions about these Terms, please contact us at: <a href="mailto:support@anplexa.com" className="text-primary hover:underline">support@anplexa.com</a></p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border/50 px-4 sm:px-6 py-6 safe-bottom">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs text-muted-foreground/50">© 2025 Anplexa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
