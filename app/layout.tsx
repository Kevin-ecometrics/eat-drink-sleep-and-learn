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
    template: "%s | EDS"
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
    "tower services"
  ],
  authors: [{ name: "EDS Team" }],
  creator: "EDS Platform",
  publisher: "EDS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Hola - EDS Platform",
    description:
      "Hola! Welcome to EDS - A community platform for sharing and discovering posts about eating, drinking, sleeping, and learning.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: "EDS Platform",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hola - EDS Platform",
    description:
      "Hola! Welcome to EDS - A community platform for sharing and discovering posts.",
    creator: "@edsplatform",
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
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
      <body
        className={`${roboto.variable} ${dmSans.variable} antialiased`}
      >
        <AuthProvider>
          <PostsProvider>{children}</PostsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}