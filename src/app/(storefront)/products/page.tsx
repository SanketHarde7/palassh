"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  Trash2,
  X,
  Scale,
} from "lucide-react";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import {
  FlowerProduct,
  INITIAL_FLOWERS,
  CartItem,
  getActiveFlowersCatalog,
  getStoredCart,
  saveStoredCart,
  getCurrentCustomerTier,
  getFestiveModeStatus,
  validateDirectFlowerPurchaseLimit,
} from "@/features/catalog/types";

export default function AllProductsPage() {
  const [flowers, setFlowers] = useState<FlowerProduct[]>(INITIAL_FLOWERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedWeightIdxByFlower, setSelectedWeightIdxByFlower] = useState<
    Record<string, number>
  >({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [customerTier, setCustomerTier] = useState<
    "NORMAL" | "ONE_DAY" | "WEEKLY" | "MONTHLY"
  >("NORMAL");
  const [festiveStatus, setFestiveStatus] = useState({
    isFestiveDay: false,
    festivalName: "Festive Puja",
  });

  const [popupToast, setPopupToast] = useState<{
    visible: boolean;
    isError?: boolean;
    title: string;
    subtitle: string;
  }>({ visible: false, title: "", subtitle: "" });

  useEffect(() => {
    const syncAll = () => {
      setFlowers(getActiveFlowersCatalog());
      setCart(getStoredCart());
      setCustomerTier(getCurrentCustomerTier());
      setFestiveStatus(getFestiveModeStatus());
    };
    syncAll();
    window.addEventListener("palassh-cart-updated", syncAll);
    window.addEventListener("palassh-festive-updated", syncAll);
    return () => {
      window.removeEventListener("palassh-cart-updated", syncAll);
      window.removeEventListener("palassh-festive-updated", syncAll);
    };
  }, []);

  const handleSelectFlowerGramPack = (flower: FlowerProduct) => {
    const weightIdx = selectedWeightIdxByFlower[flower.id] || 0;
    const weightObj =
      flower.availableWeights[weightIdx] || flower.availableWeights[0];
    const selectedGrams = weightObj.grams || 100;

    const otherFlowersGrams = cart
      .filter((item) => item.flowerId !== flower.id)
      .reduce((acc, i) => acc + (i.grams || 100), 0);

    const tier = getCurrentCustomerTier();
    const festive = getFestiveModeStatus();

    const validation = validateDirectFlowerPurchaseLimit(
      otherFlowersGrams,
      selectedGrams,
      tier,
      festive.isFestiveDay
    );

    if (!validation.allowed) {
      setPopupToast({
        visible: true,
        isError: true,
        title: "Purchase Restricted / Quota Limit",
        subtitle: validation.reason || "Limit exceeded.",
      });
      setTimeout(
        () => setPopupToast((prev) => ({ ...prev, visible: false })),
        5500
      );
      return;
    }

    const updatedCart = cart.filter((item) => item.flowerId !== flower.id);
    updatedCart.push({
      id: `${flower.id}-${selectedGrams}`,
      flowerId: flower.id,
      flowerName: flower.name,
      marathiName: flower.marathiName,
      imageUrl: flower.imageUrl,
      weightLabel: `${selectedGrams}g`,
      grams: selectedGrams,
      unitPrice: weightObj.price,
      quantity: 1,
    });

    setCart(updatedCart);
    saveStoredCart(updatedCart);

    const newTotalGrams = otherFlowersGrams + selectedGrams;
    setPopupToast({
      visible: true,
      isError: false,
      title: `${flower.name} (${flower.marathiName}) — ${selectedGrams}g Added!`,
      subtitle: `Combined Basket Weight: ${newTotalGrams}g • Morning 6:00 AM – 8:00 AM Slot`,
    });
    setTimeout(
      () => setPopupToast((prev) => ({ ...prev, visible: false })),
      4500
    );
  };

  const handleRemoveFromCart = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    saveStoredCart(updated);
  };

  const totalCartGrams = cart.reduce((acc, i) => acc + (i.grams || 100), 0);
  const totalCartAmount = cart.reduce((acc, i) => acc + i.unitPrice, 0);
  const isNormalLockedOnFestive =
    festiveStatus.isFestiveDay &&
    (customerTier === "NORMAL" || customerTier === "ONE_DAY");

  return (
    <FeatureBoundary featureName="ALL_PRODUCTS">
      <div className="min-h-screen bg-[#FAF7F2] py-14 px-4 sm:px-6 lg:px-8">
        {/* POPUP NOTIFICATION TOAST */}
        {popupToast.visible && (
          <div
            className={`fixed top-28 right-4 sm:right-6 z-50 max-w-sm w-full rounded-2xl border-2 p-4 text-white shadow-2xl transition-all ${
              popupToast.isError
                ? "border-rose-400 bg-rose-950"
                : "border-amber-400 bg-[#071C15]"
            }`}
          >
            <div className="flex items-start gap-3">
              {popupToast.isError ? (
                <AlertCircle className="h-5 w-5 text-rose-300 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-serif text-sm font-bold">
                  {popupToast.title}
                </p>
                <p className="mt-1 text-xs text-stone-200 leading-relaxed">
                  {popupToast.subtitle}
                </p>
                {!popupToast.isError && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPopupToast((prev) => ({ ...prev, visible: false }));
                        setIsCartOpen(true);
                      }}
                      className="rounded-lg bg-[#E8502B] px-3 py-1.5 text-[11px] font-bold text-white cursor-pointer"
                    >
                      Open Cart ({totalCartGrams}g)
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  setPopupToast((prev) => ({ ...prev, visible: false }))
                }
                className="text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-orange-200/70 pb-8">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#071C15] px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-[#F05A36]" />
                <span>Thane Farm-to-Mandir Catalog (400601–400608)</span>
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
                All Sacred Puja Flowers
              </h1>
              <p className="text-xs sm:text-sm text-stone-600">
                Select your exact weight in grams (<strong className="text-stone-900">100g, 250g, 500g, 1000g</strong>). Normal days allow up to 500g combined; Weekly (2 KG) & Monthly (3 KG) subscribers unlock festive quotas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#071C15] px-6 py-4 text-xs font-bold text-amber-200 shadow-xl hover:bg-emerald-950 cursor-pointer shrink-0"
            >
              <ShoppingBag className="h-4 w-4 text-[#F05A36]" />
              <span>
                Flower Basket ({cart.length} • {totalCartGrams}g • ₹
                {totalCartAmount})
              </span>
            </button>
          </div>

          {/* Festive Day Strict Lock Banner */}
          {festiveStatus.isFestiveDay && (
            <div
              className={`rounded-3xl border-2 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isNormalLockedOnFestive
                  ? "border-rose-400 bg-rose-950 text-white"
                  : "border-amber-400 bg-[#071C15] text-white"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <Flame className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-serif text-lg sm:text-xl font-bold text-amber-200">
                    {isNormalLockedOnFestive
                      ? "🔒 Festive Day Lock Active — Subscribers Only"
                      : `✨ Festive Quota Unlocked (${customerTier} Member)`}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-200">
                    {isNormalLockedOnFestive
                      ? "Today/Tomorrow is marked as a Festive Day. Direct flower purchases are locked for non-subscribers so our Weekly (up to 2 KG) and Monthly (up to 3 KG) members receive guaranteed morning blooms."
                      : `Your active ${customerTier} subscription entitles you to book up to ${
                          customerTier === "MONTHLY" ? "3 KG (3000g)" : "2 KG (2000g)"
                        } combined across all flowers!`}
                  </p>
                </div>
              </div>
              {isNormalLockedOnFestive && (
                <Link
                  href="/#plans"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] to-[#D97706] px-6 py-3.5 text-xs font-bold text-white shadow-lg shrink-0"
                >
                  <span>Subscribe to Weekly (₹329) / Monthly (₹1,350)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}

          {/* All Flowers Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {flowers.map((flower, idx) => {
              const selectedIdx = selectedWeightIdxByFlower[flower.id] || 0;
              const selectedWeight =
                flower.availableWeights[selectedIdx] ||
                flower.availableWeights[0];
              const existingInCart = cart.find(
                (c) => c.flowerId === flower.id
              );

              return (
                <ScrollReveal key={flower.id} delayMs={(idx % 3) * 110}>
                  <div className="flex flex-col justify-between h-full overflow-hidden rounded-[2.2rem] border border-stone-200/90 bg-white shadow-[0_18px_45px_-12px_rgba(28,22,19,0.09)] transition hover:border-[#D97706] hover:shadow-2xl">
                    <div>
                      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                        <img
                          src={flower.imageUrl}
                          alt={flower.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071C15]/85 via-transparent to-transparent" />
                        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1 text-[11px] font-bold text-emerald-950 shadow-sm">
                          {flower.inStock ? "Fresh Farm Stock" : "Out of Stock"}
                        </span>
                        {existingInCart && (
                          <span className="absolute right-4 top-4 rounded-full bg-[#E8502B] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                            In Cart: {existingInCart.grams}g
                          </span>
                        )}
                        <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                          <span className="text-xs font-medium text-emerald-100">
                            {flower.deityAffinity}
                          </span>
                          <span className="rounded-lg bg-black/50 backdrop-blur-md px-3 py-1 text-xs font-bold text-amber-300 border border-white/15">
                            6:00 – 8:00 AM
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div>
                          <div className="flex items-baseline gap-2.5">
                            <h2 className="font-serif text-2xl font-bold text-stone-900">
                              {flower.name}
                            </h2>
                            <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
                              {flower.marathiName}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-stone-500">
                            {flower.subtitle}
                          </p>
                        </div>

                        {/* Strictly Grams Selector Only (Point #9) */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                            Select Weight (Grams Only):
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {flower.availableWeights.map((wt, wIdx) => {
                              const active = selectedIdx === wIdx;
                              return (
                                <button
                                  key={wt.grams}
                                  type="button"
                                  onClick={() =>
                                    setSelectedWeightIdxByFlower((prev) => ({
                                      ...prev,
                                      [flower.id]: wIdx,
                                    }))
                                  }
                                  className={`rounded-xl border py-2.5 px-1 text-center transition cursor-pointer ${
                                    active
                                      ? "border-2 border-[#E8502B] bg-orange-50/70 font-bold text-stone-900"
                                      : "border-stone-200 bg-[#FAF7F2] text-stone-600 hover:border-orange-300"
                                  }`}
                                >
                                  <span className="block text-xs font-bold">
                                    {wt.grams}g
                                  </span>
                                  <span className="block text-[11px] font-semibold text-[#E8502B]">
                                    ₹{wt.price}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2">
                      <button
                        type="button"
                        disabled={!flower.inStock || isNormalLockedOnFestive}
                        onClick={() => handleSelectFlowerGramPack(flower)}
                        className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs sm:text-sm font-bold transition ${
                          !flower.inStock || isNormalLockedOnFestive
                            ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                            : "bg-[#071C15] text-amber-200 hover:bg-[#E8502B] hover:text-white cursor-pointer shadow-md"
                        }`}
                      >
                        <Scale className="h-4 w-4" />
                        <span>
                          {isNormalLockedOnFestive
                            ? "Locked on Festive Day (Subscribers Only)"
                            : `Add ${selectedWeight.grams}g Pack • ₹${selectedWeight.price}`}
                        </span>
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* SLIDE-OVER CART DRAWER */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs">
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-md bg-white p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      Flower Basket ({totalCartGrams}g)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-700 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-20 text-center text-sm text-stone-500">
                      Your flower basket is empty.
                    </div>
                  ) : (
                    <div className="mt-6 divide-y divide-stone-100">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="py-4 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.flowerName}
                              className="h-12 w-12 rounded-xl object-cover border border-stone-200"
                            />
                            <div>
                              <h4 className="font-serif text-sm font-bold text-stone-900">
                                {item.flowerName} ({item.marathiName})
                              </h4>
                              <p className="text-xs font-bold text-[#E8502B]">
                                {item.grams}g Pack • ₹{item.unitPrice}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-stone-100 pt-5 space-y-4">
                    <div className="flex justify-between text-base font-bold text-stone-900">
                      <span>Total ({totalCartGrams}g):</span>
                      <span className="font-serif text-2xl text-[#E8502B]">
                        ₹{totalCartAmount}
                      </span>
                    </div>
                    <Link
                      href="/checkout?mode=onetime"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] to-[#D97706] py-4 text-sm font-bold text-white shadow-lg"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </FeatureBoundary>
  );
}