"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-[2rem] border border-orange-200 bg-white p-8 text-center shadow-xl space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-[#E8502B]">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          Admin Module Temporary Glitch
        </h1>
        <p className="text-xs text-stone-600 leading-relaxed">
          {error?.message ||
            "An unexpected error occurred in the Admin Console. Your storefront and customer orders remain 100% unaffected."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#071C15] px-5 py-3 text-xs font-bold text-amber-200 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry Admin Console</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 px-4 py-3 text-xs font-bold text-stone-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}