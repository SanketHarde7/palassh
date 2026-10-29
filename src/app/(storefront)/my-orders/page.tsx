"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PauseCircle,
  PlayCircle,
  XCircle,
  Calendar,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  ShoppingBag,
  Clock,
  Sparkles,
  RotateCcw,
  Check,
} from "lucide-react";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";
import { logger } from "@/lib/logger";
import { getActiveFlowersCatalog } from "@/features/catalog/types";

export interface DayScheduleItem {
  id: string;
  dateISO: string;
  dateLabel: string;
  dayName: string;
  isMixed: boolean;
  selectedFlowers: string[];
  assignedFlower?: string;
  status: "SCHEDULED" | "PAUSED";
}

export interface ActiveSubscription {
  orderId: string;
  planTitle: string;
  pricePaid: number;
  billingCycle: string;
  totalDeliveries: number;
  remainingDeliveries: number;
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  startDate: string;
  nextDeliveryDate: string;
  deliverySlot: string;
  flowerMode: "MIXED" | "CUSTOM";
  defaultFlowers: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryNote: string;
  pausedDates: string[];
  schedule: DayScheduleItem[];
}

export interface OneTimeFlowerOrder {
  orderId: string;
  flowerSummary: string;
  amountPaid: number;
  deliveryDate: string;
  deliverySlot: string;
  address: string;
  status: "CONFIRMED" | "DELIVERED";
}

const DEFAULT_SHORT_FLOWERS = ["Marigold", "Chrysanthemum", "Red Hibiscus"];

function formatDaySummary(isMixed: boolean, selectedFlowers: string[]): string {
  if (isMixed) {
    return "Mixed Sacred Box (Predefined Quantity)";
  }
  if (!selectedFlowers || selectedFlowers.length === 0) {
    return "Only Marigold";
  }
  if (selectedFlowers.length === 1) {
    return `Only ${selectedFlowers[0]}`;
  }
  return `${selectedFlowers.join(" + ")} Mix`;
}

function generateInitialSchedule(
  daysCount: number,
  isMixedDefault: boolean,
  defaultFlowerList: string[]
): DayScheduleItem[] {
  const result: DayScheduleItem[] = [];
  const baseDate = new Date();

  for (let i = 1; i <= daysCount; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);

    const dayName = d.toLocaleDateString("en-IN", { weekday: "long" });
    const dateLabel = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const dateISO = d.toISOString().split("T")[0];

    result.push({
      id: `day-${i}`,
      dateISO,
      dateLabel,
      dayName,
      isMixed: isMixedDefault,
      selectedFlowers:
        defaultFlowerList.length > 0 ? defaultFlowerList : ["Marigold"],
      assignedFlower: formatDaySummary(isMixedDefault, defaultFlowerList),
      status: "SCHEDULED",
    });
  }
  return result;
}

const DEFAULT_DEMO_SUBSCRIPTION: ActiveSubscription = {
  orderId: "PLS-849201",
  planTitle: "Weekly Devotion Pack",
  pricePaid: 510,
  billingCycle: "week",
  totalDeliveries: 7,
  remainingDeliveries: 7,
  status: "ACTIVE",
  startDate: "2026-10-30",
  nextDeliveryDate: "Tomorrow (5:00 AM – 6:30 AM)",
  deliverySlot: "5:00 AM – 6:30 AM",
  flowerMode: "MIXED",
  defaultFlowers: "Mixed Sacred Box (Predefined Quantity)",
  customerName: "Snehal Deshmukh",
  phone: "9820XXXXXX",
  address: "B-1204, Hiranandani Estate, Ghodbunder Road, Thane West - 400607",
  deliveryNote: "Hang pouch on main door handle (Do not ring bell)",
  pausedDates: [],
  schedule: generateInitialSchedule(7, true, DEFAULT_SHORT_FLOWERS),
};

