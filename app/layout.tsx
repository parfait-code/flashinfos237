import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import type { Metadata } from "next";

// Métadonnées optimisées pour le SEO
export const metadata: Metadata = {
  title: {
    default: "FlashInfos237 | Actualités du Cameroun et International",
    template: "%s | FlashInfos237"
  },
  description: "FlashInfos237 vous apporte toute l'actualité du Cameroun et internationale en temps réel. Restez informé des dernières nouvelles politiques, économiques, sportives et culturelles.",
  keywords: ["actualités cameroun", "news cameroun", "flash infos", "actualités afrique", "nouvelles camerounaises", "actualités en direct", "breaking news cameroun"],
  authors: [{ name: "FlashInfos237" }],
  creator: "FlashInfos237",
  publisher: "FlashInfos237",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://flashinfos237.com"),
  alternates: {
    canonical: "/",
    languages: {
      'fr': "https://flashinfos237.com",
    },
  },
  openGraph: {
    title: "FlashInfos237 | L'actualité camerounaise en temps réel",
    description: "Découvrez les dernières actualités du Cameroun et du monde entier. Informations fiables, analyses approfondies et couverture complète des événements majeurs.",
    url: "https://flashinfos237.com",
    siteName: "FlashInfos237",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "FlashInfos237 - Actualités du Cameroun",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlashInfos237 | L'actualité camerounaise en temps réel",
    description: "Découvrez les dernières actualités du Cameroun et du monde entier sur FlashInfos237",
    creator: "@flashinfos237",
    images: ["/logo.svg"],
  },
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
  category: "news",
  verification: {
    google: "votre-code-verification-google",
    yandex: "votre-code-verification-yandex",
  },
  other: {
    "geo.region": "CM",
    "geo.placename": "Cameroun",
    "content-language": "fr",
    "revisit-after": "7 days",
  },
};
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}