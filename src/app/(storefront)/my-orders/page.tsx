"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  PauseCircle,
  PlayCircle,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  Check,
  Flower2,
  ArrowRight,
} from "lucide-react";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";
import {
  FlowerProduct,
  INITIAL_FLOWERS,
  getActiveFlowersCatalog,
} from "@/features/catalog/types";

interface DayScheduleItem {
  dayNumber: number;
  dateLabel: string;
  mode: "MIXED" | "CUSTOM";
  selectedFlowers: string[];
  assignedFlower: string;
  status: "SCHEDULED" | "PAUSED";
}

interface ActiveSubscription {
  orderId: string;
  planId: string;
  planTitle: string;
  pricePaid: number;
  billingCycle: string;
  totalDeliveries: number;
  remainingDeliveries: number;
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  startDate: string;
  nextDeliveryDate: string;
  deliverySlot: string;
  defaultFlowers: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryNote: string;
  schedule?: DayScheduleItem[];
}

interface OneTimeOrderRecord {
  orderId: string;
  orderType: "ONE_TIME";
  flowerSummary: string;
  totalGrams: number;
  amountPaid: number;
  deliveryDate: string;
  deliverySlot: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryNote: string;
  status: string;
  createdAt: string;
}

function buildDefaultSchedule(daysCount = 7): DayScheduleItem[] {
  const list: DayScheduleItem[] = [];
  const base = new Date();
  for (let i = 1; i <= Math.min(daysCount, 14); i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const dateLabel = d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    list.push({
      dayNumber: i,
      dateLabel,
      mode: "MIXED",
      selectedFlowers: ["Marigold"],
      assignedFlower:
        "Mixed Sacred Box (Marigold, Chrysanthemum & Red Hibiscus)",
      status: "SCHEDULED",
    });
  }
  return list;
}

const DEFAULT_DEMO_SUBSCRIPTION: ActiveSubscription = {
  orderId: "PLS-SUB-849201",
  planId: "plan-monthly",
  planTitle: "Monthly Sacred Assortment",
  pricePaid: 1350,
  billingCycle: "month",
  totalDeliveries: 30,
  remainingDeliveries: 26,
  status: "ACTIVE",
  startDate: "2026-10-30",
  nextDeliveryDate: "Tomorrow (6:00 AM – 8:00 AM)",
  deliverySlot: "6:00 AM – 8:00 AM",
  defaultFlowers: "Mixed Sacred Box (Marigold, Chrysanthemum & Red Hibiscus)",
  customerName: "Snehal Deshmukh",
  phone: "9820XXXXXX",
  address: "B-1204, Hiranandani Estate, Thane West - 400607",
  deliveryNote: "Hang pouch on main door handle (Do not ring bell)",
  schedule: buildDefaultSchedule(7),
};

const DEFAULT_DEMO_ONETIME: OneTimeOrderRecord[] = [
  {
    orderId: "PLS-OT-512098",
    orderType: "ONE_TIME",
    flowerSummary: "Marigold (झेंडू) - 250g, Red Hibiscus (लाल जास्वंद) - 250g",
    totalGrams: 500,
    amountPaid: 195,
    deliveryDate: "Tomorrow Morning",
    deliverySlot: "6:00 AM – 8:00 AM",
    customerName: "Snehal Deshmukh",
    phone: "9820XXXXXX",
    address: "B-1204, Hiranandani Estate, Thane West - 400607",
    deliveryNote: "Hang pouch on main door handle (Do not ring bell)",
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  },
];