export default function MyOrdersPage() {
  const [sub, setSub] = useState<ActiveSubscription>(DEFAULT_DEMO_SUBSCRIPTION);
  const [oneTimeOrders, setOneTimeOrders] = useState<OneTimeFlowerOrder[]>([]);
  const [availableFlowerNames, setAvailableFlowerNames] = useState<string[]>(
    DEFAULT_SHORT_FLOWERS
  );
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    const catalog = getActiveFlowersCatalog().filter((f) => f.inStock);
    if (catalog.length > 0) {
      setAvailableFlowerNames(catalog.map((f) => f.name.split(" (")[0]));
    }

    try {
      const savedSub = localStorage.getItem("palassh_active_subscription");
      if (savedSub) {
        let subStr = savedSub;
        subStr = subStr
          .replaceAll("Zendu", "Marigold")
          .replaceAll("zendu", "marigold")
          .replaceAll("Shevanti", "Chrysanthemum")
          .replaceAll("shevanti", "chrysanthemum");
        const parsed: ActiveSubscription = JSON.parse(subStr);
        const daysToGenerate = Math.min(parsed.totalDeliveries || 7, 14);

        if (!parsed.schedule || parsed.schedule.length === 0) {
          parsed.schedule = generateInitialSchedule(
            daysToGenerate,
            parsed.flowerMode !== "CUSTOM",
            DEFAULT_SHORT_FLOWERS
          );
        } else {
          // Normalize legacy schedule items so every day has selectedFlowers array for checkboxes
          parsed.schedule = parsed.schedule.map((item) => {
            if (
              Array.isArray(item.selectedFlowers) &&
              item.selectedFlowers.length > 0
            ) {
              return item;
            }
            const legacyStr = item.assignedFlower || "";
            const isMix =
              item.isMixed || legacyStr.toLowerCase().includes("mixed");
            const matched = DEFAULT_SHORT_FLOWERS.filter((flw) =>
              legacyStr.toLowerCase().includes(flw.toLowerCase())
            );
            return {
              ...item,
              isMixed: isMix,
              selectedFlowers:
                matched.length > 0
                  ? matched
                  : isMix
                  ? DEFAULT_SHORT_FLOWERS
                  : ["Marigold"],
            };
          });
        }
        setSub(parsed);
      }
    } catch {
      // Fallback to default demo subscription
    }

    try {
      const savedOneTime = localStorage.getItem("palassh_onetime_orders");
      if (savedOneTime) {
        let oneTimeStr = savedOneTime;
        oneTimeStr = oneTimeStr
          .replaceAll("Zendu", "Marigold")
          .replaceAll("zendu", "marigold")
          .replaceAll("Shevanti", "Chrysanthemum")
          .replaceAll("shevanti", "chrysanthemum");
        setOneTimeOrders(JSON.parse(oneTimeStr));
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  const updateSubscription = (updated: ActiveSubscription, message: string) => {
    setSub(updated);
    setToast(message);
    try {
      localStorage.setItem(
        "palassh_active_subscription",
        JSON.stringify(updated)
      );
    } catch {
      // Ignore storage error
    }
    setTimeout(() => setToast(""), 4500);
  };

  // Toggle Mixed Pack Checkbox for a specific day
  const handleToggleDayMixed = (dayId: string) => {
    const targetDay = sub.schedule.find((d) => d.id === dayId);
    if (!targetDay) return;

    const nextIsMixed = !targetDay.isMixed;
    const nextFlowers = nextIsMixed
      ? [...availableFlowerNames]
      : [availableFlowerNames[0] || "Marigold"];

    const updatedSchedule = sub.schedule.map((d) =>
      d.id === dayId
        ? {
            ...d,
            isMixed: nextIsMixed,
            selectedFlowers: nextFlowers,
            assignedFlower: formatDaySummary(nextIsMixed, nextFlowers),
          }
        : d
    );

    updateSubscription(
      { ...sub, schedule: updatedSchedule },
      `🌸 Updated ${targetDay.dayName} (${targetDay.dateLabel}): ${formatDaySummary(
        nextIsMixed,
        nextFlowers
      )}`
    );
  };

  // Toggle Individual Flower Checkbox (e.g. Marigold, Chrysanthemum, Red Hibiscus) for a specific day
  const handleToggleDayFlowerCheckbox = (dayId: string, flowerShortName: string) => {
    const targetDay = sub.schedule.find((d) => d.id === dayId);
    if (!targetDay) return;

    let currentList = targetDay.isMixed ? [] : [...(targetDay.selectedFlowers || [])];

    if (currentList.includes(flowerShortName)) {
      // Keep at least 1 flower checked
      if (currentList.length > 1) {
        currentList = currentList.filter((f) => f !== flowerShortName);
      }
    } else {
      currentList.push(flowerShortName);
    }

    const updatedSchedule = sub.schedule.map((d) =>
      d.id === dayId
        ? {
            ...d,
            isMixed: false,
            selectedFlowers: currentList,
            assignedFlower: formatDaySummary(false, currentList),
          }
        : d
    );

    logger.info({
      module: "ORDERS",
      action: "DAY_FLOWER_CHECKBOX_UPDATED",
      message: `Date ${targetDay.dateLabel} flowers checked: ${currentList.join(", ")}`,
    });

    updateSubscription(
      { ...sub, schedule: updatedSchedule },
      `✅ ${targetDay.dayName} (${targetDay.dateLabel}) set to: ${formatDaySummary(
        false,
        currentList
      )}`
    );
  };

  // Day-Wise Individual Date Pause / Resume
  const handleToggleDayPause = (dayId: string) => {
    const targetDay = sub.schedule.find((d) => d.id === dayId);
    if (!targetDay) return;

    const newStatus: "SCHEDULED" | "PAUSED" =
      targetDay.status === "SCHEDULED" ? "PAUSED" : "SCHEDULED";

    const updatedSchedule = sub.schedule.map((d) =>
      d.id === dayId ? { ...d, status: newStatus } : d
    );

    const pausedDates = updatedSchedule
      .filter((d) => d.status === "PAUSED")
      .map((d) => d.dateLabel);

    updateSubscription(
      {
        ...sub,
        pausedDates,
        schedule: updatedSchedule,
      },
      newStatus === "PAUSED"
        ? `⏸️ Delivery on ${targetDay.dayName}, ${targetDay.dateLabel} is PAUSED. 1 extra day carried forward!`
        : `▶️ Delivery on ${targetDay.dayName}, ${targetDay.dateLabel} is RESUMED.`
    );
  };

  // Toggle entire subscription Pause / Resume
  const handleToggleGlobalPause = () => {
    if (sub.status === "ACTIVE") {
      updateSubscription(
        {
          ...sub,
          status: "PAUSED",
          nextDeliveryDate: `Paused (${sub.remainingDeliveries} deliveries safe)`,
        },
        "⏸️ Entire Subscription Paused! All remaining deliveries are safe and carried forward."
      );
    } else if (sub.status === "PAUSED") {
      updateSubscription(
        {
          ...sub,
          status: "ACTIVE",
          nextDeliveryDate: `Tomorrow (${sub.deliverySlot})`,
        },
        "▶️ Subscription Resumed! Your day-wise schedule is active again."
      );
    }
  };

  const handleCancelSubscription = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your active subscription? You can also pause specific dates in the table below."
    );
    if (!confirmed) return;

    updateSubscription(
      {
        ...sub,
        status: "CANCELLED",
        nextDeliveryDate: "Cancelled",
      },
      "Subscription Cancelled. Refund for remaining unused deliveries has been initiated."
    );
  };

  return (
    <FeatureBoundary featureName="ORDERS">
      <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-300">
                <Sparkles className="h-3 w-3 text-[#F05A36]" />
                <span>Customer Self-Service Portal</span>
              </span>
              <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                My Sacred Subscriptions & Day-Wise Schedule
              </h1>
              <p className="mt-1 text-sm text-stone-600">
                Tick checkboxes to choose which flowers you want on each day or
                pause specific dates anytime before{" "}
                <strong className="text-[#E8502B]">8:00 PM</strong>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/#fresh-flowers"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs font-bold text-stone-800 hover:bg-stone-50"
              >
                <ShoppingBag className="h-3.5 w-3.5 text-[#E8502B]" />
                <span>Buy Extra Flowers</span>
              </Link>
              <Link
                href="/#plans"
                className="inline-flex items-center justify-center rounded-full bg-[#071C15] px-5 py-2.5 text-xs font-bold text-amber-200 hover:bg-[#0D3528]"
              >
                + Change / Book Plan
              </Link>
            </div>
          </div>

          {toast && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-950 shadow-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{toast}</span>
            </div>
          )}

          {/* MAIN SUBSCRIPTION CARD */}
          <div className="overflow-hidden rounded-[2rem] border border-stone-200/90 bg-white shadow-xl shadow-stone-900/5">
            {/* Top Status Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-[#071C15] px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Order #{sub.orderId}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    sub.status === "ACTIVE"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                      : sub.status === "PAUSED"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-400/30"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      sub.status === "ACTIVE"
                        ? "bg-emerald-400"
                        : sub.status === "PAUSED"
                        ? "bg-amber-400"
                        : "bg-rose-400"
                    }`}
                  />
                  {sub.status}
                </span>
              </div>
              <div className="text-xs font-medium text-emerald-100">
                Cut-off for Tomorrow&apos;s Flower Change / Pause:{" "}
                <strong className="text-amber-300">8:00 PM Tonight</strong>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                      {sub.planTitle}
                    </h2>
                    <span className="rounded-lg bg-orange-100 px-2.5 py-1 text-xs font-bold text-[#E8502B]">
                      {sub.flowerMode === "MIXED"
                        ? "Mixed Pack Mode"
                        : "Custom Flower Mode"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-stone-600">
                    Prepaid:{" "}
                    <strong className="text-stone-900">₹{sub.pricePaid}</strong>{" "}
                    • Morning Slot:{" "}
                    <strong className="text-emerald-900">
                      {sub.deliverySlot}
                    </strong>{" "}
                    • Default Choice:{" "}
                    <strong className="text-[#E8502B]">
                      {sub.defaultFlowers || "Mixed Sacred Box"}
                    </strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-orange-200 bg-[#FAF7F2] px-5 py-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8502B] to-[#D97706] text-white font-serif text-xl font-bold shadow-sm">
                    {sub.remainingDeliveries}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#E8502B]">
                      Mornings Remaining
                    </p>
                    <p className="text-xs text-stone-500">
                      {sub.pausedDates.length > 0
                        ? `${sub.pausedDates.length} paused day(s) carried forward`
                        : `Out of ${sub.totalDeliveries} prepaid deliveries`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Details Grid */}
              <div className="grid grid-cols-1 gap-4 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 shrink-0 text-[#E8502B] mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-400">
                      Next Morning Delivery
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-stone-900">
                      {sub.nextDeliveryDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-emerald-700 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-400">
                      Silent Drop Doorstep Address
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-stone-800">
                      {sub.customerName} — {sub.address}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      {sub.deliveryNote}
                    </p>
                  </div>
                </div>
              </div>

              {/* DAY-WISE CHECKBOX FLOWER PLANNER & PAUSE TABLE */}
              <div className="space-y-4 pt-2">
                <div className="border-b border-stone-200 pb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#E8502B]" />
                    <span>Day-Wise Flower Checkboxes & Pause Control</span>
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                    Tick Flowers for Each Day (Mixed or Separate)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Tick <strong>Mixed Box</strong> for our predefined assortment, OR tick one or more individual flower checkboxes (<strong>Marigold, Chrysanthemum, Red Hibiscus</strong>) for that day.
                  </p>
                </div>

                {/* Day-by-Day Checkbox List */}
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                  <div className="hidden lg:grid lg:grid-cols-12 gap-4 border-b border-stone-200 bg-stone-50 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <div className="col-span-2">Day & Date</div>
                    <div className="col-span-6">
                      Tick Flowers (Mixed OR Separate Checkboxes)
                    </div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Pause / Resume</div>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {sub.schedule.map((dayItem, idx) => {
                      const isDayPaused =
                        dayItem.status === "PAUSED" || sub.status === "PAUSED";
                      const activeFlowers = dayItem.selectedFlowers || ["Marigold"];

                      return (
                        <div
                          key={dayItem.id}
                          className={`grid grid-cols-1 lg:grid-cols-12 items-center gap-4 px-5 py-4 transition ${
                            isDayPaused
                              ? "bg-stone-50/80 opacity-70"
                              : "bg-white hover:bg-orange-50/20"
                          }`}
                        >
                          {/* 1. Day & Date */}
                          <div className="lg:col-span-2 flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                                isDayPaused
                                  ? "bg-stone-200 text-stone-600"
                                  : "bg-emerald-950 text-amber-300"
                              }`}
                            >
                              D{idx + 1}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-stone-900">
                                {dayItem.dayName}
                              </p>
                              <p className="text-xs text-stone-500">
                                {dayItem.dateLabel}
                              </p>
                            </div>
                          </div>

                          {/* 2. Interactive Checkboxes (NO DROPDOWN) */}
                          <div className="lg:col-span-6 space-y-2">
                            <div className="flex flex-wrap items-center gap-2.5">
                              {/* Checkbox A: Predefined Mixed Pack */}
                              <label
                                onClick={() =>
                                  !isDayPaused && handleToggleDayMixed(dayItem.id)
                                }
                                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition select-none ${
                                  isDayPaused
                                    ? "cursor-not-allowed opacity-60 border-stone-200 bg-stone-100"
                                    : dayItem.isMixed
                                    ? "cursor-pointer border-[#E8502B] bg-orange-50 text-[#E8502B] shadow-2xs"
                                    : "cursor-pointer border-stone-200 bg-white text-stone-700 hover:border-orange-300"
                                }`}
                              >
                                <span
                                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                                    dayItem.isMixed
                                      ? "border-[#E8502B] bg-[#E8502B] text-white"
                                      : "border-stone-300 bg-white"
                                  }`}
                                >
                                  {dayItem.isMixed && (
                                    <Check className="h-3 w-3 stroke-[3]" />
                                  )}
                                </span>
                                <span>Mixed Pack (Predefined)</span>
                              </label>

                              <span className="text-[10px] font-bold uppercase text-stone-400">
                                OR Separate:
                              </span>

                              {/* Checkboxes B: Individual Flowers (Marigold, Chrysanthemum, Red Hibiscus) */}
                              {availableFlowerNames.map((flwName) => {
                                const isChecked =
                                  !dayItem.isMixed &&
                                  activeFlowers.includes(flwName);
                                return (
                                  <label
                                    key={flwName}
                                    onClick={() =>
                                      !isDayPaused &&
                                      handleToggleDayFlowerCheckbox(
                                        dayItem.id,
                                        flwName
                                      )
                                    }
                                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition select-none ${
                                      isDayPaused
                                        ? "cursor-not-allowed opacity-60 border-stone-200 bg-stone-100"
                                        : isChecked
                                        ? "cursor-pointer border-emerald-700 bg-emerald-50 text-emerald-950 shadow-2xs"
                                        : "cursor-pointer border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                                    }`}
                                  >
                                    <span
                                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                                        isChecked
                                          ? "border-emerald-700 bg-emerald-700 text-white"
                                          : "border-stone-300 bg-white"
                                      }`}
                                    >
                                      {isChecked && (
                                        <Check className="h-3 w-3 stroke-[3]" />
                                      )}
                                    </span>
                                    <span>{flwName}</span>
                                  </label>
                                );
                              })}
                            </div>

                            <p className="text-[11px] font-medium text-stone-500">
                              Selected for {dayItem.dayName}:{" "}
                              <strong className="text-stone-800">
                                {formatDaySummary(dayItem.isMixed, activeFlowers)}
                              </strong>
                            </p>
                          </div>

                          {/* 3. Status Badge */}
                          <div className="lg:col-span-2">
                            {isDayPaused ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-900">
                                <PauseCircle className="h-3 w-3" />
                                Paused
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-900">
                                <Clock className="h-3 w-3" />
                                5–8 AM Drop
                              </span>
                            )}
                          </div>

                          {/* 4. Day-Wise Pause / Resume Toggle Button */}
                          <div className="lg:col-span-2 flex lg:justify-end">
                            <button
                              type="button"
                              onClick={() => handleToggleDayPause(dayItem.id)}
                              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                                dayItem.status === "PAUSED"
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                  : "border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                              }`}
                            >
                              {dayItem.status === "PAUSED" ? (
                                <>
                                  <PlayCircle className="h-3.5 w-3.5" />
                                  <span>Resume Day</span>
                                </>
                              ) : (
                                <>
                                  <PauseCircle className="h-3.5 w-3.5" />
                                  <span>Pause Day</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Global Pause / Cancel Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-6">
                <div className="flex flex-wrap items-center gap-3">
                  {sub.status !== "CANCELLED" && (
                    <button
                      type="button"
                      onClick={handleToggleGlobalPause}
                      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition cursor-pointer ${
                        sub.status === "ACTIVE"
                          ? "bg-amber-500 text-white hover:bg-amber-600 shadow-xs"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                      }`}
                    >
                      {sub.status === "ACTIVE" ? (
                        <>
                          <PauseCircle className="h-4 w-4" />
                          <span>Pause Entire Plan (Out of Station)</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4" />
                          <span>Resume Entire Plan</span>
                        </>
                      )}
                    </button>
                  )}

                  {sub.status !== "CANCELLED" && (
                    <button
                      type="button"
                      onClick={handleCancelSubscription}
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Cancel Plan</span>
                    </button>
                  )}

                  {sub.status === "CANCELLED" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateSubscription(
                          {
                            ...sub,
                            status: "ACTIVE",
                            nextDeliveryDate: `Tomorrow (${sub.deliverySlot})`,
                          },
                          "Subscription Reactivated!"
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] to-[#D97706] px-6 py-3.5 text-sm font-bold text-white cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Reactivate Subscription</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-stone-500">
                  All day-wise checkbox updates & pauses sync directly with the
                  4:00 AM PALASSH Dispatch Sheet.
                </p>
              </div>
            </div>
          </div>

          {/* ONE-TIME DIRECT FLOWER ORDERS SECTION */}
          <div className="rounded-[2rem] border border-stone-200/90 bg-white p-6 sm:p-8 shadow-md shadow-stone-900/5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8502B]">
                  A-La-Carte Orders
                </span>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  My One-Time Fresh Flower Orders
                </h2>
              </div>
              <Link
                href="/#fresh-flowers"
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                + Order More Flowers
              </Link>
            </div>

            {oneTimeOrders.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm text-stone-500">
                  You haven&apos;t placed any standalone one-time flower orders
                  yet.
                </p>
                <Link
                  href="/#fresh-flowers"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-200 px-5 py-2.5 text-xs font-bold text-[#E8502B] hover:bg-orange-100"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Shop Marigold, Chrysanthemum & Hibiscus (From ₹35)</span>
                </Link>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-stone-100">
                {oneTimeOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-400">
                          #{ord.orderId}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900">
                          {ord.status}
                        </span>
                      </div>
                      <p className="font-serif text-lg font-bold text-stone-900">
                        {ord.flowerSummary}
                      </p>
                      <p className="text-xs text-stone-500">
                        Delivery: {ord.deliveryDate} ({ord.deliverySlot}) •{" "}
                        {ord.address}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="font-serif text-xl font-bold text-stone-900">
                        ₹{ord.amountPaid}
                      </span>
                      <p className="text-[11px] text-emerald-700 font-semibold">
                        Prepaid • Silent Drop
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </FeatureBoundary>
  );
}