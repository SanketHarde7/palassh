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
} from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FAF7F2] py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-14 sm:space-y-20">
        {/* 1. Hero Story Banner */}
        <ScrollReveal>
          <div className="rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#071C15] via-[#0B2B20] to-[#071C15] p-6 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden border border-emerald-800/60">
            <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/90 px-3.5 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Our Sacred Heritage • Thane</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                PALASSH:{" "}
                <span className="italic font-normal text-amber-300 font-serif">
                  flowers that pray with you.
                </span>
              </h1>
              <p className="text-xs sm:text-base lg:text-lg text-emerald-100/85 leading-relaxed">
                Born in Thane with the blessings of{" "}
                <strong className="text-amber-200">“॥ जय जय रघुवीर समर्थ ॥”</strong>, PALASSH was created with a single devotion: to ensure no family ever has to offer wilted, cold-storage flowers on their morning home mandir.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* 2. 4-Stage Midnight-to-Mandir Journey */}
        <div className="space-y-8">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
                Zero Cold Storage Supply Chain
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
                From Farm Stems at 1:30 AM to Your Puja by 6:00 AM
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                time: "01:30 AM",
                icon: Sprout,
                title: "Nashik & Dahanu Harvest",
                desc: "Partner farmers hand-pluck fresh Marigold (झेंडू), Chrysanthemum (शेवंती), and Red Hibiscus (लाल जास्वंद) under cool night skies.",
              },
              {
                time: "04:00 AM",
                icon: Flower2,
                title: "Kalwa Hub Ritual Sorting",
                desc: "Blooms arrive at our Kharegaon, Kalwa hub where every petal is inspected and packed in breathable eco-pouches.",
              },
              {
                time: "06:00 AM",
                icon: Clock,
                title: "Silent Doorstep Drop",
                desc: "Between 6:00 AM – 8:00 AM, our riders hang your pouch silently on your door across Thane pincodes 400601–400608.",
              },
              {
                time: "07:00 AM",
                icon: Sun,
                title: "Your Morning Aarti",
                desc: "You open your door to dewy, fragrant temple-grade flowers—with complete flexibility to pause before 8 PM.",
              },
            ].map((step, i) => (
              <ScrollReveal key={step.time} delayMs={i * 110}>
                <div className="rounded-3xl border border-emerald-900/15 bg-white p-6 shadow-md h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-[11px] font-bold text-emerald-900">
                        {step.time}
                      </span>
                      <step.icon className="h-5 w-5 text-emerald-700" />
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

        {/* 3. Why Thane Families Trust PALASSH */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: Leaf,
              title: "100% Altar-Grade Purity",
              desc: "Never stepped on, never kept in ice boxes, and never sprayed with artificial chemical scents.",
            },
            {
              icon: HeartHandshake,
              title: "Fair to Farmers & Families",
              desc: "By sourcing directly from growers and offering ₹49 Daily, ₹329 Weekly, and ₹1,350 Monthly plans, everyone thrives.",
            },
            {
              icon: ShieldCheck,
              title: "Guaranteed Festive Quotas",
              desc: "While market prices triple on festivals, our Weekly (2 KG) and Monthly (3 KG) members enjoy guaranteed festive flower quotas.",
            },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delayMs={i * 120}>
              <div className="rounded-3xl border border-emerald-100 bg-white p-6 sm:p-8 shadow-md h-full space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white">
                  <item.icon className="h-5 w-5" />
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

        {/* 4. Thane Hub Address & CTA */}
        <ScrollReveal>
          <div className="rounded-3xl sm:rounded-[2.5rem] border border-emerald-900/15 bg-white p-6 sm:p-10 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-800">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Thane Dispatch Center (400601 – 400608)</span>
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                6X4X+HJ5 Glenmark Residency, Kharegaon, Kalwa
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                60 Feet Rd, Kharegaon, Kalwa, Thane, Maharashtra 400605. Delivering every morning between 6:00 AM – 8:00 AM across Thane West, Naupada, Kopri, Wagle Estate, Kalwa, Vartak Nagar, Ghodbunder & Balkum.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <Link
                href="/#plans"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-7 py-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/25 hover:brightness-105"
              >
                <span>Start Morning Ritual (From ₹49)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50/70 px-6 py-4 text-xs sm:text-sm font-bold text-emerald-950 hover:bg-emerald-100"
              >
                <span>Browse All Flowers</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}