import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Novapharm Innovation Technology | Pharmaceutical Strategy & Execution Advisory",
    template: "%s | Novapharm Innovation Technology",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: "Pharmaceutical consulting",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: "Novapharm Innovation Technology | Pharmaceutical Strategy & Execution Advisory",
    description: site.description,
  },
  twitter: {
    card: "summary",
    title: "Novapharm Innovation Technology",
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
  ],
  colorScheme: "light dark",
};

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  email: site.email,
  description: site.description,
  areaServed: ["India", "United Kingdom", "International"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "403, R.K Plaza, Near Utkarsh School, Diwalipura",
    addressLocality: "Vadodara",
    addressRegion: "Gujarat",
    postalCode: "390007",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Pharmaceutical strategy",
    "Product portfolio strategy",
    "Pharmaceutical market entry",
    "Technology transfer",
    "Pharmaceutical manufacturing strategy",
    "Commercial readiness",
    "Supply chain resilience",
    "Digital and AI strategy for life sciences",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <JsonLd id="organisation-schema" value={organisationSchema} />
      </body>
    </html>
  );
}