function MyOrdersContent() {
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get("tab");

  // Point #8: 2 Separate Sub-Tabs ("SUBSCRIPTION" vs "ONETIME")
  const [activeSubTab, setActiveSubTab] = useState<"SUBSCRIPTION" | "ONETIME">(
    initialTabParam === "onetime" ? "ONETIME" : "SUBSCRIPTION"
  );

  const [sub, setSub] = useState<ActiveSubscription>(DEFAULT_DEMO_SUBSCRIPTION);
  const [oneTimeOrders, setOneTimeOrders] = useState<OneTimeOrderRecord[]>(
    DEFAULT_DEMO_ONETIME
  );
  const [availableFlowers, setAvailableFlowers] =
    useState<FlowerProduct[]>(INITIAL_FLOWERS);
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    setAvailableFlowers(getActiveFlowersCatalog().filter((f) => f.inStock));

    try {
      const savedSub = localStorage.getItem("palassh_active_subscription");
      if (savedSub) {
        const parsed = JSON.parse(savedSub);
        if (!parsed.schedule || !Array.isArray(parsed.schedule)) {
          parsed.schedule = buildDefaultSchedule(
            parsed.totalDeliveries || 7
          );
        }
        setSub({
          ...DEFAULT_DEMO_SUBSCRIPTION,
          ...parsed,
          deliverySlot: "6:00 AM – 8:00 AM",
        });
      }
    } catch {
      // Ignore error
    }

    try {
      const savedOt = localStorage.getItem("palassh_onetime_orders");
      if (savedOt) {
        const parsedOt = JSON.parse(savedOt);
        if (Array.isArray(parsedOt) && parsedOt.length > 0) {
          setOneTimeOrders(parsedOt);
        }
      }
    } catch {
      // Ignore error
    }
  }, []);

  const saveSubscription = (updated: ActiveSubscription, msg: string) => {
    setSub(updated);
    setToast(msg);
    try {
      localStorage.setItem(
        "palassh_active_subscription",
        JSON.stringify(updated)
      );
    } catch {
      // Ignore error
    }
    setTimeout(() => setToast(""), 4500);
  };

  const handleToggleMainPause = () => {
    if (sub.status === "ACTIVE") {
      saveSubscription(
        {
          ...sub,
          status: "PAUSED",
          nextDeliveryDate: `Paused (${sub.remainingDeliveries} mornings safe)`,
        },
        "Subscription Paused! Tomorrow morning's 6:00 AM – 8:00 AM delivery is skipped and carried forward."
      );
    } else {
      saveSubscription(
        {
          ...sub,
          status: "ACTIVE",
          nextDeliveryDate: "Tomorrow (6:00 AM – 8:00 AM)",
        },
        "Subscription Resumed! Fresh puja flowers will arrive between 6:00 AM – 8:00 AM."
      );
    }
  };

  const handleToggleDayMode = (dayNumber: number) => {
    const schedule = (sub.schedule || buildDefaultSchedule(7)).map((d) => {
      if (d.dayNumber !== dayNumber) return d;
      const nextMode = d.mode === "MIXED" ? "CUSTOM" : "MIXED";
      const flowers =
        d.selectedFlowers.length > 0 ? d.selectedFlowers : ["Marigold"];
      return {
        ...d,
        mode: nextMode,
        assignedFlower:
          nextMode === "MIXED"
            ? "Mixed Sacred Box (Marigold, Chrysanthemum & Red Hibiscus)"
            : `Custom: ${flowers.join(", ")}`,
      };
    });
    saveSubscription(
      { ...sub, schedule },
      `Updated Day #${dayNumber} flower mode!`
    );
  };

  const handleToggleDayFlowerCheckbox = (
    dayNumber: number,
    flowerName: string
  ) => {
    const schedule = (sub.schedule || buildDefaultSchedule(7)).map((d) => {
      if (d.dayNumber !== dayNumber) return d;
      const currentList = d.mode === "MIXED" ? [] : d.selectedFlowers;
      const exists = currentList.includes(flowerName);
      const updatedFlowers = exists
        ? currentList.length > 1
          ? currentList.filter((f) => f !== flowerName)
          : currentList
        : [...currentList, flowerName];

      return {
        ...d,
        mode: "CUSTOM" as const,
        selectedFlowers: updatedFlowers,
        assignedFlower: `Custom: ${updatedFlowers.join(", ")}`,
      };
    });
    saveSubscription(
      { ...sub, schedule },
      `Updated Day #${dayNumber} flower selection to ${flowerName}!`
    );
  };

  const handleToggleSingleDayPause = (dayNumber: number) => {
    const schedule = (sub.schedule || buildDefaultSchedule(7)).map((d) => {
      if (d.dayNumber !== dayNumber) return d;
      const nextStatus = d.status === "SCHEDULED" ? "PAUSED" : "SCHEDULED";
      return { ...d, status: nextStatus };
    });
    saveSubscription(
      { ...sub, schedule },
      `Updated Day #${dayNumber} delivery status!`
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-orange-200/70 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#071C15] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
              <Sparkles className="h-3 w-3 text-[#F05A36]" />
              <span>Customer Self-Service Portal</span>
            </span>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              My Orders & Morning Schedule
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Switch between your Active Subscription Plan and Separate One-Time Flower Purchases below.
            </p>
          </div>

          {/* 2 SEPARATE SUB-TABS (Point #8) */}
          <div className="inline-flex rounded-2xl border border-stone-200 bg-white p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveSubTab("SUBSCRIPTION")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeSubTab === "SUBSCRIPTION"
                  ? "bg-[#071C15] text-amber-300 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Calendar className="h-3.5 w-3.5 text-[#F05A36]" />
              <span>1. Subscription Plan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("ONETIME")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeSubTab === "ONETIME"
                  ? "bg-[#071C15] text-amber-300 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#F05A36]" />
              <span>2. Separate Flower Purchases ({oneTimeOrders.length})</span>
            </button>
          </div>
        </div>

        {toast && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs sm:text-sm font-bold text-emerald-950 shadow-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>{toast}</span>
          </div>
        )}

        {/* SUB-TAB 1: ACTIVE SUBSCRIPTION PLAN & DAY-WISE PLANNER */}
        {activeSubTab === "SUBSCRIPTION" && (
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[2.2rem] border border-stone-200 bg-white shadow-xl">
              {/* Top Status Strip */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-[#071C15] px-6 py-4 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-200">
                    Subscription #{sub.orderId}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                      sub.status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        sub.status === "ACTIVE"
                          ? "bg-emerald-400"
                          : "bg-amber-400"
                      }`}
                    />
                    {sub.status}
                  </span>
                </div>
                <div className="text-xs text-amber-200">
                  Next-Day Pause / Flower Change Cut-Off:{" "}
                  <strong>8:00 PM Tonight</strong>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                      {sub.planTitle}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-stone-500">
                      Prepaid Plan:{" "}
                      <strong className="text-stone-900">₹{sub.pricePaid}</strong>{" "}
                      • Morning Slot:{" "}
                      <strong className="text-emerald-800">
                        6:00 AM – 8:00 AM
                      </strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-orange-200 bg-[#FAF7F2] px-5 py-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8502B] to-[#D97706] text-white font-serif text-xl font-bold">
                      {sub.remainingDeliveries}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#E8502B]">
                        Mornings Remaining
                      </p>
                      <p className="text-xs text-stone-500">
                        Out of {sub.totalDeliveries} deliveries
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-5 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 shrink-0 text-[#E8502B] mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold uppercase text-stone-400">
                        Next Morning Delivery
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-stone-900">
                        {sub.nextDeliveryDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 shrink-0 text-[#E8502B] mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold uppercase text-stone-400">
                        Doorstep Address (Thane)
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-stone-900">
                        {sub.customerName} — {sub.address}
                      </p>
                      <p className="text-xs text-stone-500">
                        {sub.deliveryNote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Pause / Resume Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-100 pt-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleMainPause}
                      className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
                        sub.status === "ACTIVE"
                          ? "bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
                          : "bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm"
                      }`}
                    >
                      {sub.status === "ACTIVE" ? (
                        <>
                          <PauseCircle className="h-4 w-4" />
                          <span>Pause Tomorrow&apos;s Delivery</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4" />
                          <span>Resume Morning Deliveries</span>
                        </>
                      )}
                    </button>
                  </div>
                  <Link
                    href="/#plans"
                    className="text-xs font-bold text-[#E8502B] hover:underline"
                  >
                    Upgrade / Change Plan →
                  </Link>
                </div>
              </div>
            </div>

            {/* Day-Wise Flower Checkbox Schedule */}
            <div className="rounded-[2.2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8502B] flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Interactive Day-Wise Planner</span>
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    Customize Flowers or Pause Specific Days
                  </h3>
                </div>
                <span className="text-xs text-stone-500">
                  Changes sync directly with PALASSH 6–8 AM Dispatch
                </span>
              </div>

              <div className="space-y-4">
                {(sub.schedule || buildDefaultSchedule(7)).map((day) => (
                  <div
                    key={day.dayNumber}
                    className={`rounded-2xl border p-4 sm:p-5 transition ${
                      day.status === "PAUSED"
                        ? "border-stone-200 bg-stone-50 opacity-70"
                        : "border-orange-200/70 bg-[#FAF7F2]"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="rounded-lg bg-[#071C15] px-2.5 py-1 text-xs font-bold text-amber-300">
                            Day {day.dayNumber} • {day.dateLabel}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              day.status === "SCHEDULED"
                                ? "bg-emerald-100 text-emerald-900"
                                : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            {day.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-stone-800 pt-1">
                          Assigned Pouch: {day.assignedFlower}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Mixed Box Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleDayMode(day.dayNumber)}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
                            day.mode === "MIXED"
                              ? "border-[#E8502B] bg-[#E8502B] text-white"
                              : "border-stone-300 bg-white text-stone-700"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Mixed Box</span>
                        </button>

                        {/* Individual Flower Checkboxes (English + Marathi) */}
                        {availableFlowers.map((flw) => {
                          const checked =
                            day.mode === "CUSTOM" &&
                            day.selectedFlowers.includes(flw.name);
                          return (
                            <button
                              key={flw.id}
                              type="button"
                              onClick={() =>
                                handleToggleDayFlowerCheckbox(
                                  day.dayNumber,
                                  flw.name
                                )
                              }
                              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
                                checked
                                  ? "border-emerald-800 bg-emerald-900 text-amber-200"
                                  : "border-stone-300 bg-white text-stone-700 hover:border-emerald-600"
                              }`}
                            >
                              {checked && <Check className="h-3 w-3" />}
                              <span>
                                {flw.name} ({flw.marathiName})
                              </span>
                            </button>
                          );
                        })}

                        {/* Single Day Pause Button */}
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleSingleDayPause(day.dayNumber)
                          }
                          className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
                        >
                          {day.status === "SCHEDULED"
                            ? "Pause Day"
                            : "Resume Day"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: SEPARATE FLOWER PURCHASES (ONE-TIME A-LA-CARTE ORDERS) */}
        {activeSubTab === "ONETIME" && (
          <div className="rounded-[2.2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8502B]">
                  A-La-Carte Order History
                </span>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Separate Flower Purchases ({oneTimeOrders.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Individual gram packs ordered from our Fresh Flower Catalog for 6:00 AM – 8:00 AM delivery.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#071C15] px-5 py-3 text-xs font-bold text-amber-200 shadow-sm hover:bg-emerald-950"
              >
                <ShoppingBag className="h-4 w-4 text-[#F05A36]" />
                <span>Order More Flowers</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {oneTimeOrders.map((ord) => (
                <div
                  key={ord.orderId}
                  className="rounded-2xl border border-orange-200/80 bg-[#FAF7F2] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="rounded-lg bg-[#071C15] px-3 py-1 text-xs font-bold text-amber-300">
                        #{ord.orderId}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-bold text-emerald-900">
                        {ord.status} • {ord.totalGrams}g Total
                      </span>
                      <span className="text-xs font-semibold text-stone-500">
                        Slot: 6:00 AM – 8:00 AM ({ord.deliveryDate})
                      </span>
                    </div>
                    <p className="font-serif text-lg font-bold text-stone-900 pt-1">
                      {ord.flowerSummary}
                    </p>
                    <p className="text-xs text-stone-600 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#E8502B] shrink-0" />
                      <span>
                        {ord.customerName} — {ord.address} ({ord.deliveryNote})
                      </span>
                    </p>
                  </div>

                  <div className="text-left md:text-right shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-stone-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Amount Paid
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#E8502B]">
                      ₹{ord.amountPaid}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <FeatureBoundary featureName="ORDERS">
      <Suspense
        fallback={
          <div className="p-12 text-center text-sm text-stone-500">
            Loading Orders...
          </div>
        }
      >
        <MyOrdersContent />
      </Suspense>
    </FeatureBoundary>
  );
}