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
  ChevronLeft,
  ChevronRight,
  Lock,
  Mail,
  FileText,
  AlertTriangle,
  ArrowRight,
  KeyRound,
  X,
} from "lucide-react";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";

interface CalendarDeliveryDay {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  status: "SCHEDULED" | "PAUSED" | "CANCELLED";
  orderNote: string;
}

interface ActiveSubscription {
  orderId: string;
  planId: string;
  planTitle: string;
  pricePaid: number;
  billingCycle: "day" | "week" | "month";
  totalDeliveries: number;
  remainingDeliveries: number;
  maxPausesAllowed: number; // Weekly = 2, Monthly = 5
  pausesUsedCount: number;
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  startDate: string;
  deliverySlot: string;
  defaultFlowers: string; // Locked Default Order (Cannot be changed from My-Orders)
  customerName: string;
  email: string;
  phone: string;
  address: string;
  deliveryNote: string;
  calendarDays: CalendarDeliveryDay[];
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
  email?: string;
  phone: string;
  address: string;
  deliveryNote: string;
  status: string;
  createdAt: string;
}

function formatYMD(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function generateCalendarSchedule(
  startDateStr: string,
  totalDeliveries: number,
  defaultNote = "Hang pouch on main door handle (Do not ring bell)"
): CalendarDeliveryDay[] {
  const list: CalendarDeliveryDay[] = [];
  const start = startDateStr ? new Date(startDateStr) : new Date();
  if (isNaN(start.getTime())) {
    start.setTime(Date.now() + 86400000);
  }

  for (let i = 0; i < totalDeliveries; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    list.push({
      dateStr: formatYMD(d),
      dayNumber: i + 1,
      status: "SCHEDULED",
      orderNote: defaultNote,
    });
  }
  return list;
}

const DEFAULT_START = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatYMD(d);
})();

const DEFAULT_DEMO_SUBSCRIPTION: ActiveSubscription = {
  orderId: "PLS-SUB-849201",
  planId: "plan-monthly",
  planTitle: "Monthly Sacred Assortment",
  pricePaid: 1350,
  billingCycle: "month",
  totalDeliveries: 30,
  remainingDeliveries: 30,
  maxPausesAllowed: 5,
  pausesUsedCount: 0,
  status: "ACTIVE",
  startDate: DEFAULT_START,
  deliverySlot: "6:00 AM – 8:00 AM",
  defaultFlowers:
    "Mixed Sacred Box (60g Marigold झेंडू + 50g Chrysanthemum शेवंती + 4 Red Hibiscus लाल जास्वंद + Tulsi)",
  customerName: "Snehal Deshmukh",
  email: "snehal@example.com",
  phone: "9820123456",
  address: "B-1204, Hiranandani Estate, Thane West - 400607",
  deliveryNote: "Hang pouch on main door handle (Do not ring bell)",
  calendarDays: generateCalendarSchedule(DEFAULT_START, 30),
};

const DEFAULT_DEMO_ONETIME: OneTimeOrderRecord[] = [
  {
    orderId: "PLS-OT-512098",
    orderType: "ONE_TIME",
    flowerSummary: "Marigold (झेंडू) - 250g, Red Hibiscus (लाल जास्वंद) - 250g",
    totalGrams: 500,
    amountPaid: 195,
    deliveryDate: DEFAULT_START,
    deliverySlot: "6:00 AM – 8:00 AM",
    customerName: "Snehal Deshmukh",
    email: "snehal@example.com",
    phone: "9820123456",
    address: "B-1204, Hiranandani Estate, Thane West - 400607",
    deliveryNote: "Hang pouch on main door handle (Do not ring bell)",
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  },
];

