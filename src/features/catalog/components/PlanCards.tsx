"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Flower2,
  ArrowUpRight,
  Clock,
  Scale,
  SlidersHorizontal,
  Eye,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import {
  INITIAL_PLANS,
  SubscriptionPlan,
  FlowerProduct,
  FlowerSelectionMode,
  getActiveFlowersCatalog,
} from "../types";

interface PlanCustomizationState {
  mode: FlowerSelectionMode;
  selectedFlowers: string[];
}

export function PlanCards({
  plans = INITIAL_PLANS,
}: {
  plans?: SubscriptionPlan[];
}) {
  const [availableFlowers, setAvailableFlowers] = useState<FlowerProduct[]>([]);
  const [activeDetailPlan, setActiveDetailPlan] =
    useState<SubscriptionPlan | null>(null);

  const [customizations, setCustomizations] = useState<
    Record<string, PlanCustomizationState>
  >({
    "plan-daily": {
      mode: "MIXED",
      selectedFlowers: ["Marigold"],
    },
    "plan-weekly": {
      mode: "MIXED",
      selectedFlowers: ["Marigold", "Red Hibiscus"],
    },
    "plan-monthly": {
      mode: "MIXED",
      selectedFlowers: ["Marigold", "Chrysanthemum", "Red Hibiscus"],
    },
  });

  useEffect(() => {
    const flowers = getActiveFlowersCatalog().filter((f) => f.inStock);
    setAvailableFlowers(flowers);
  }, []);

  const toggleMixedCheckbox = (planId: string) => {
    setCustomizations((prev) => {
      const currentMode = prev[planId]?.mode || "MIXED";
      const nextMode: FlowerSelectionMode =
        currentMode === "MIXED" ? "CUSTOM" : "MIXED";
      return {
        ...prev,
        [planId]: {
          mode: nextMode,
          selectedFlowers:
            prev[planId]?.selectedFlowers?.length > 0
              ? prev[planId].selectedFlowers
              : [availableFlowers[0]?.name || "Marigold"],
        },
      };
    });
  };

  const toggleFlowerCheckbox = (planId: string, flowerName: string) => {
    setCustomizations((prev) => {
      const isCurrentlyMixed = prev[planId]?.mode === "MIXED";
      const current = isCurrentlyMixed
        ? []
        : prev[planId]?.selectedFlowers || [];
      const exists = current.includes(flowerName);

      const updated = exists
        ? current.length > 1
          ? current.filter((f) => f !== flowerName)
          : current
        : [...current, flowerName];

      return {
        ...prev,
        [planId]: {
          mode: "CUSTOM",
          selectedFlowers: updated,
        },
      };
    });
  };

  const buildCheckoutUrl = (plan: SubscriptionPlan) => {
    const config = customizations[plan.id] || {
      mode: "MIXED",
      selectedFlowers: ["Marigold"],
    };
    const query = new URLSearchParams({
      plan: plan.slug,
      mode: config.mode,
      flowers:
        config.mode === "MIXED"
          ? "Mixed Sacred Box (Marigold, Chrysanthemum & Red Hibiscus)"
          : config.selectedFlowers.join(", "),
    }).toString();
    return `/checkout?${query}`;
  };

  return (
    <section id="plans" className="py-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/20 bg-[#071C15] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300 shadow-xs">
          <Flower2 className="h-3.5 w-3.5 text-[#F05A36]" />
          <span>Sacred Morning Subscriptions</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900">
          Choose Your Daily Puja Plan
        </h2>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
          Delivered silently between{" "}
          <strong className="text-emerald-950">5:00 AM – 8:00 AM</strong>. Click{" "}
          <strong className="text-[#E8502B]">View Full Details</strong> on any
          plan to customize your flowers or see complete benefits.
        </p>
      </div>

      {/* 3 Minimal, Uncluttered Luxury Cards */}
      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
        {plans.map((plan) => {
          const isPopular = plan.isPopular;
          const config = customizations[plan.id] || {
            mode: "MIXED",
            selectedFlowers: ["Marigold"],
          };

          return (
            <div
              key={plan.id}
              className={`group relative flex flex-col overflow-hidden rounded-[2rem] transition-all duration-300 ${
                isPopular
                  ? "border-2 border-[#D97706] bg-[#071C15] text-white shadow-2xl shadow-emerald-950/25 lg:-translate-y-3"
                  : "border border-stone-200/90 bg-white text-stone-900 shadow-lg shadow-stone-900/5 hover:border-emerald-700/40 hover:shadow-xl"
              }`}
            >
              {isPopular && (
                <div className="bg-gradient-to-r from-[#E8502B] via-[#D97706] to-[#E8502B] py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-white">
                  ★ Most Loved • Best Monthly Value ★
                </div>
              )}

              {/* Image Showcase */}
              <div
                onClick={() => setActiveDetailPlan(plan)}
                className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 cursor-pointer"
              >
                <img
                  src={plan.imageUrl}
                  alt={plan.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071C15] via-black/20 to-transparent" />

                {plan.badge && !isPopular && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1 text-[11px] font-bold text-emerald-950 shadow-sm backdrop-blur-md">
                    {plan.badge}
                  </span>
                )}

                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md px-3 py-1 text-[11px] font-semibold border border-white/20">
                    <Scale className="h-3 w-3 text-amber-300" />
                    <span>{plan.pouchWeight}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-950/85 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-emerald-200 border border-emerald-400/30">
                    <Clock className="h-3 w-3 text-emerald-400" />
                    <span>5:00 – 8:00 AM</span>
                  </div>
                </div>
              </div>

              {/* Minimal Card Body (Only Essential Info) */}
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <h3
                    className={`font-serif text-2xl font-bold ${
                      isPopular ? "text-amber-50" : "text-stone-900"
                    }`}
                  >
                    {plan.title}
                  </h3>
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      isPopular ? "text-emerald-100/80" : "text-stone-500"
                    }`}
                  >
                    {plan.subtitle}
                  </p>

                  {/* Compact Price Box */}
                  <div
                    className={`mt-5 rounded-2xl border p-4 flex items-center justify-between ${
                      isPopular
                        ? "border-emerald-800/80 bg-[#0B291F]"
                        : "border-stone-200/80 bg-[#FAF7F2]"
                    }`}
                  >
                    <div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest block ${
                          isPopular ? "text-emerald-300/80" : "text-stone-400"
                        }`}
                      >
                        Prepaid Plan
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span
                          className={`font-serif text-3xl sm:text-4xl font-bold ${
                            isPopular ? "text-white" : "text-stone-900"
                          }`}
                        >
                          ₹{plan.price.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            isPopular ? "text-emerald-200/70" : "text-stone-500"
                          }`}
                        >
                          / {plan.billingCycle}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block rounded-lg bg-[#E8502B] px-2.5 py-1 text-xs font-bold text-white">
                        ₹{plan.perDayEffectivePrice} / morning
                      </span>
                      <p
                        className={`mt-1 text-[11px] font-semibold ${
                          isPopular ? "text-amber-200" : "text-emerald-900"
                        }`}
                      >
                        {plan.deliveriesCount}{" "}
                        {plan.deliveriesCount === 1
                          ? "Morning Drop"
                          : "Morning Drops"}
                      </p>
                    </div>
                  </div>

                  {/* Current Mode Pill */}
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span
                      className={
                        isPopular ? "text-emerald-200/80" : "text-stone-500"
                      }
                    >
                      Flower Selection:
                    </span>
                    <span
                      className={`font-bold ${
                        isPopular ? "text-amber-300" : "text-emerald-900"
                      }`}
                    >
                      {config.mode === "MIXED"
                        ? "Mixed Sacred Box"
                        : `Custom (${config.selectedFlowers.join(", ")})`}
                    </span>
                  </div>

                  {/* Short 2-Line Highlights Only */}
                  <ul
                    className={`mt-4 space-y-2 border-t pt-4 text-xs ${
                      isPopular
                        ? "border-emerald-800/80 text-emerald-100"
                        : "border-stone-100 text-stone-700"
                    }`}
                  >
                    {plan.shortHighlights.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check
                          className={`h-3.5 w-3.5 shrink-0 ${
                            isPopular ? "text-amber-300" : "text-emerald-700"
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons: 1. View Full Details (Above) + 2. Subscribe (Below) */}
                <div className="mt-7 space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveDetailPlan(plan)}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-xs font-bold transition cursor-pointer ${
                      isPopular
                        ? "border-emerald-700 bg-emerald-950/70 text-amber-200 hover:bg-emerald-900"
                        : "border-stone-300 bg-[#FAF7F2] text-stone-800 hover:border-[#E8502B] hover:text-[#E8502B]"
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Full Details & Customize Flowers</span>
                  </button>

                  <Link
                    href={buildCheckoutUrl(plan)}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition ${
                      isPopular
                        ? "bg-gradient-to-r from-[#E8502B] via-[#F05A36] to-[#D97706] text-white shadow-lg shadow-orange-500/30 hover:brightness-110"
                        : "bg-[#071C15] text-white hover:bg-[#E8502B]"
                    }`}
                  >
                    <span>Subscribe to {plan.title}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PLAN FULL DETAIL & CHECKBOX CUSTOMIZER MODAL */}
      {activeDetailPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveDetailPlan(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-stone-100 pb-5">
              <img
                src={activeDetailPlan.imageUrl}
                alt={activeDetailPlan.title}
                className="h-20 w-28 rounded-2xl object-cover border border-stone-200"
              />
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                  <Sparkles className="h-3 w-3 text-[#F05A36]" />
                  <span>{activeDetailPlan.pouchWeight}</span>
                </span>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  {activeDetailPlan.title}
                </h3>
                <p className="text-xs text-stone-500">
                  ₹{activeDetailPlan.price} / {activeDetailPlan.billingCycle} (₹
                  {activeDetailPlan.perDayEffectivePrice} per morning •{" "}
                  {activeDetailPlan.deliveriesCount} deliveries)
                </p>
              </div>
            </div>

            {/* Interactive Checkbox Flower Selector inside Modal */}
            {(() => {
              const config = customizations[activeDetailPlan.id] || {
                mode: "MIXED",
                selectedFlowers: ["Marigold"],
              };
              return (
                <div className="mt-6 space-y-6">
                  <div className="rounded-2xl border border-orange-200/80 bg-[#FAF7F2] p-5 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E8502B] flex items-center gap-1.5">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span>
                        Customize Your Flowers (Tick Mixed OR Separate Checkboxes):
                      </span>
                    </span>

                    {/* Checkbox 1: Mixed Pack */}
                    <label
                      onClick={() => toggleMixedCheckbox(activeDetailPlan.id)}
                      className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs transition cursor-pointer select-none ${
                        config.mode === "MIXED"
                          ? "border-[#E8502B] bg-white text-stone-900 shadow-xs"
                          : "border-stone-200 bg-white/70 text-stone-600"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          config.mode === "MIXED"
                            ? "border-[#E8502B] bg-[#E8502B] text-white"
                            : "border-stone-400 bg-white"
                        }`}
                      >
                        {config.mode === "MIXED" && (
                          <Check className="h-3 w-3 stroke-[3]" />
                        )}
                      </span>
                      <div>
                        <p className="font-bold text-sm text-stone-900">
                          Predefined Mixed Sacred Assortment
                        </p>
                        <p className="mt-0.5 text-xs text-stone-500">
                          {activeDetailPlan.mixedPredefinedBreakdown}
                        </p>
                      </div>
                    </label>

                    {/* Checkboxes 2: Separate Flowers */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        OR Tick Specific Separate Flowers:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {availableFlowers.map((flw) => {
                          const isChecked =
                            config.mode === "CUSTOM" &&
                            config.selectedFlowers.includes(flw.name);
                          return (
                            <label
                              key={flw.id}
                              onClick={() =>
                                toggleFlowerCheckbox(
                                  activeDetailPlan.id,
                                  flw.name
                                )
                              }
                              className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs font-bold transition cursor-pointer select-none ${
                                isChecked
                                  ? "border-emerald-700 bg-emerald-50 text-emerald-950 shadow-2xs"
                                  : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                              }`}
                            >
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                  isChecked
                                    ? "border-emerald-700 bg-emerald-700 text-white"
                                    : "border-stone-400 bg-white"
                                }`}
                              >
                                {isChecked && (
                                  <Check className="h-3 w-3 stroke-[3]" />
                                )}
                              </span>
                              <span>{flw.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Complete Plan Features List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                      Complete Plan Benefits & Sacred Promise
                    </h4>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                      {activeDetailPlan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Modal Footer CTA */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100 pt-5">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>
                        You can also change flowers day-wise in My-Orders
                      </span>
                    </div>
                    <Link
                      href={buildCheckoutUrl(activeDetailPlan)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] via-[#F05A36] to-[#D97706] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25"
                    >
                      <span>
                        Proceed to Subscribe • ₹{activeDetailPlan.price}
                      </span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}