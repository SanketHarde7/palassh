"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, ShoppingBag, Menu, X, Sparkles, Leaf } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Botanical Green & Saffron Luxury Strip */}
      <div className="bg-gradient-to-r from-[#064E3B] via-[#0F3D2E] to-[#C2410C] px-4 py-2 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-[11px] font-medium tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>
              Thane & Mumbai Morning Slot: <strong className="text-amber-200">5:00 AM – 8:00 AM</strong>
            </span>
          </div>
          <div className="hidden items-center gap-2 md:flex text-emerald-100">
            <Leaf className="h-3.5 w-3.5 text-emerald-300" />
            <span>Midnight Farm Harvest • Zero Cold Storage</span>
          </div>
        </div>
      </div>

      {/* Main Minimalist Glass Header */}
      <div className="border-b border-orange-100/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Clean Unclipped PALASSH Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-orange-200/80 bg-white p-1 shadow-xs transition group-hover:border-[#E8502B]">
              <img
                src="/images/logo.jpeg"
                alt="PALASSH"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-[0.14em] text-[#E8502B] leading-none">
                PALASSH
              </span>
              <span className="mt-1 text-[10px] font-medium tracking-widest text-emerald-800/80 uppercase">
                Sacred Morning Blooms
              </span>
            </div>
          </Link>

          {/* Center: Floating Pill Dock Navigation */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-stone-200/80 bg-[#FAF7F2]/90 p-1.5 shadow-2xs">
            <Link
              href="/#plans"
              className="rounded-full px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-white hover:text-[#E8502B] hover:shadow-2xs"
            >
              Subscription Plans
            </Link>
            <Link
              href="/#how-it-works"
              className="rounded-full px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-white hover:text-[#E8502B] hover:shadow-2xs"
            >
              How It Works
            </Link>
            <Link
              href="/#pincode-check"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-50/80"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              Check Pincode
            </Link>
            <Link
              href="/my-orders"
              className="rounded-full px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-white hover:text-[#E8502B] hover:shadow-2xs"
            >
              Pause / My Orders
            </Link>
          </nav>

          {/* Right: Refined Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/my-orders"
              className="rounded-full border border-emerald-800/20 bg-emerald-50/60 px-4 py-2.5 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100/80"
            >
              My Account
            </Link>
            <Link
              href="/#plans"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E8502B] to-[#F59E0B] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition hover:brightness-105"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Subscribe @ ₹76</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-orange-100 p-2.5 text-stone-700 lg:hidden hover:bg-orange-50"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-orange-100 bg-white px-4 pt-3 pb-6 lg:hidden space-y-2">
            <Link
              href="/#plans"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-800 hover:bg-orange-50"
            >
              🌸 Subscription Plans (₹76 / ₹510 / ₹2,100)
            </Link>
            <Link
              href="/#pincode-check"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
            >
              📍 Check Thane & Mumbai Pincode
            </Link>
            <Link
              href="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-800 hover:bg-orange-50"
            >
              ⏸️ Pause or Manage Subscription
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}