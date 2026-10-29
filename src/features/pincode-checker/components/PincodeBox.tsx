"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Truck,
  ShieldCheck,
  Leaf,
} from "lucide-react";
import { checkPincodeAvailability, PincodeZone } from "../pincode.service";
import { logger } from "@/lib/logger";

export function PincodeBox() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<{
    checked: boolean;
    serviceable: boolean;
    message: string;
    zone?: PincodeZone;
  }>({ checked: false, serviceable: false, message: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("palassh_verified_pincode");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.pincode) {
          const check = checkPincodeAvailability(parsed.pincode);
          if (check.serviceable && check.zone) {
            setPincode(check.zone.pincode);
            setStatus({
              checked: true,
              serviceable: true,
              message: `Delivering to ${check.zone.area} (${check.zone.deliverySlot})`,
              zone: check.zone,
            });
          } else {
            localStorage.removeItem("palassh_verified_pincode");
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const runValidation = (code: string) => {
    const res = checkPincodeAvailability(code);
    setStatus({
      checked: true,
      serviceable: res.serviceable,
      message: res.message,
      zone: res.zone,
    });

    logger.info({
      module: "PINCODE",
      action: "PINCODE_CHECKED",
      message: `Checked ${code} -> ${res.serviceable}`,
    });

    if (res.serviceable && res.zone) {
      try {
        localStorage.setItem("palassh_verified_pincode", JSON.stringify(res.zone));
      } catch {
        // Ignore storage error
      }
    }
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    runValidation(pincode);
  };

  return (
    <section
      id="pincode-check"
      className="relative z-20 -mt-10 sm:-mt-14 mx-auto max-w-6xl px-3.5 sm:px-6"
    >
      <div className="overflow-hidden rounded-3xl sm:rounded-[2rem] border border-emerald-900/15 bg-white shadow-2xl shadow-stone-900/10">
        {/* Top Botanical Emerald + Saffron Status Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-[#071C15] via-[#0D3225] to-[#133A2B] px-4 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-xs text-emerald-100">
          <div className="flex items-center gap-2 font-medium">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>
              Serviceable Thane Zones:{" "}
              <strong className="text-amber-300">Pincodes 400601 to 400608</strong>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-200/80">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-amber-400" /> Free Morning Drop
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Silent Bell-Free Hang
            </span>
          </div>
        </div>

        {/* Main Concierge Body */}
        <div className="p-5 sm:p-8 lg:p-10 bg-gradient-to-br from-white via-[#FFFDFB] to-emerald-50/25">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            {/* Left Copy (5 Cols) */}
            <div className="lg:col-span-5 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800">
                <Leaf className="h-3.5 w-3.5 text-[#E8502B]" />
                <span>5:00 AM – 8:00 AM Route Check</span>
              </div>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-stone-900 leading-tight">
                Verify Delivery in Your Society
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                Serving Thane pincodes <strong className="text-stone-700">400601 – 400608</strong>. Enter your pincode to lock your morning slot.
              </p>
            </div>

            {/* Right Input & Quick Pills (7 Cols) */}
            <div className="lg:col-span-7 space-y-3.5">
              <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <div className="relative flex-1">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-[#E8502B]" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter Pincode (400601 - 400608)"
                    className="w-full rounded-2xl border-2 border-stone-200/90 bg-[#FAF7F2] py-3.5 sm:py-4 pl-11 sm:pl-12 pr-4 text-sm font-bold tracking-wide text-stone-900 placeholder:font-normal placeholder:text-stone-400 focus:border-[#E8502B] focus:bg-white focus:outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] to-[#F59E0B] px-7 py-3.5 sm:py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-105 cursor-pointer shrink-0"
                >
                  <span>Verify Pincode</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Quick Society Pills (Strictly 400601 - 400608) */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1">
                  Tap Zone:
                </span>
                {[
                  { label: "Thane West (400601)", code: "400601" },
                  { label: "Naupada (400602)", code: "400602" },
                  { label: "Kalwa Hub (400605)", code: "400605" },
                  { label: "Pokhran / Vartak (400606)", code: "400606" },
                  { label: "Ghodbunder (400607)", code: "400607" },
                  { label: "Balkum / Kolshet (400608)", code: "400608" },
                ].map((pill) => (
                  <button
                    key={pill.code}
                    type="button"
                    onClick={() => {
                      setPincode(pill.code);
                      runValidation(pill.code);
                    }}
                    className={`rounded-full border px-2.5 sm:px-3 py-1 text-[11px] font-medium transition cursor-pointer ${
                      pincode === pill.code
                        ? "border-emerald-700 bg-emerald-900 text-white font-semibold"
                        : "border-stone-200 bg-white text-stone-600 hover:border-[#E8502B] hover:text-[#E8502B]"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Banner */}
          {status.checked && (
            <div
              className={`mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 text-xs sm:text-sm ${
                status.serviceable
                  ? "border-emerald-300 bg-emerald-50/90 text-emerald-950"
                  : "border-rose-200 bg-rose-50/90 text-rose-950"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {status.serviceable ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">{status.message}</p>
                  {status.serviceable && (
                    <p className="mt-0.5 text-[11px] text-emerald-800">
                      Route Verified • Breathable Eco-Pouch • Silent Morning Doorstep Hang
                    </p>
                  )}
                </div>
              </div>
              {status.serviceable && (
                <a
                  href="#plans"
                  className="inline-flex items-center justify-center rounded-xl bg-[#071C15] px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-emerald-950 shrink-0"
                >
                  Choose Plan ↓
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}