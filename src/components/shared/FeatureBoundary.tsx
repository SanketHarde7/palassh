"use client";

import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Sparkles, RotateCcw } from "lucide-react";
import { logger } from "@/lib/logger";

interface Props {
  children: React.ReactNode;
  featureName: "LAYOUT" | "HERO" | "PINCODE" | "CATALOG" | "CHECKOUT" | "ORDERS" | "ADMIN";
}

export function FeatureBoundary({ children, featureName }: Props) {
  return (
    <ErrorBoundary
      onError={(error) => {
        logger.error(
          {
            module: featureName,
            action: "MODULE_CRASH_ISOLATED",
            message: `${featureName} encountered a runtime error.`,
          },
          error
        );
      }}
      fallbackRender={({ resetErrorBoundary }) => (
        <div className="my-6 mx-auto max-w-xl rounded-2xl border border-orange-200/80 bg-orange-50/40 p-5 text-center shadow-xs">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-stone-800">
            Refreshing the {featureName.toLowerCase()} section...
          </p>
          <button
            onClick={resetErrorBoundary}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-orange-600 shadow-xs ring-1 ring-orange-200 transition hover:bg-orange-50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reload Section
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}