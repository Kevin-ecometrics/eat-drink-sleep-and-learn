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
  title: "EDS - Eat.Drink.Sleep.and.Learn",
  description:
    "A community platform for sharing and discovering posts about eating, drinking, sleeping, and learning. Connect with others and grow together.",
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
