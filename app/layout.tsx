import type { Metadata } from "next";
import { Roboto, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { PostsProvider } from "./context/PostsContext";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "EDS - Eat.Drink.Sleep.and.Learn",
    template: "%s | EDS",
  },
  description:
    "Hola! A community platform for sharing and discovering posts about eating, drinking, sleeping, and learning. Connect with others and grow together in our diverse categories including HR, Service, Tower, Front Desk, Maintenance, Valet, and Housekeeping.",
  keywords: [
    "blog",
    "community",
    "hospitality",
    "learning",
    "HR",
    "maintenance",
    "valet",
    "housekeeping",
    "front desk",
    "tower services",
  ],
  authors: [{ name: "EDS Team" }],
  creator: "EDS Platform",
  publisher: "EDS",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Dominio real del sitio
  metadataBase: new URL("https://www.eatdrinksleepandlearn.com"),

  // OpenGraph para previews en WhatsApp, Facebook, Discord, etc.
  openGraph: {
    title: "EDS - Eat.Drink.Sleep.and.Learn",
    description:
      "Hola! Welcome to EDS - A community platform for sharing and discovering posts about eating, drinking, sleeping, and learning.",
    url: "https://www.eatdrinksleepandlearn.com",
    siteName: "EDS Platform",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        width: 512,
        height: 512,
        alt: "EDS Logo",
      },
    ],
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

  // Canonical URL
  alternates: {
    canonical: "https://www.eatdrinksleepandlearn.com",
  },

  // Favicons e íconos de la app
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/png" },
    ],
  },

  // Contacto
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EDS Platform",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Contacto y metadatos adicionales */}
        <meta name="email" content="eat@gmail.com" />
        <meta name="phone" content="+1 (855) 336-2376" />
        <meta name="contact" content="email: eat@gmail.com, phone: +1 (855) 336-2376" />
      </head>
      <body className={`${roboto.variable} ${dmSans.variable} antialiased`}>
        <AuthProvider>
          <PostsProvider>{children}</PostsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}