import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Leaf,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#071C15] via-[#091E16] to-[#04100C] text-stone-300 overflow-hidden">
      {/* Top Saffron + Emerald Glow Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#059669] via-[#E8502B] to-[#F59E0B]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        {/* Top Luxury Floating CTA Banner */}
        <div className="relative z-10 mb-16 rounded-[2rem] border border-white/10 bg-gradient-to-r from-[#E8502B] via-[#D94824] to-[#065F46] p-8 sm:p-10 shadow-2xl">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-200">
                <Sparkles className="h-3.5 w-3.5" /> Start Tomorrow Morning
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                Bring Divine Fragrance to Your 6 AM Puja.
              </h3>
              <p className="text-xs sm:text-sm text-orange-50/90">
                Join 500+ devoted households across Thane West, Ghodbunder, Mulund & Mumbai.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/#plans"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-xs sm:text-sm font-bold text-stone-900 shadow-lg transition hover:bg-amber-50"
              >
                <span>Subscribe from ₹76/day</span>
                <ArrowUpRight className="h-4 w-4 text-[#E8502B]" />
              </Link>
              <Link
                href="/#pincode-check"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-6 py-4 text-xs sm:text-sm font-bold text-white backdrop-blur-xs hover:bg-black/30"
              >
                <span>Verify Pincode</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main 4-Column Wrapper WITH Glowing Giant PALASSH Behind It */}
        <div className="relative">
          {/* BACKGROUND GLOWING WATERMARK BEHIND THE 4 COLUMNS */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none overflow-hidden"
          >
            {/* Soft Ambient Saffron-Emerald Backlight */}
            <div className="absolute h-44 w-3/4 rounded-full bg-gradient-to-r from-[#E8502B]/15 via-amber-400/10 to-emerald-500/15 blur-3xl" />
            <p className="font-serif text-[13.5vw] leading-none font-bold tracking-[0.18em] bg-gradient-to-b from-amber-200/[0.11] via-orange-300/[0.06] to-emerald-400/[0.02] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(232,80,43,0.18)]">
              PALASSH
            </p>
          </div>

          {/* Foreground 4-Column Content (z-10) */}
          <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 pb-12 border-b border-white/10">
            {/* Col 1: Brand Identity */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 overflow-hidden rounded-xl bg-white p-1 shadow-md">
                  <img
                    src="/images/logo.jpeg"
                    alt="PALASSH"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold tracking-[0.15em] text-white block leading-none">
                    PALASSH
                  </span>
                  <span className="text-[11px] italic text-amber-300/90">
                    “Flowers that pray with you”
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-emerald-100/75 max-w-sm">
                Farm-fresh Marigold, Mogra, Hibiscus, Lotus & sacred Tulsi plucked at midnight and delivered silently to your doorstep every morning across Thane & Mumbai.
              </p>

              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/70 px-3.5 py-2 text-xs text-emerald-300 backdrop-blur-xs">
                <Leaf className="h-4 w-4 text-emerald-400" />
                <span>100% Plastic-Free Breathable Pouches</span>
              </div>
            </div>

            {/* Col 2: Sacred Subscriptions */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                Sacred Subscriptions
              </h4>
              <ul className="space-y-3 text-sm text-emerald-100/85">
                <li>
                  <Link
                    href="/checkout?plan=daily-puja-pack"
                    className="hover:text-white transition flex items-center justify-between max-w-[220px]"
                  >
                    <span>Daily Puja Pack</span>
                    <span className="text-xs font-bold text-amber-300">₹76/day</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/checkout?plan=weekly-devotion-pack"
                    className="hover:text-white transition flex items-center justify-between max-w-[220px]"
                  >
                    <span>Weekly Devotion Pack</span>
                    <span className="text-xs font-bold text-amber-300">₹510/wk</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/checkout?plan=monthly-sacred-pack"
                    className="hover:text-white transition flex items-center justify-between max-w-[220px]"
                  >
                    <span>Monthly Sacred Pack</span>
                    <span className="text-xs font-bold text-amber-300">₹2,100/mo</span>
                  </Link>
                </li>
                <li className="pt-1">
                  <Link
                    href="/my-orders"
                    className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold hover:text-white"
                  >
                    <span>⏸️ Pause / Manage My Orders</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Policies & Legal */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                Policies & Legal
              </h4>
              <ul className="space-y-3 text-sm text-emerald-100/85">
                <li>
                  <Link href="/legal/privacy-policy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms-and-conditions" className="hover:text-white transition">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/legal/refund-policy" className="hover:text-white transition">
                    Refund & Cancellation
                  </Link>
                </li>
                <li>
                  <Link href="/legal/shipping-policy" className="hover:text-white transition">
                    Morning Delivery Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Thane & Mumbai Hub */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                Thane & Mumbai Hub
              </h4>
              <ul className="space-y-3.5 text-sm text-emerald-100/85">
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-[#F05A36] mt-1" />
                  <span>Thane West, Ghodbunder, Majiwada, Mulund, Bhandup, Powai & Suburbs</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Morning Drop: 5:00 AM – 8:00 AM</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>+91 98XXXXXXXX (WhatsApp Desk)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-[#F05A36]" />
                  <span>care@palassh.in</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Razorpay Trust Bar */}
        <div className="relative z-10 mt-6 flex flex-col items-center justify-between gap-4 text-xs text-emerald-200/60 sm:flex-row">
          <p>© {new Date().getFullYear()} PALASSH Flowers. Crafted for Sacred Morning Devotion.</p>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-emerald-100">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>100% Secure Prepaid Checkout via Razorpay (UPI • Cards • NetBanking)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}