import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PALASSH | Sacred Puja Flower Subscription in Thane (400601–400608)",
  description:
    "Flowers that pray with you. Farm-fresh Marigold (झेंडू), Shevanti (शेवंती) & Red Hibiscus (लाल जास्वंद) delivered silently every morning between 6:00 AM – 8:00 AM across Thane pincodes. Plans starting at ₹49/day.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} font-sans scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-white text-stone-900 antialiased selection:bg-orange-100 selection:text-orange-900 font-sans">
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
