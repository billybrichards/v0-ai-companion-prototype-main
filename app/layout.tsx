import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Inter, Montserrat, Fira_Code } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600"],
  display: "swap",
})

const firaCode = Fira_Code({ 
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anplexa.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Anplexa - Your Private AI Companion for Meaningful Conversations",
    template: "%s | Anplexa"
  },
  description: "Anplexa is your private AI companion for meaningful adult conversations. Experience judgment-free, intimate dialogue with complete privacy and discretion. No tracking, no judgment, just connection.",
  keywords: [
    "AI companion",
    "private AI chat",
    "adult AI conversation",
    "intimate AI",
    "emotional AI companion",
    "private chat",
    "AI therapy",
    "mental wellness AI",
    "confidential AI",
    "relationship AI",
    "personal AI assistant",
    "NSFW AI chat",
    "adult chatbot",
    "anonymous AI companion"
  ],
  authors: [{ name: "Anplexa", url: siteUrl }],
  creator: "Anplexa",
  publisher: "Anplexa",
  applicationName: "Anplexa",
  category: "Lifestyle",
  classification: "Adult",
  
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Anplexa",
    title: "Anplexa - Your Private AI Companion",
    description: "Experience meaningful, judgment-free conversations with your private AI companion. Complete discretion, total privacy.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Anplexa - The Private Pulse",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Anplexa - Your Private AI Companion",
    description: "Experience meaningful, judgment-free conversations with your private AI companion. Complete discretion, total privacy.",
    images: ["/og-image.png"],
    creator: "@anplexa",
    site: "@anplexa",
  },

  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#7B2CBF" },
    ],
  },

  manifest: "/site.webmanifest",

  alternates: {
    canonical: siteUrl,
  },

  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },

  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Anplexa",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#7B2CBF",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#121212",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7B2CBF" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Anplexa",
    alternateName: "The Private Pulse",
    description: "Your private AI companion for meaningful adult conversations",
    url: siteUrl,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
      description: "Free tier with 2 messages, PRO subscription available"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1024",
      bestRating: "5",
      worstRating: "1"
    },
    author: {
      "@type": "Organization",
      name: "Anplexa",
      url: siteUrl
    },
    provider: {
      "@type": "Organization",
      name: "Anplexa",
      url: siteUrl
    }
  }

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Anplexa",
    url: siteUrl,
    logo: `${siteUrl}/anplexa-logo.svg`,
    description: "Private AI companion for meaningful adult conversations",
    foundingDate: "2025",
    sameAs: []
  }

  return (
    <html lang="en" className="dark">
      <head>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2042123676520826');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2042123676520826&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={`${inter.variable} ${montserrat.variable} ${firaCode.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
