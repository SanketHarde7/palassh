"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Lock,
  Sparkles,
} from "lucide-react";
import {
  INITIAL_PLANS,
  SubscriptionPlan,
  CartItem,
  getStoredCart,
  saveStoredCart,
  getCurrentCustomerTier,
  getFestiveModeStatus,
  validateDirectFlowerPurchaseLimit,
  getTomorrowDateString,
} from "@/features/catalog/types";
import { checkPincodeAvailability } from "@/features/pincode-checker/pincode.service";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeParam = searchParams.get("mode");
  const planSlugParam = searchParams.get("plan");
  const customFlowersParam = searchParams.get("flowers");

  const isOneTimeCartCheckout = modeParam === "onetime";

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    INITIAL_PLANS.find((p) => p.slug === planSlugParam) || INITIAL_PLANS[2]
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Point #1: Strictly EMPTY initial state so values appear ONLY as placeholders (not pre-filled text)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    flatWing: "",
    societyName: "",
    startDate: getTomorrowDateString(),
    deliveryNote: "",
  });

  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    serviceable: boolean;
    message: string;
  }>({ checked: false, serviceable: false, message: "" });

  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const matched = INITIAL_PLANS.find((p) => p.slug === planSlugParam);
    if (matched) setSelectedPlan(matched);
    setCartItems(getStoredCart());
  }, [planSlugParam]);

  const handlePincodeChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: cleaned }));

    if (cleaned.length === 6) {
      const res = checkPincodeAvailability(cleaned);
      setPincodeStatus({
        checked: true,
        serviceable: res.serviceable,
        message: res.message,
      });
    } else {
      setPincodeStatus({ checked: false, serviceable: false, message: "" });
    }
  };

  const totalCartGrams = cartItems.reduce(
    (acc, i) => acc + (i.grams || 100),
    0
  );
  const totalCartAmount = cartItems.reduce((acc, i) => acc + i.unitPrice, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.fullName.trim() || formData.phone.length < 10) {
      setFormError(
        "Please enter your full name and a valid 10-digit WhatsApp mobile number."
      );
      return;
    }

    const pinCheck = checkPincodeAvailability(formData.pincode);
    if (!pinCheck.serviceable) {
      setFormError(
        "We currently deliver only to Thane pincodes 400601 to 400608."
      );
      return;
    }

    if (!formData.flatWing.trim() || !formData.societyName.trim()) {
      setFormError(
        "Please enter your Flat/Wing and Building/Society Name for morning drop."
      );
      return;
    }

    // Check Festive & Weight Rules if One-Time Checkout
    if (isOneTimeCartCheckout) {
      const festive = getFestiveModeStatus(formData.startDate);
      const tier = getCurrentCustomerTier();
      const validation = validateDirectFlowerPurchaseLimit(
        0,
        totalCartGrams,
        tier,
        festive.isFestiveDay
      );
      if (!validation.allowed) {
        setFormError(validation.reason || "Order exceeds allowed weight quota.");
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      const deliveryInstruction =
        formData.deliveryNote.trim() ||
        "Hang pouch on main door handle (Do not ring bell)";

      if (isOneTimeCartCheckout) {
        const newOneTimeOrder = {
          orderId: `PLS-OT-${Math.floor(100000 + Math.random() * 900000)}`,
          orderType: "ONE_TIME",
          flowerSummary: cartItems
            .map(
              (c) =>
                `${c.flowerName} (${c.marathiName || ""}) - ${c.grams}g`
            )
            .join(", "),
          totalGrams: totalCartGrams,
          amountPaid: totalCartAmount,
          deliveryDate: formData.startDate,
          deliverySlot: "6:00 AM – 8:00 AM",
          customerName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          address: `${formData.flatWing.trim()}, ${formData.societyName.trim()} - ${
            formData.pincode
          }`,
          deliveryNote: deliveryInstruction,
          status: "CONFIRMED",
          createdAt: new Date().toISOString(),
        };

        try {
          const existingRaw = localStorage.getItem("palassh_onetime_orders");
          const existing = existingRaw ? JSON.parse(existingRaw) : [];
          localStorage.setItem(
            "palassh_onetime_orders",
            JSON.stringify([newOneTimeOrder, ...existing])
          );
          saveStoredCart([]);
        } catch {
          // Ignore error
        }

        router.push("/my-orders?tab=onetime");
        return;
      }

      // Subscription Order Creation
      const newSubOrder = {
        orderId: `PLS-SUB-${Math.floor(100000 + Math.random() * 900000)}`,
        planId: selectedPlan.id,
        planTitle: selectedPlan.title,
        pricePaid: selectedPlan.price,
        billingCycle: selectedPlan.billingCycle,
        totalDeliveries: selectedPlan.deliveriesCount,
        remainingDeliveries: selectedPlan.deliveriesCount,
        status: "ACTIVE" as const,
        startDate: formData.startDate,
        nextDeliveryDate: `${formData.startDate} (6:00 AM – 8:00 AM)`,
        deliverySlot: "6:00 AM – 8:00 AM",
        defaultFlowers:
          customFlowersParam ||
          "Mixed Sacred Box (Marigold, Chrysanthemum & Red Hibiscus)",
        customerName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        address: `${formData.flatWing.trim()}, ${formData.societyName.trim()} - ${
          formData.pincode
        }`,
        deliveryNote: deliveryInstruction,
        createdAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(
          "palassh_active_subscription",
          JSON.stringify(newSubOrder)
        );
      } catch {
        // Ignore error
      }

      router.push("/my-orders?tab=subscription");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={isOneTimeCartCheckout ? "/products" : "/#plans"}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#E8502B] mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            {isOneTimeCartCheckout
              ? "Back to Flower Catalog"
              : "Back to Subscription Plans"}
          </span>
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* LEFT COLUMN: Form */}
          <div className="lg:col-span-7">
            <div className="rounded-[2.2rem] border border-stone-200/90 bg-white p-6 sm:p-10 shadow-xl space-y-6">
              <div className="border-b border-stone-100 pb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#071C15] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                  <Sparkles className="h-3 w-3 text-[#F05A36]" />
                  <span>
                    {isOneTimeCartCheckout
                      ? "One-Time Fresh Flower Checkout"
                      : "Sacred Subscription Checkout"}
                  </span>
                </span>
                <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                  Confirm Your Morning Flower Basket
                </h1>
              </div>

              {/* Single Guaranteed Morning Slot (6:00 AM – 8:00 AM as requested by Client) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Morning Silent Delivery Window (Single Guaranteed Slot)
                </label>
                <div className="flex items-center justify-between rounded-2xl border-2 border-emerald-700 bg-emerald-50/70 p-4 text-emerald-950">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-emerald-700 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">
                        6:00 AM – 8:00 AM (Morning Puja Window)
                      </p>
                      <p className="text-xs text-emerald-800">
                        Silent doorbell-free drop across Thane 400601 – 400608
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-800 px-3 py-1 text-[10px] font-bold uppercase text-amber-200">
                    Locked Slot
                  </span>
                </div>
              </div>

              {/* Switch Plan Pills if Subscription Checkout */}
              {!isOneTimeCartCheckout && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Select Subscription Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {INITIAL_PLANS.map((plan) => {
                      const active = selectedPlan.id === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedPlan(plan)}
                          className={`rounded-2xl border p-3 text-left transition cursor-pointer ${
                            active
                              ? "border-2 border-[#E8502B] bg-orange-50/60"
                              : "border-stone-200 bg-white hover:border-orange-200"
                          }`}
                        >
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {plan.title}
                          </p>
                          <p className="mt-0.5 font-serif text-lg font-bold text-[#E8502B]">
                            ₹{plan.price}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Society & Doorstep Details Form (With Clean Placeholders, NOT Auto-Filled) */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-5 pt-2">
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  Society & Doorstep Details
                </h2>

                {formError && (
                  <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="e.g. Snehal Deshmukh"
                      className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#E8502B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="e.g. 9820123456"
                      className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#E8502B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Thane Pincode (400601–400608) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="e.g. 400607"
                      className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#E8502B] focus:outline-none"
                    />
                    {pincodeStatus.checked && (
                      <p
                        className={`mt-1 text-[11px] font-semibold ${
                          pincodeStatus.serviceable
                            ? "text-emerald-700"
                            : "text-rose-600"
                        }`}
                      >
                        {pincodeStatus.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Building / Society Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.societyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          societyName: e.target.value,
                        })
                      }
                      placeholder="e.g. Hiranandani Estate, Thane West"
                      className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#E8502B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Flat No. & Wing *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.flatWing}
                      onChange={(e) =>
                        setFormData({ ...formData, flatWing: e.target.value })
                      }
                      placeholder="e.g. B-1204"
                      className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#E8502B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Silent Drop Instruction
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryNote}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deliveryNote: e.target.value,
                        })
                      }
                      placeholder="e.g. Hang pouch on main door handle (Do not ring bell)"
                      className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#E8502B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Delivery Date (6:00 AM – 8:00 AM) *
                  </label>
                  <div className="relative max-w-xs">
                    <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E8502B]" />
                    <input
                      type="date"
                      required
                      min={getTomorrowDateString()}
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-3.5 py-3 text-sm font-semibold text-stone-900 focus:border-[#E8502B] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] via-[#F05A36] to-[#D97706] py-4 text-base font-bold text-white shadow-xl shadow-orange-500/25 transition hover:brightness-105 cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  <span>
                    {isProcessing
                      ? "Processing Order..."
                      : `Pay ₹${(isOneTimeCartCheckout
                          ? totalCartAmount
                          : selectedPlan.price
                        ).toLocaleString("en-IN")} & Schedule 6–8 AM Delivery`}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-[2.2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  Order Summary
                </h2>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-900">
                  Slot: 6:00 AM – 8:00 AM
                </span>
              </div>

              {isOneTimeCartCheckout ? (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Selected Flower Weight Packs ({totalCartGrams}g Total)
                  </p>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm border-b border-stone-100 pb-2"
                    >
                      <span>
                        {item.flowerName} ({item.marathiName}) —{" "}
                        <strong>{item.grams}g</strong>
                      </span>
                      <span className="font-bold text-stone-900">
                        ₹{item.unitPrice}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {selectedPlan.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {selectedPlan.subtitle}
                  </p>
                  <div className="rounded-xl bg-[#FAF7F2] p-3.5 border border-orange-100 text-xs text-stone-700">
                    <strong>Flowers:</strong>{" "}
                    {customFlowersParam ||
                      selectedPlan.mixedPredefinedBreakdown}
                  </div>
                </div>
              )}

              <div className="space-y-2 border-t border-stone-100 pt-4 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Morning 6:00 AM – 8:00 AM Delivery</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Payable</span>
                  <span className="font-serif text-2xl text-[#E8502B]">
                    ₹
                    {(isOneTimeCartCheckout
                      ? totalCartAmount
                      : selectedPlan.price
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  100% Farm-Fresh Thane Guarantee
                </p>
                <p className="text-emerald-800/90">
                  Harvested at 1:30 AM and hung silently at your door between 6:00 AM – 8:00 AM.
                </p>
              </div>
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
          <div className="p-12 text-center text-sm text-stone-500">
            Loading Checkout...
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </FeatureBoundary>
  );
}