"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Sparkles,
  Check,
  ArrowLeft,
  SlidersHorizontal,
  ShoppingBag,
  Lock,
} from "lucide-react";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";
import {
  INITIAL_PLANS,
  FlowerProduct,
  FlowerSelectionMode,
  getActiveFlowersCatalog,
  saveStoredCart,
} from "@/features/catalog/types";
import { logger } from "@/lib/logger";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderType =
    searchParams.get("type") === "ONE_TIME" ? "ONE_TIME" : "SUBSCRIPTION";
  const fromCart = searchParams.get("fromCart") === "true";
  const planSlugParam = searchParams.get("plan") || "weekly-devotion-pack";
  const initialModeParam =
    searchParams.get("mode") === "CUSTOM" ? "CUSTOM" : "MIXED";
  const initialFlowersParam = searchParams.get("flowers") || "";

  const oneTimeFlower = searchParams.get("flower") || "Marigold";
  const oneTimeWeight = searchParams.get("weight") || "";
  const oneTimeQty = Number(searchParams.get("qty") || "1");
  const oneTimePrice = Number(searchParams.get("price") || "80");

  const [availableFlowers, setAvailableFlowers] = useState<FlowerProduct[]>([]);
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string>(planSlugParam);
  const [flowerMode, setFlowerMode] =
    useState<FlowerSelectionMode>(initialModeParam);
  const [selectedCustomFlowers, setSelectedCustomFlowers] = useState<string[]>([
    "Marigold",
  ]);
  const [deliverySlot, setDeliverySlot] = useState<string>("5:00 AM – 6:30 AM");

  // Customer Address Fields
  const [customerName, setCustomerName] = useState("Snehal Deshmukh");
  const [phone, setPhone] = useState("9820123456");
  const [pincode, setPincode] = useState("400607");
  const [society, setSociety] = useState("Hiranandani Estate, Thane West");
  const [flatNo, setFlatNo] = useState("B-1204");
  const [deliveryNote, setDeliveryNote] = useState(
    "Hang pouch on main door handle (Do not ring bell)"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const catalog = getActiveFlowersCatalog().filter((f) => f.inStock);
    setAvailableFlowers(catalog);

    if (initialFlowersParam && initialModeParam === "CUSTOM") {
      const split = initialFlowersParam.split(",").map((s) => s.trim());
      if (split.length > 0) setSelectedCustomFlowers(split);
    }

    try {
      const savedPin = localStorage.getItem("palassh_verified_pincode");
      if (savedPin) {
        const parsed = JSON.parse(savedPin);
        if (parsed.pincode) setPincode(parsed.pincode);
        if (parsed.area) setSociety(parsed.area);
      }
    } catch {
      // Ignore error
    }
  }, [initialFlowersParam, initialModeParam]);

  const currentPlan =
    INITIAL_PLANS.find((p) => p.slug === selectedPlanSlug) || INITIAL_PLANS[1];

  const toggleCustomFlower = (name: string) => {
    setSelectedCustomFlowers((prev) => {
      if (prev.includes(name)) {
        return prev.length > 1 ? prev.filter((item) => item !== name) : prev;
      }
      return [...prev, name];
    });
  };

  const finalFlowerChoiceLabel =
    flowerMode === "MIXED"
      ? `Mixed Sacred Box (${currentPlan.mixedPredefinedBreakdown})`
      : `Separate Flowers: ${selectedCustomFlowers.join(" + ")}`;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomOrderId = `PLS-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullAddress = `${flatNo}, ${society} - ${pincode}`;

    if (orderType === "ONE_TIME") {
      const summaryText =
        fromCart || !oneTimeWeight
          ? oneTimeFlower
          : `${oneTimeQty}x ${oneTimeFlower} (${oneTimeWeight})`;

      const newOneTimeOrder = {
        orderId: randomOrderId,
        flowerSummary: summaryText,
        amountPaid: oneTimePrice,
        deliveryDate: "Tomorrow Morning",
        deliverySlot,
        address: fullAddress,
        status: "CONFIRMED",
      };

      try {
        const existingRaw = localStorage.getItem("palassh_onetime_orders");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem(
          "palassh_onetime_orders",
          JSON.stringify([newOneTimeOrder, ...existing])
        );
        if (fromCart) {
          saveStoredCart([]);
        }
      } catch {
        // Ignore error
      }

      logger.info({
        module: "CHECKOUT",
        action: "ONE_TIME_ORDER_CREATED",
        message: `One-time order ${randomOrderId} created for ₹${oneTimePrice}`,
      });

      setTimeout(() => {
        router.push("/my-orders");
      }, 600);
      return;
    }

    // Create Subscription with Day-Wise Checkbox Schedule
    const scheduleDaysCount = Math.min(currentPlan.deliveriesCount, 14);
    const baseDate = new Date();
    const generatedSchedule = [];

    const defaultSelectedList =
      flowerMode === "MIXED"
        ? ["Marigold", "Chrysanthemum", "Red Hibiscus"]
        : selectedCustomFlowers;

    const dayDefaultFlower =
      flowerMode === "MIXED"
        ? "Mixed Sacred Box (Predefined Quantity)"
        : selectedCustomFlowers.length === 1
        ? `Only ${selectedCustomFlowers[0]}`
        : `${selectedCustomFlowers.join(" + ")} Mix`;

    for (let i = 1; i <= scheduleDaysCount; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      generatedSchedule.push({
        id: `day-${i}`,
        dateISO: d.toISOString().split("T")[0],
        dateLabel: d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        dayName: d.toLocaleDateString("en-IN", { weekday: "long" }),
        isMixed: flowerMode === "MIXED",
        selectedFlowers: defaultSelectedList,
        assignedFlower: dayDefaultFlower,
        status: "SCHEDULED",
      });
    }

    const newSubscription = {
      orderId: randomOrderId,
      planTitle: currentPlan.title,
      pricePaid: currentPlan.price,
      billingCycle: currentPlan.billingCycle,
      totalDeliveries: currentPlan.deliveriesCount,
      remainingDeliveries: currentPlan.deliveriesCount,
      status: "ACTIVE",
      startDate: new Date().toISOString().split("T")[0],
      nextDeliveryDate: `Tomorrow (${deliverySlot})`,
      deliverySlot,
      flowerMode,
      defaultFlowers: dayDefaultFlower,
      customerName,
      phone,
      address: fullAddress,
      deliveryNote,
      pausedDates: [],
      schedule: generatedSchedule,
    };

    try {
      localStorage.setItem(
        "palassh_active_subscription",
        JSON.stringify(newSubscription)
      );
    } catch {
      // Ignore error
    }

    setTimeout(() => {
      router.push("/my-orders");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-[#E8502B]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Storefront</span>
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* LEFT COLUMN: FORM */}
          <form
            onSubmit={handleCompleteOrder}
            className="lg:col-span-7 space-y-8 rounded-[2rem] border border-stone-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-stone-900/5"
          >
            <div className="border-b border-stone-100 pb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                <Sparkles className="h-3 w-3 text-[#F05A36]" />
                <span>
                  {orderType === "ONE_TIME"
                    ? "One-Time Fresh Flower Checkout"
                    : "Customizable Puja Subscription"}
                </span>
              </span>
              <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900">
                {orderType === "ONE_TIME"
                  ? "Confirm Your Morning Flower Order"
                  : "Personalize Your Sacred Ritual"}
              </h1>
            </div>

            {orderType === "SUBSCRIPTION" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                    1. Select Subscription Duration
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {INITIAL_PLANS.map((p) => {
                      const active = p.slug === selectedPlanSlug;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPlanSlug(p.slug)}
                          className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition cursor-pointer ${
                            active
                              ? "border-2 border-[#E8502B] bg-orange-50/40 shadow-xs"
                              : "border-stone-200 bg-white hover:border-stone-300"
                          }`}
                        >
                          <span className="text-xs font-bold text-stone-900">
                            {p.title}
                          </span>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="font-serif text-2xl font-bold text-[#E8502B]">
                              ₹{p.price}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              / {p.billingCycle}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Checkboxes for Mixed vs Separate Flowers */}
                <div className="rounded-2xl border border-orange-200/80 bg-[#FAF7F2] p-5 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <SlidersHorizontal className="h-4 w-4 text-[#E8502B]" />
                    <span>2. Tick Your Flower Preference:</span>
                  </span>

                  {/* Checkbox A: Mixed Pack */}
                  <label
                    onClick={() => setFlowerMode("MIXED")}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs transition cursor-pointer select-none ${
                      flowerMode === "MIXED"
                        ? "border-[#E8502B] bg-white text-stone-900 shadow-xs"
                        : "border-stone-200 bg-white/70 text-stone-600"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        flowerMode === "MIXED"
                          ? "border-[#E8502B] bg-[#E8502B] text-white"
                          : "border-stone-400 bg-white"
                      }`}
                    >
                      {flowerMode === "MIXED" && (
                        <Check className="h-3 w-3 stroke-[3]" />
                      )}
                    </span>
                    <div>
                      <p className="font-bold text-stone-900">
                        Mixed Sacred Assortment (Predefined Quantity)
                      </p>
                      <p className="mt-0.5 text-[11px] text-stone-500">
                        {currentPlan.mixedPredefinedBreakdown}
                      </p>
                    </div>
                  </label>

                  {/* Checkboxes B: Separate Flowers */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      OR Tick Specific Separate Flowers:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {availableFlowers.map((flw) => {
                        const isChecked =
                          flowerMode === "CUSTOM" &&
                          selectedCustomFlowers.includes(flw.name);
                        return (
                          <label
                            key={flw.id}
                            onClick={() => {
                              setFlowerMode("CUSTOM");
                              toggleCustomFlower(flw.name);
                            }}
                            className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs font-bold transition cursor-pointer select-none ${
                              isChecked
                                ? "border-emerald-700 bg-emerald-50 text-emerald-950"
                                : "border-stone-200 bg-white text-stone-700"
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
              </div>
            )}

            {/* Delivery Window */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Select Morning Silent Delivery Window
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  "5:00 AM – 6:30 AM (Early Brahma Muhurta)",
                  "6:30 AM – 8:00 AM (Regular Morning Puja)",
                ].map((slot) => {
                  const shortSlot = slot.split(" (")[0];
                  const active = deliverySlot === shortSlot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setDeliverySlot(shortSlot)}
                      className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left text-xs font-bold transition cursor-pointer ${
                        active
                          ? "border-emerald-700 bg-emerald-50/60 text-emerald-950"
                          : "border-stone-200 bg-white text-stone-700"
                      }`}
                    >
                      <Clock className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Address Form */}
            <div className="space-y-4 border-t border-stone-100 pt-6">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Society & Doorstep Details
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Pincode (Thane/Mumbai)
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Building / Society Name
                  </label>
                  <input
                    type="text"
                    required
                    value={society}
                    onChange={(e) => setSociety(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Flat No. & Wing
                  </label>
                  <input
                    type="text"
                    required
                    value={flatNo}
                    onChange={(e) => setFlatNo(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Silent Drop Instruction
                  </label>
                  <input
                    type="text"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] via-[#F05A36] to-[#D97706] py-4 text-base font-bold text-white shadow-xl shadow-orange-500/25 transition hover:brightness-105 cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>
                {isSubmitting
                  ? "Confirming Your Morning Schedule..."
                  : orderType === "ONE_TIME"
                  ? `Pay ₹${oneTimePrice} & Confirm Flower Order`
                  : `Activate ${currentPlan.title} • ₹${currentPlan.price}`}
              </span>
            </button>
          </form>

          {/* RIGHT COLUMN: ROYAL ORDER SUMMARY CARD */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[2rem] border-2 border-[#D97706]/50 bg-[#071C15] p-7 sm:p-8 text-white shadow-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                PALASSH Concierge Summary
              </span>

              {orderType === "ONE_TIME" ? (
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <ShoppingBag className="h-6 w-6 text-[#F05A36] shrink-0 mt-1" />
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-white">
                        Fresh Flower Order
                      </h2>
                      <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                        {fromCart || !oneTimeWeight
                          ? oneTimeFlower
                          : `${oneTimeQty}x ${oneTimeFlower} (${oneTimeWeight})`}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-emerald-800/80 pt-4 flex items-baseline justify-between">
                    <span className="text-xs text-emerald-200">
                      Total Payable
                    </span>
                    <span className="font-serif text-4xl font-bold text-amber-300">
                      ₹{oneTimePrice}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <h2 className="font-serif text-2xl font-bold text-white">
                    {currentPlan.title}
                  </h2>
                  <p className="text-xs text-emerald-100/80">
                    {currentPlan.deliveriesCount} Morning Deliveries •{" "}
                    {currentPlan.pouchWeight}
                  </p>

                  <div className="rounded-2xl bg-emerald-950/90 border border-emerald-800 p-4 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      Selected Flower Configuration:
                    </span>
                    <p className="text-emerald-50 font-medium leading-relaxed">
                      {finalFlowerChoiceLabel}
                    </p>
                  </div>

                  <div className="border-t border-emerald-800/80 pt-4 flex items-baseline justify-between">
                    <span className="text-xs text-emerald-200">
                      Total Prepaid ({currentPlan.deliveriesCount} Mornings)
                    </span>
                    <span className="font-serif text-4xl font-bold text-amber-300">
                      ₹{currentPlan.price}
                    </span>
                  </div>
                </div>
              )}

              <ul className="mt-6 space-y-3 border-t border-emerald-800/80 pt-5 text-xs text-emerald-100">
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Tick checkboxes day-wise in My-Orders to change flowers
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Pause individual dates anytime before 8:00 PM</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>100% Silent Doorstep Drop ({deliverySlot})</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <FeatureBoundary featureName="CHECKOUT">
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-sm font-semibold text-stone-600">
            Loading PALASSH Sacred Checkout...
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </FeatureBoundary>
  );
}