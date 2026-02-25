import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kognitrix AI — Intelligence-as-a-Service for Humans & Agents",
    template: "%s | Kognitrix AI",
  },
  description:
    "AI-powered services platform for developers and AI agents. Content generation, code assistance, image creation, document analysis, data extraction, and translation. Pay-per-use API with no subscriptions required.",
  keywords: [
    "AI API",
    "AI services",
    "AI content generation",
    "AI code assistant",
    "AI image generator",
    "AI API for agents",
    "MCP server",
    "pay per use AI",
    "AI platform 2026",
    "Kognitrix",
  ],
  authors: [{ name: "Kognitrix AI" }],
  creator: "Kognitrix AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kognitrix AI",
    title: "Kognitrix AI — Intelligence-as-a-Service for Humans & Agents",
    description:
      "AI-powered services via Web, REST API, and MCP. Pay-per-use. No subscription required.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kognitrix AI — Intelligence-as-a-Service",
    description:
      "AI services for developers & agents. Content, Code, Images, Documents, Translation. Pay-per-use.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "eDw2fWEXVf7ksLhgsc25Dxh4O_h3lT81o7SH6rKQGpQ",
  },
  metadataBase: new URL("https://kognitrix.com"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Kognitrix AI",
              description:
                "AI-powered services platform for developers and AI agents",
              url: "https://kognitrix.com",
              logo: "https://kognitrix.com/logo.png",
              foundingDate: "2026",
              founders: [
                {
                  "@type": "Person",
                  name: "Muhammad Farjad Ali Raza",
                },
              ],
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "USD",
                lowPrice: "0.03",
                highPrice: "199",
                offerCount: "6",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
