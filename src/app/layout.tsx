import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PALASSH | Fresh Puja Flower Subscription in Thane & Mumbai",
  description:
    "Flowers that pray with you. Farm-fresh Marigold, Mogra & sacred puja flowers delivered daily between 5 AM - 8 AM across Thane and Mumbai. Plans starting at ₹76/day.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-white text-stone-900 antialiased selection:bg-orange-100 selection:text-orange-900">
        <FeatureBoundary featureName="LAYOUT">
          <Navbar />
        </FeatureBoundary>
        <main className="flex-1">{children}</main>
        <FeatureBoundary featureName="LAYOUT">
          <Footer />
        </FeatureBoundary>
      </body>
    </html>
  );
}