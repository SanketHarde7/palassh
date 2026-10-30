import React from "react";
import Link from "next/link";
import { Sparkles, Home, Flower2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#FAF7F2]">
      <div className="max-w-md w-full rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 text-center shadow-xl shadow-stone-900/5">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071C15] text-amber-300 shadow-md">
          <Sparkles className="h-7 w-7 text-[#E8502B]" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8502B]">
          404 • Page Not Found
        </span>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Blooms Not Found
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
          The sacred offerings or page you are looking for might have been moved or the address was mistyped.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] via-[#F05A36] to-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:brightness-105 transition"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-stone-100 px-5 py-3.5 text-xs font-bold text-stone-700 hover:bg-stone-200 transition"
          >
            <Flower2 className="h-4 w-4 text-emerald-700" />
            <span>Flower Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

