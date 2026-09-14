import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0F12",
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Millennium Club | Clube privado de negócios",
    template: "%s | Millennium Club",
  },
  description: "Rede privada para empresários, investidores, consultores e representantes criarem conexões estratégicas, parcerias e oportunidades de negócios.",
  keywords: ["clube de negócios", "networking empresarial", "investidores", "empreendedores", "consultores", "oportunidades de negócios"],
  authors: [{ name: "Millennium Club" }],
  creator: "Millennium Club",
  publisher: "Millennium Club",
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
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Millennium Club",
    title: "Millennium Club | Clube privado de negócios",
    description: "Rede privada para empresários, investidores, consultores e representantes criarem conexões estratégicas, parcerias e oportunidades de negócios.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Millennium Club - Clube privado de negócios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Millennium Club | Clube privado de negócios",
    description: "Rede privada para empresários, investidores, consultores e representantes criarem conexões estratégicas, parcerias e oportunidades de negócios.",
    images: ["/og-image.jpg"],
    creator: "@millenniumclub",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Millennium Club",
              alternateName: "Clube Millennium",
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              sameAs: [
                "https://www.linkedin.com/company/millennium-club",
                "https://www.instagram.com/millenniumclub",
              ],
              description: "Rede privada para empresários, investidores, consultores e representantes criarem conexões estratégicas, parcerias e oportunidades de negócios.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "BR",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Millennium Club",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${siteUrl}/busca?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-obsidian text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}