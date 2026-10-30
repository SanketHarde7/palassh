"use client";
import React from "react";
import { CountUp } from "@/components/shared/CountUp";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const STATS = [
  {
    renderVal: <CountUp end={500} suffix="+" />,
    label: "Thane Families Served",
  },
  {
    renderVal: <CountUp end={3.5} decimals={1} suffix=" KG" />,
    label: "Festive upto /Month",
  },
  {
    renderVal: "6:00 AM",
    label: "Sharp Delivery Start",
  },
  {
    renderVal: <CountUp end={100} suffix="%" />,
    label: "Zero Cold Storage",
  },
];

export function StatBar() {
  return (
    <div className="w-full bg-[#FAF7F2] border-y border-stone-200 py-10 sm:py-12">
      <ScrollReveal variant="blur-scale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-stone-200">
            {STATS.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-3">
                <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
                  {s.renderVal}
                </div>
                <div className="mt-2 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-stone-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