function MyOrdersContent() {
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get("tab");

  const [activeSubTab, setActiveSubTab] = useState<"SUBSCRIPTION" | "ONETIME">(
    initialTabParam === "onetime" ? "ONETIME" : "SUBSCRIPTION"
  );

  const [sub, setSub] = useState<ActiveSubscription>(DEFAULT_DEMO_SUBSCRIPTION);
  const [oneTimeOrders, setOneTimeOrders] = useState<OneTimeOrderRecord[]>(
    DEFAULT_DEMO_ONETIME
  );

  // Month-Wise Calendar Navigation State
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Selected Date on Calendar (Opens Action Card when user clicks a date digit)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(DEFAULT_START);
  const [noteInput, setNoteInput] = useState<string>("");
  const [toast, setToast] = useState<string>("");

  // Email / Phone OTP Login Modal State (For syncing account on another device)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [otpSentToEmail, setOtpSentToEmail] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  useEffect(() => {
    try {
      const savedSub = localStorage.getItem("palassh_active_subscription");
      if (savedSub) {
        const parsed = JSON.parse(savedSub);
        const isWeekly =
          parsed.planId === "plan-weekly" ||
          parsed.billingCycle === "week" ||
          String(parsed.planTitle).toLowerCase().includes("week");
        const isOneDay =
          parsed.planId === "plan-daily" || parsed.billingCycle === "day";

        const maxPauses = isOneDay ? 0 : isWeekly ? 2 : 5;
        const totalDeliv = parsed.totalDeliveries || (isWeekly ? 7 : 30);
        const start = parsed.startDate || DEFAULT_START;

        const calendarDays: CalendarDeliveryDay[] =
          Array.isArray(parsed.calendarDays) && parsed.calendarDays.length > 0
            ? parsed.calendarDays
            : generateCalendarSchedule(
                start,
                totalDeliv,
                parsed.deliveryNote || DEFAULT_DEMO_SUBSCRIPTION.deliveryNote
              );

        const pausesUsed = calendarDays.filter(
          (d) => d.status === "PAUSED"
        ).length;

        const hydrated: ActiveSubscription = {
          ...DEFAULT_DEMO_SUBSCRIPTION,
          ...parsed,
          maxPausesAllowed: maxPauses,
          pausesUsedCount: pausesUsed,
          deliverySlot: "6:00 AM – 8:00 AM",
          calendarDays,
        };
        setSub(hydrated);
        if (calendarDays[0]) {
          setSelectedDateStr(calendarDays[0].dateStr);
          setNoteInput(calendarDays[0].orderNote || hydrated.deliveryNote);
        }
      } else {
        setNoteInput(DEFAULT_DEMO_SUBSCRIPTION.deliveryNote);
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

  const persistSub = (updated: ActiveSubscription, message: string) => {
    setSub(updated);
    setToast(message);
    try {
      localStorage.setItem(
        "palassh_active_subscription",
        JSON.stringify(updated)
      );
    } catch {
      // Ignore error
    }
    setTimeout(() => setToast(""), 5000);
  };

  // Switch between Weekly (2 Pauses) & Monthly (5 Pauses) to test client rules
  const handleSwitchDemoPlanType = (type: "WEEKLY" | "MONTHLY") => {
    const isWeekly = type === "WEEKLY";
    const totalDeliveries = isWeekly ? 7 : 30;
    const maxPausesAllowed = isWeekly ? 2 : 5;
    const cal = generateCalendarSchedule(
      DEFAULT_START,
      totalDeliveries,
      sub.deliveryNote
    );

    const updated: ActiveSubscription = {
      ...sub,
      planId: isWeekly ? "plan-weekly" : "plan-monthly",
      planTitle: isWeekly
        ? "Weekly Devotion Pack"
        : "Monthly Sacred Assortment",
      pricePaid: isWeekly ? 329 : 1350,
      billingCycle: isWeekly ? "week" : "month",
      totalDeliveries,
      remainingDeliveries: totalDeliveries,
      maxPausesAllowed,
      pausesUsedCount: 0,
      calendarDays: cal,
    };
    setSelectedDateStr(cal[0].dateStr);
    setNoteInput(cal[0].orderNote);
    persistSub(
      updated,
      `Switched to ${updated.planTitle} (${totalDeliveries} Days • Max ${maxPausesAllowed} Pauses Allowed).`
    );
  };

  // Select a date digit on the Month-Wise Calendar
  const handleSelectDateOnCalendar = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    const matched = sub.calendarDays.find((d) => d.dateStr === dateStr);
    if (matched) {
      setNoteInput(matched.orderNote || sub.deliveryNote);
    }
  };

  // Save Optional Order Note for the selected date
  const handleSaveDateNote = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedDays = sub.calendarDays.map((d) =>
      d.dateStr === selectedDateStr ? { ...d, orderNote: noteInput.trim() } : d
    );
    persistSub(
      { ...sub, calendarDays: updatedDays },
      `Saved delivery note for ${selectedDateStr}!`
    );
  };

  /**
   * Enforces Client Pause & Cancellation Rules:
   * - Weekly Subscriber: Up to 2 deliveries can be PAUSED (and carried forward by adding 1 extra day at the end).
   *   3rd or later skipped delivery is directly CANCELLED (no carry-forward).
   * - Monthly Subscriber: Up to 5 deliveries can be PAUSED (and carried forward).
   *   6th or later skipped delivery is directly CANCELLED.
   */
  const handlePauseOrCancelSelectedDate = () => {
    const targetDay = sub.calendarDays.find(
      (d) => d.dateStr === selectedDateStr
    );
    if (!targetDay) return;

    // If already PAUSED, allow user to Resume it back to SCHEDULED
    if (targetDay.status === "PAUSED") {
      const updatedDays = sub.calendarDays.map((d) =>
        d.dateStr === selectedDateStr
          ? { ...d, status: "SCHEDULED" as const }
          : d
      );
      // Remove the last carry-forward day if we added one
      if (updatedDays.length > sub.totalDeliveries) {
        updatedDays.pop();
      }
      const pausesUsed = updatedDays.filter(
        (d) => d.status === "PAUSED"
      ).length;
      persistSub(
        {
          ...sub,
          pausesUsedCount: pausesUsed,
          calendarDays: updatedDays,
        },
        `Resumed morning delivery for ${selectedDateStr}!`
      );
      return;
    }

    if (targetDay.status === "CANCELLED") {
      return;
    }

    const currentPausesUsed = sub.calendarDays.filter(
      (d) => d.status === "PAUSED"
    ).length;

    // Case 1: Within Pause Quota (Weekly <= 2, Monthly <= 5) -> PAUSE & Carry Forward (+1 day at end)
    if (currentPausesUsed < sub.maxPausesAllowed) {
      const updatedDays = sub.calendarDays.map((d) =>
        d.dateStr === selectedDateStr ? { ...d, status: "PAUSED" as const } : d
      );

      // Carry forward: add 1 extra scheduled day after the last date
      const lastEntry = updatedDays[updatedDays.length - 1];
      const nextDateObj = new Date(lastEntry.dateStr);
      nextDateObj.setDate(nextDateObj.getDate() + 1);
      updatedDays.push({
        dateStr: formatYMD(nextDateObj),
        dayNumber: updatedDays.length + 1,
        status: "SCHEDULED",
        orderNote: sub.deliveryNote,
      });

      const newPausesCount = currentPausesUsed + 1;
      persistSub(
        {
          ...sub,
          pausesUsedCount: newPausesCount,
          calendarDays: updatedDays,
        },
        `Paused ${selectedDateStr} (${newPausesCount}/${sub.maxPausesAllowed} pauses used). Your delivery has been carried forward to ${formatYMD(
          nextDateObj
        )}!`
      );
      return;
    }

    // Case 2: Pause Quota Exhausted (3rd+ for Weekly, 6th+ for Monthly) -> Direct CANCEL (No carry forward)
    const updatedDays = sub.calendarDays.map((d) =>
      d.dateStr === selectedDateStr
        ? { ...d, status: "CANCELLED" as const }
        : d
    );
    const newRemaining = Math.max(0, sub.remainingDeliveries - 1);

    persistSub(
      {
        ...sub,
        remainingDeliveries: newRemaining,
        calendarDays: updatedDays,
      },
      `Pause limit (${sub.maxPausesAllowed}/${sub.maxPausesAllowed}) already used. Delivery for ${selectedDateStr} has been CANCELLED without carry-forward.`
    );
  };

  // Render Month-Wise Calendar Grid
  const renderMonthCells = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: { day: number | null; dateStr: string }[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ day: null, dateStr: `empty-${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      cells.push({ day: d, dateStr: `${year}-${mm}-${dd}` });
    }
    return cells;
  };

  // Send OTP simulation for Email/Phone login modal
  const handleSendLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) return;
    const maskedEmail = loginIdentifier.includes("@")
      ? loginIdentifier.trim()
      : sub.email || "your linked email";
    setOtpSentToEmail(maskedEmail);
  };

  const handleVerifyLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.length < 4) return;
    setIsLoginModalOpen(false);
    setOtpSentToEmail("");
    setEnteredOtp("");
    setToast(
      "Verified via Email OTP! Your subscription & delivery calendar are synced on this device."
    );
    setTimeout(() => setToast(""), 4500);
  };

  const activeSelectedDayObj = sub.calendarDays.find(
    (d) => d.dateStr === selectedDateStr
  );
  const pausesRemaining = Math.max(
    0,
    sub.maxPausesAllowed - sub.pausesUsedCount
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FAF7F2] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-orange-200/70 pb-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#071C15] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                <Sparkles className="h-3 w-3 text-[#F05A36]" />
                <span>Customer Delivery Calendar</span>
              </span>
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/30 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-900 hover:bg-emerald-100 cursor-pointer"
              >
                <Mail className="h-3 w-3 text-[#E8502B]" />
                <span>Sync Account via Email / Phone OTP</span>
              </button>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              My Orders & Morning Calendar
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Tap any delivery date on the calendar below to pause or add a doorstep note before 8:00 PM.
            </p>
          </div>

          {/* 2 Separate Sub-Tabs */}
          <div className="inline-flex rounded-2xl border border-stone-200 bg-white p-1.5 shadow-sm self-start">
            <button
              type="button"
              onClick={() => setActiveSubTab("SUBSCRIPTION")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeSubTab === "SUBSCRIPTION"
                  ? "bg-gradient-to-r from-[#071C15] to-emerald-900 text-amber-300 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Calendar className="h-3.5 w-3.5 text-[#F05A36]" />
              <span>1. Subscription Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("ONETIME")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeSubTab === "ONETIME"
                  ? "bg-gradient-to-r from-[#071C15] to-emerald-900 text-amber-300 shadow-xs"
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

        {/* SUB-TAB 1: ACTIVE SUBSCRIPTION SUMMARY + MONTH-WISE CALENDAR */}
        {activeSubTab === "SUBSCRIPTION" && (
          <div className="space-y-8">
            {/* Top Subscription Overview Card (Default Flowers Locked) */}
            <div className="overflow-hidden rounded-3xl sm:rounded-[2.2rem] border border-stone-200 bg-white shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#071C15] via-[#0B2E22] to-[#071C15] px-5 sm:px-7 py-4 text-white">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-bold text-emerald-200">
                    Order #{sub.orderId}
                  </span>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-0.5 text-[11px] font-bold text-emerald-300">
                    Slot: 6:00 AM – 8:00 AM
                  </span>
                  <span className="rounded-full bg-amber-500/20 border border-amber-400/30 px-3 py-0.5 text-[11px] font-bold text-amber-200">
                    Pauses Used: {sub.pausesUsedCount} / {sub.maxPausesAllowed}
                  </span>
                </div>

                {/* Quick Test Switcher for Weekly (2 Pauses) vs Monthly (5 Pauses) */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-emerald-200/80 mr-1">Test Plan:</span>
                  <button
                    type="button"
                    onClick={() => handleSwitchDemoPlanType("WEEKLY")}
                    className={`rounded-lg px-2.5 py-1 font-bold cursor-pointer ${
                      sub.billingCycle === "week"
                        ? "bg-[#E8502B] text-white"
                        : "bg-white/10 text-emerald-100 hover:bg-white/20"
                    }`}
                  >
                    Weekly (Max 2 Pauses)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchDemoPlanType("MONTHLY")}
                    className={`rounded-lg px-2.5 py-1 font-bold cursor-pointer ${
                      sub.billingCycle === "month"
                        ? "bg-[#E8502B] text-white"
                        : "bg-white/10 text-emerald-100 hover:bg-white/20"
                    }`}
                  >
                    Monthly (Max 5 Pauses)
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-7 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7 space-y-2">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    {sub.planTitle} (₹{sub.pricePaid})
                  </h2>
                  <div className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2 text-xs text-stone-700">
                    <Lock className="h-3.5 w-3.5 text-[#E8502B] shrink-0" />
                    <span>
                      <strong>Default Locked Flower Pack:</strong>{" "}
                      {sub.defaultFlowers}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 flex items-center gap-1.5 pt-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>
                      {sub.customerName} ({sub.email}) — {sub.address}
                    </span>
                  </p>
                </div>

                {/* Pause Quota Rules Box */}
                <div className="lg:col-span-5 rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50/60 to-emerald-50/50 p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                    <span>Pause Quota ({sub.planTitle}):</span>
                    <span className="text-[#E8502B]">
                      {pausesRemaining} Pauses Left
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    • You can pause up to{" "}
                    <strong>{sub.maxPausesAllowed} deliveries</strong> (days carry forward).
                    <br />• From the{" "}
                    <strong>
                      {sub.maxPausesAllowed + 1}
                      {sub.maxPausesAllowed === 2 ? "rd" : "th"} skip onwards
                    </strong>
                    , the delivery will be directly{" "}
                    <strong className="text-rose-700">CANCELLED</strong> without carry-forward.
                  </p>
                </div>
              </div>
            </div>

            {/* MONTH-WISE CALENDAR + CLICKABLE DATE ACTION CARD */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left: Month-Wise Delivery Calendar (7 Cols) */}
              <div className="lg:col-span-7 rounded-3xl sm:rounded-[2.2rem] border border-stone-200 bg-white p-5 sm:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8502B]">
                      Interactive Monthly View
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                      Upcoming Morning Deliveries
                    </h3>
                  </div>

                  {/* Month Switcher */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarMonth(
                          new Date(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-[#FAF7F2] hover:bg-stone-100 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-serif text-sm sm:text-base font-bold text-stone-900 min-w-[130px] text-center">
                      {calendarMonth.toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarMonth(
                          new Date(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-[#FAF7F2] hover:bg-stone-100 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-emerald-600 inline-block" />
                    Scheduled (6–8 AM)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-amber-400 inline-block" />
                    Paused (Carried Forward)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-rose-500 inline-block" />
                    Cancelled
                  </span>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-[11px] font-bold uppercase text-stone-400">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div key={d}>{d}</div>
                    )
                  )}
                </div>

                {/* Calendar Digits Grid */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {renderMonthCells().map((cell) => {
                    if (!cell.day) {
                      return <div key={cell.dateStr} className="h-12 sm:h-14" />;
                    }
                    const deliveryDay = sub.calendarDays.find(
                      (d) => d.dateStr === cell.dateStr
                    );
                    const isSelected = selectedDateStr === cell.dateStr;

                    if (!deliveryDay) {
                      return (
                        <div
                          key={cell.dateStr}
                          className="flex flex-col items-center justify-center h-12 sm:h-14 rounded-xl border border-stone-100 bg-stone-50/50 text-xs text-stone-300 select-none"
                        >
                          <span>{cell.day}</span>
                        </div>
                      );
                    }

                    const statusClasses =
                      deliveryDay.status === "SCHEDULED"
                        ? "border-emerald-600/40 bg-emerald-50/90 text-emerald-950 hover:bg-emerald-100"
                        : deliveryDay.status === "PAUSED"
                        ? "border-amber-400 bg-amber-50 text-amber-950"
                        : "border-rose-300 bg-rose-50 text-rose-800 line-through";

                    return (
                      <button
                        key={cell.dateStr}
                        type="button"
                        onClick={() =>
                          handleSelectDateOnCalendar(cell.dateStr)
                        }
                        className={`relative flex flex-col items-center justify-center h-12 sm:h-14 rounded-xl sm:rounded-2xl border text-xs font-bold transition cursor-pointer ${statusClasses} ${
                          isSelected
                            ? "ring-2 ring-[#E8502B] ring-offset-2 scale-105 shadow-md"
                            : ""
                        }`}
                      >
                        <span className="text-sm font-bold">{cell.day}</span>
                        <span className="text-[9px] uppercase tracking-tighter">
                          {deliveryDay.status === "SCHEDULED"
                            ? `Day ${deliveryDay.dayNumber}`
                            : deliveryDay.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Date Action Card (Opens when clicking any delivery date digit) (5 Cols) */}
              <div className="lg:col-span-5">
                <div className="sticky top-28 rounded-3xl sm:rounded-[2.2rem] border-2 border-orange-200/90 bg-white p-6 sm:p-8 shadow-xl space-y-6">
                  {activeSelectedDayObj ? (
                    <>
                      <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                        <div>
                          <span className="inline-block rounded-lg bg-[#071C15] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                            Delivery Day #{activeSelectedDayObj.dayNumber}
                          </span>
                          <h3 className="mt-2 font-serif text-2xl font-bold text-stone-900">
                            {new Date(
                              activeSelectedDayObj.dateStr
                            ).toLocaleDateString("en-IN", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </h3>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Morning Window: 6:00 AM – 8:00 AM
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            activeSelectedDayObj.status === "SCHEDULED"
                              ? "bg-emerald-100 text-emerald-900"
                              : activeSelectedDayObj.status === "PAUSED"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {activeSelectedDayObj.status}
                        </span>
                      </div>

                      {/* Locked Default Flower Pack Info */}
                      <div className="rounded-2xl border border-stone-200 bg-[#FAF7F2] p-4 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                          <Lock className="h-3 w-3 text-[#E8502B]" />
                          Default Subscription Pouch (Fixed)
                        </span>
                        <p className="text-xs font-bold text-stone-800 leading-relaxed">
                          {sub.defaultFlowers}
                        </p>
                      </div>

                      {/* Optional Order Note for this Date */}
                      <form onSubmit={handleSaveDateNote} className="space-y-3">
                        <label className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-emerald-700" />
                          <span>Order / Doorstep Note for This Date (Optional)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          placeholder="e.g. Leave pouch with security guard today..."
                          className="w-full rounded-xl border border-stone-300 bg-[#FAF7F2] p-3 text-xs sm:text-sm text-stone-900 focus:border-[#E8502B] focus:bg-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="rounded-xl border border-emerald-700/30 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                        >
                          Save Note for {activeSelectedDayObj.dateStr}
                        </button>
                      </form>

                      {/* Pause / Cancel Button with Quota Warning */}
                      <div className="border-t border-stone-100 pt-5 space-y-3">
                        {activeSelectedDayObj.status === "SCHEDULED" &&
                          pausesRemaining === 0 && (
                            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[11px] font-semibold text-rose-900">
                              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                              <span>
                                You have used all{" "}
                                <strong>
                                  {sub.maxPausesAllowed} allowed pauses
                                </strong>{" "}
                                for your {sub.planTitle}. Skipping this date will{" "}
                                <strong>CANCEL</strong> the delivery without carry-forward.
                              </span>
                            </div>
                          )}

                        {activeSelectedDayObj.status === "CANCELLED" ? (
                          <div className="rounded-2xl bg-rose-100 py-3.5 text-center text-xs font-bold text-rose-900">
                            This Delivery Was Cancelled (Quota Exceeded)
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handlePauseOrCancelSelectedDate}
                            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs sm:text-sm font-bold text-white shadow-lg transition cursor-pointer ${
                              activeSelectedDayObj.status === "PAUSED"
                                ? "bg-gradient-to-r from-emerald-600 to-teal-500"
                                : pausesRemaining > 0
                                ? "bg-gradient-to-r from-[#E8502B] via-[#F05A36] to-amber-600"
                                : "bg-rose-600 hover:bg-rose-700"
                            }`}
                          >
                            {activeSelectedDayObj.status === "PAUSED" ? (
                              <>
                                <PlayCircle className="h-4 w-4" />
                                <span>
                                  Resume Delivery for{" "}
                                  {activeSelectedDayObj.dateStr}
                                </span>
                              </>
                            ) : pausesRemaining > 0 ? (
                              <>
                                <PauseCircle className="h-4 w-4" />
                                <span>
                                  Pause This Date ({pausesRemaining} of{" "}
                                  {sub.maxPausesAllowed} Pauses Left)
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4" />
                                <span>
                                  Cancel Delivery (Pause Limit Reached)
                                </span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center text-xs text-stone-500">
                      Click any highlighted delivery date digit on the calendar to manage that day&apos;s delivery.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: SEPARATE FLOWER PURCHASES */}
        {activeSubTab === "ONETIME" && (
          <div className="rounded-3xl sm:rounded-[2.2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8502B]">
                  A-La-Carte Order History
                </span>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Separate Flower Purchases ({oneTimeOrders.length})
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] to-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-sm"
              >
                <ShoppingBag className="h-4 w-4" />
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

      {/* EMAIL / PHONE OTP LOGIN MODAL (Frontend UI Ready for SMTP Integration) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={() => {
                setIsLoginModalOpen(false);
                setOtpSentToEmail("");
              }}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-700 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-900">
                <KeyRound className="h-3 w-3 text-[#E8502B]" />
                <span>Multi-Device Email OTP Sync</span>
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Access Your Subscription
              </h3>
              <p className="text-xs text-stone-500">
                Enter your registered 10-digit Phone Number or Email. We will send a 6-digit verification code to your linked Email.
              </p>
            </div>

            {!otpSentToEmail ? (
              <form onSubmit={handleSendLoginOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Registered Phone Number OR Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. 9820123456 or snehal@gmail.com"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-3 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-[#E8502B] to-emerald-600 py-3.5 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Send OTP to Linked Email
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
                  Verification code sent to{" "}
                  <strong>{otpSentToEmail}</strong>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Enter 6-Digit Email Verification Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) =>
                      setEnteredOtp(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="e.g. 482910"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-3 text-center tracking-[0.3em] font-bold text-base text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Verify & Sync My Subscription
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <FeatureBoundary featureName="ORDERS">
      <Suspense
        fallback={
          <div className="p-12 text-center text-sm text-stone-500">
            Loading Delivery Calendar...
          </div>
        }
      >
        <MyOrdersContent />
      </Suspense>
    </FeatureBoundary>
  );
}