"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

export default function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <AnplexaLogo size={24} />
            <span className="font-heading text-lg sm:text-xl lowercase">anplexa</span>
            <span className="rounded-full bg-primary/20 border border-primary/50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary">BETA</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-heading font-semibold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground font-medium">Last updated: December 2025</p>
          
          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">1. Introduction</h2>
            <p>Anplexa ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our Service.</p>
            <p className="mt-3">We are based in the United Kingdom and comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">2. Information We Collect</h2>
            <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Account Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address</li>
              <li>Password (encrypted)</li>
              <li>Display name (optional)</li>
              <li>Preferences and settings</li>
            </ul>
            
            <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Usage Data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Conversation history (encrypted)</li>
              <li>Feature usage patterns</li>
              <li>Device and browser information</li>
              <li>IP address</li>
            </ul>

            <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Payment Information</h3>
            <p>Payment processing is handled by Stripe. We do not store your full card details on our servers.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Provide and maintain the Service</li>
              <li>Process transactions and subscriptions</li>
              <li>Personalise your experience</li>
              <li>Send important service updates</li>
              <li>Improve our AI and Service quality</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>End-to-end encryption for conversations</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">5. Your Rights (GDPR)</h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Access</strong> - Request a copy of your personal data</li>
              <li><strong>Rectification</strong> - Correct inaccurate data</li>
              <li><strong>Erasure</strong> - Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Portability</strong> - Receive your data in a portable format</li>
              <li><strong>Object</strong> - Object to processing of your data</li>
              <li><strong>Restrict</strong> - Limit how we use your data</li>
            </ul>
            <p className="mt-4">To exercise these rights, visit your <Link href="/account" className="text-primary hover:underline">Account Settings</Link> or contact us at <a href="mailto:privacy@anplexa.com" className="text-primary hover:underline">privacy@anplexa.com</a>.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">6. Cookies and Analytics</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Keep you signed in</li>
              <li>Remember your preferences</li>
              <li>Analyse usage patterns (with your consent)</li>
            </ul>
            <p className="mt-4">You can manage cookie preferences in your browser settings or through our privacy controls.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">7. Data Retention</h2>
            <p>We retain your personal data for as long as your account is active or as needed to provide services. Upon account deletion, we will remove your personal data within 30 days, except where we are legally required to retain it.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">8. Third-Party Services</h2>
            <p>We use trusted third-party services:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Stripe</strong> - Payment processing</li>
              <li><strong>PostHog</strong> - Analytics (with consent)</li>
              <li><strong>Resend</strong> - Email delivery</li>
            </ul>
            <p className="mt-4">Each provider has their own privacy policy and data handling practices.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">9. Children's Privacy</h2>
            <p>Anplexa is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If we discover we have collected data from someone under 18, we will delete it immediately.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the Service. Your continued use of the Service after changes indicates acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-heading text-foreground mt-8 mb-4">11. Contact Us</h2>
            <p>For privacy-related inquiries:</p>
            <ul className="list-none space-y-2 mt-3">
              <li>Email: <a href="mailto:privacy@anplexa.com" className="text-primary hover:underline">privacy@anplexa.com</a></li>
              <li>General support: <a href="mailto:support@anplexa.com" className="text-primary hover:underline">support@anplexa.com</a></li>
            </ul>
            <p className="mt-4">You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) if you believe your data protection rights have been violated.</p>
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
