"use client";

import React from "react";
import Link from "next/link";
import {
  Leaf,
  Clock,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Flower2,
  Sprout,
  Sun,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const SHOP_ADDRESS =
  "6X4X+HJ5 Glenmark Residency, 60 Feet Rd, Kharegaon, Kalwa, Thane, Maharashtra 400605";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FAF7F2] py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16 sm:space-y-24">
        {/* 1. HERO STORY BANNER (Saffron-Orange + Botanical Light-Green Mix) */}
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-emerald-800/40 bg-gradient-to-br from-[#071C15] via-[#0B2E22] to-[#123829] p-6 sm:p-12 lg:p-16 text-white shadow-[0_28px_70px_-15px_rgba(7,28,21,0.45)]">
            {/* Dual Orange + Light Green Ambient Glows */}
            <div className="pointer-events-none absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#E8502B]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-white/10 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-300 backdrop-blur-xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#F05A36]" />
                  <span>॥ जय जय रघुवीर समर्थ ॥ • Thane&apos;s Sacred Flower Concierge</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]">
                  PALASSH:{" "}
                  <span className="block mt-1 bg-gradient-to-r from-[#FF7A59] via-amber-300 to-emerald-300 bg-clip-text text-transparent italic font-normal font-serif">
                    flowers that pray with you.
                  </span>
                </h1>

                <p className="text-xs sm:text-base lg:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
                  Born in Thane, PALASSH was started with a simple realization: the flowers we offer to God every morning should be overflowing with life, natural dew, and farm fragrance—never wilted from 4 days inside a market ice box.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/#plans"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] via-[#F05A36] to-emerald-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
                  >
                    <span>Explore Subscriptions (From ₹49)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-950/60 px-6 py-3.5 text-xs sm:text-sm font-bold text-emerald-200 hover:bg-emerald-900/80 transition"
                  >
                    <span>Shop Fresh Flowers</span>
                  </Link>
                </div>
              </div>

              {/* Right Showcase Image Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border-4 border-white/15 bg-stone-900 shadow-2xl aspect-4/3">
                  <img
                    src="/images/hero-banner.jpg"
                    alt="PALASSH Sacred Morning Blooms"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071C15] via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 rounded-2xl border border-white/15 bg-black/55 p-3.5 backdrop-blur-md">
                    <p className="font-serif text-sm font-bold text-amber-300">
                      100% Zero Cold-Storage Guarantee
                    </p>
                    <p className="text-[11px] text-emerald-100">
                      Harvested at 1:30 AM • Delivered 6:00 AM – 8:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 2. THE 4-STAGE MIDNIGHT-TO-MANDIR JOURNEY */}
        <div className="space-y-10">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-100 to-emerald-100 border border-emerald-300/80 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-950">
                <Sprout className="h-3.5 w-3.5 text-[#E8502B]" />
                <span>Midnight-to-Mandir Supply Chain</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
                How Your Flowers Travel Every Single Night
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                While Thane sleeps, our farmers and sorting teams work through the night so your morning puja thali is blessed with fresh blooms.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                time: "01:30 AM",
                icon: Sprout,
                accent: "from-[#E8502B] to-amber-500",
                title: "Farm Harvest in Nashik & Dahanu",
                desc: "Partner farmers hand-pluck fresh Marigold (झेंडू), Chrysanthemum (शेवंती), and Red Hibiscus (लाल जास्वंद) buds under cool night skies.",
              },
              {
                time: "04:00 AM",
                icon: Flower2,
                accent: "from-emerald-600 to-teal-500",
                title: "Kalwa Hub Ritual Sorting",
                desc: "Blooms arrive at our Kharegaon, Kalwa hub where crushed petals are removed and sacred Tulsi leaves are added to breathable pouches.",
              },
              {
                time: "06:00 AM",
                icon: Clock,
                accent: "from-[#E8502B] to-emerald-600",
                title: "Silent Doorstep Drop",
                desc: "Between 6:00 AM – 8:00 AM, our riders silently hang your flower pouch on your door handle across Thane pincodes 400601–400608.",
              },
              {
                time: "07:00 AM",
                icon: Sun,
                accent: "from-amber-500 to-emerald-600",
                title: "Your Morning Aarti",
                desc: "You open your door to dewy, fragrant temple-grade flowers—with complete flexibility to customize or pause before 8:00 PM.",
              },
            ].map((step, i) => (
              <ScrollReveal key={step.time} delayMs={i * 110}>
                <div className="group rounded-3xl border border-stone-200/90 bg-white p-6 shadow-[0_14px_35px_-10px_rgba(28,22,19,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E8502B]/60 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full bg-gradient-to-r ${step.accent} px-3 py-1 text-[11px] font-bold text-white shadow-xs`}
                      >
                        {step.time}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <step.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-stone-600">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* 3. OUR SACRED BOTANICAL COLLECTION (English + Marathi) */}
        <ScrollReveal>
          <div className="rounded-3xl sm:rounded-[2.5rem] border border-emerald-900/15 bg-gradient-to-br from-white via-[#FFFDFB] to-emerald-50/50 p-6 sm:p-10 lg:p-12 shadow-xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E8502B]">
                  Sacred Puja Varieties
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-4xl font-bold text-stone-900">
                  Blooms Curated for Every Deity
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E8502B] to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm w-fit"
              >
                <span>Order Individual Packs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  name: "Marigold",
                  marathi: "झेंडू",
                  image: "/images/merigold.jpeg",
                  deity: "Toran & Daily Archana",
                  desc: "Rich saffron and golden blooms plucked fresh from Nashik fields for auspicious daily worship.",
                },
                {
                  name: "Chrysanthemum",
                  marathi: "शेवंती",
                  image: "/images/chrysanthemum.jpeg",
                  deity: "Goddess Lakshmi & Lord Vishnu",
                  desc: "Long-lasting ivory and yellow petals that stay radiant on your altar from morning aarti till night.",
                },
                {
                  name: "Red Hibiscus",
                  marathi: "लाल जास्वंद",
                  image: "/images/hibiscus.jpeg",
                  deity: "Lord Ganesha & Goddess Durga",
                  desc: "Hand-picked crimson buds from Dahanu that bloom open right on your home mandir.",
                },
              ].map((flw) => (
                <div
                  key={flw.name}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-16/10 w-full overflow-hidden bg-stone-100">
                      <img
                        src={flw.image}
                        alt={flw.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-xl font-bold text-stone-900">
                          {flw.name}
                        </h3>
                        <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
                          {flw.marathi}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8502B]">
                        {flw.deity}
                      </p>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {flw.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 4. WHY THANE FAMILIES CHOOSE PALASSH */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: Leaf,
              title: "100% Altar-Grade Purity",
              desc: "Never stepped on, never stored in ice boxes, and packed in plastic-free breathable pouches that keep petals dewy.",
            },
            {
              icon: HeartHandshake,
              title: "Day-Wise Checkbox Control",
              desc: "Want only Red Hibiscus (लाल जास्वंद) on Tuesday and Mixed Flowers on Wednesday? Tick your preference anytime before 8 PM.",
            },
            {
              icon: ShieldCheck,
              title: "Guaranteed Festive Quotas",
              desc: "While market prices triple during festivals, our Weekly (up to 2 KG) and Monthly (up to 3 KG) subscribers get priority farm quotas.",
            },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delayMs={i * 120}>
              <div className="rounded-3xl border border-orange-200/70 bg-white p-6 sm:p-8 shadow-md h-full space-y-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E8502B] to-emerald-600 text-white shadow-sm">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-600">
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* 5. THANE DISPATCH HUB & FINAL CTA */}
        <ScrollReveal>
          <div className="rounded-3xl sm:rounded-[2.5rem] border border-emerald-900/20 bg-gradient-to-r from-[#071C15] via-[#0D3325] to-[#071C15] p-6 sm:p-10 lg:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-amber-300/30 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-300">
                <MapPin className="h-3.5 w-3.5 text-[#F05A36]" />
                <span>Thane Dispatch Hub (Pincodes 400601 – 400608)</span>
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold">
                Sorted Fresh Every Morning in Kalwa, Thane
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                {SHOP_ADDRESS}. Serving Thane West (400601), Naupada (400602), Kopri (400603), Wagle Estate (400604), Kalwa (400605), Vartak Nagar (400606), Ghodbunder Rd (400607) & Balkum (400608).
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-amber-200 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Single Slot: 6:00 AM – 8:00 AM
                </span>
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="h-4 w-4 text-[#F05A36]" />
                  WhatsApp Concierge Support
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <Link
                href="/#plans"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] via-[#F05A36] to-emerald-600 px-7 py-4 text-xs sm:text-sm font-bold text-white shadow-xl transition hover:brightness-110"
              >
                <span>Start One Day Trial @ ₹49</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#pincode-check"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-white/10 px-6 py-4 text-xs sm:text-sm font-bold text-white hover:bg-white/15"
              >
                <span>Check Pincode</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}