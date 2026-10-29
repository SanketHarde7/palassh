"use client";

import React, { useEffect } from "react";
import { Sparkles, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(
      {
        module: "LAYOUT",
        action: "GLOBAL_PAGE_ERROR",
        message: "Unhandled application error caught by root error.tsx",
      },
      error
    );
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FFFDFB]">
      <div className="max-w-md w-full rounded-3xl border border-orange-200/80 bg-white p-8 text-center shadow-xl shadow-orange-950/5">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#F05A36]">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Refreshing Your Experience
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          Something momentarily interrupted this page. Your subscription data and cart are completely safe.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F05A36] to-[#F59E0B] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-105 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-orange-50"
          >
            <Home className="h-3.5 w-3.5" />
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}