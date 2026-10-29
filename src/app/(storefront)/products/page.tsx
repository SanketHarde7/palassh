"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Search,
  Eye,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Leaf,
} from "lucide-react";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";
import {
  FlowerProduct,
  INITIAL_FLOWERS,
  CartItem,
  getActiveFlowersCatalog,
  getStoredCart,
  saveStoredCart,
} from "@/features/catalog/types";

export default function AllProductsPage() {
  const [flowers, setFlowers] = useState<FlowerProduct[]>(INITIAL_FLOWERS);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Flower Detail Modal State
  const [activeFlowerModal, setActiveFlowerModal] =
    useState<FlowerProduct | null>(null);
  const [modalWeightIdx, setModalWeightIdx] = useState<number>(0);
  const [modalQty, setModalQty] = useState<number>(1);

  // Cart Drawer State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    setFlowers(getActiveFlowersCatalog());
    setCart(getStoredCart());
  }, []);

  const filteredFlowers = flowers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.deityAffinity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openFlowerDetail = (flower: FlowerProduct) => {
    setActiveFlowerModal(flower);
    setModalWeightIdx(0);
    setModalQty(1);
  };

  const handleAddToCartFromModal = (flower: FlowerProduct) => {
    const weightObj =
      flower.availableWeights[modalWeightIdx] || flower.availableWeights[0];

    const updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex(
      (item) =>
        item.flowerId === flower.id && item.weightLabel === weightObj.label
    );

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += modalQty;
    } else {
      updatedCart.push({
        id: `${flower.id}-${weightObj.grams}`,
        flowerId: flower.id,
        flowerName: flower.name,
        imageUrl: flower.imageUrl,
        weightLabel: weightObj.label,
        unitPrice: weightObj.price,
        quantity: modalQty,
      });
    }

    setCart(updatedCart);
    saveStoredCart(updatedCart);
    setActiveFlowerModal(null);
    setIsCartOpen(true);
    setToast(`Added ${modalQty}x ${flower.name} (${weightObj.label}) to Cart`);
    setTimeout(() => setToast(""), 3500);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updated);
    saveStoredCart(updated);
  };

  const totalCartItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartAmount = cart.reduce(
    (acc, i) => acc + i.unitPrice * i.quantity,
    0
  );

  return (
    <FeatureBoundary featureName="ALL_PRODUCTS">
      <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
        {/* Floating Cart Trigger */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border-2 border-[#D97706] bg-[#071C15] px-5 py-3.5 text-white shadow-2xl transition hover:scale-105 cursor-pointer"
        >
          <ShoppingBag className="h-5 w-5 text-[#F05A36]" />
          <div className="text-left">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Flower Cart ({totalCartItems})
            </span>
            <span className="text-xs font-bold">₹{totalCartAmount}</span>
          </div>
        </button>

        <div className="mx-auto max-w-7xl space-y-10">
          {/* Top Navigation & Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-orange-200/70 pb-8">
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#E8502B]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Homepage</span>
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#071C15] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-300 ml-3">
                <Sparkles className="h-3 w-3 text-[#F05A36]" />
                <span>Complete Farm Catalog</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
                All Sacred Puja Flowers
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-stone-600">
                Browse all registered fresh flowers plucked at 1:30 AM. Click on
                any flower card to choose weight packs, add multiple items to
                your cart, or buy directly.
              </p>
            </div>

            {/* Search & Cart Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search Marigold, Hibiscus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 rounded-2xl border border-stone-300 bg-white pl-10 pr-4 py-3 text-xs font-medium text-stone-900 focus:border-[#E8502B] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-[#071C15] px-5 py-3 text-xs font-bold text-amber-200 shadow-sm hover:bg-[#0D3528] cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 text-[#F05A36]" />
                <span>
                  Cart ({totalCartItems}) • ₹{totalCartAmount}
                </span>
              </button>
            </div>
          </div>

          {toast && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-sm font-bold text-emerald-950 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{toast}</span>
            </div>
          )}

          {/* All Registered Flowers Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFlowers.map((flower) => {
              const startingWeight = flower.availableWeights[0];
              return (
                <div
                  key={flower.id}
                  onClick={() => openFlowerDetail(flower)}
                  className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-stone-200/90 bg-white shadow-lg shadow-stone-900/5 transition hover:-translate-y-1 hover:border-[#D97706] hover:shadow-xl cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                      <img
                        src={flower.imageUrl}
                        alt={flower.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071C15]/80 via-transparent to-transparent" />

                      <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-emerald-950 shadow-sm backdrop-blur-md">
                        <Leaf className="h-3 w-3 text-emerald-600" />
                        <span>{flower.inStock ? "In Stock" : "Out of Stock"}</span>
                      </span>

                      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                        <span className="text-xs font-medium text-emerald-100">
                          {startingWeight.label}
                        </span>
                        <span className="rounded-lg bg-[#E8502B] px-3 py-1 text-xs font-bold shadow-sm">
                          From ₹{startingWeight.price}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-[#E8502B] transition">
                        {flower.name}
                      </h2>
                      <p className="mt-1 text-xs text-stone-500">
                        {flower.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-[#FAF7F2] py-3 text-xs font-bold text-stone-800 group-hover:border-[#E8502B] group-hover:bg-[#E8502B] group-hover:text-white transition">
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Details & Select Pack</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FLOWER DETAIL MODAL */}
        {activeFlowerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs">
            <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setActiveFlowerModal(null)}
                className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-md hover:bg-stone-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-stone-100">
                <img
                  src={activeFlowerModal.imageUrl}
                  alt={activeFlowerModal.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071C15]/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 rounded-full bg-[#071C15]/90 px-3 py-1 text-[11px] font-bold text-amber-300">
                  {activeFlowerModal.deityAffinity}
                </span>
              </div>

              <div className="mt-5">
                <h3 className="font-serif text-3xl font-bold text-stone-900">
                  {activeFlowerModal.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-[#E8502B]">
                  {activeFlowerModal.subtitle}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {activeFlowerModal.botanicalNote}
                </p>

                <div className="mt-5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                    1. Choose Pack Weight:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {activeFlowerModal.availableWeights.map((w, idx) => {
                      const active = modalWeightIdx === idx;
                      return (
                        <button
                          key={w.label}
                          type="button"
                          onClick={() => setModalWeightIdx(idx)}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-bold transition cursor-pointer ${
                            active
                              ? "border-[#E8502B] bg-orange-50/70 text-stone-900"
                              : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                          }`}
                        >
                          <span>{w.label}</span>
                          <span
                            className={
                              active ? "text-[#E8502B]" : "text-stone-900"
                            }
                          >
                            ₹{w.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {(() => {
                  const selectedWeight =
                    activeFlowerModal.availableWeights[modalWeightIdx] ||
                    activeFlowerModal.availableWeights[0];
                  const itemTotal = selectedWeight.price * modalQty;
                  const directBuyUrl = `/checkout?type=ONE_TIME&flower=${encodeURIComponent(
                    activeFlowerModal.name
                  )}&weight=${encodeURIComponent(
                    selectedWeight.label
                  )}&qty=${modalQty}&price=${itemTotal}`;

                  return (
                    <>
                      <div className="mt-5 flex items-center justify-between rounded-2xl border border-stone-200 bg-[#FAF7F2] px-4 py-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                            2. Select Quantity
                          </span>
                          <span className="font-serif text-xl font-bold text-stone-900">
                            Total: ₹{itemTotal}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setModalQty((q) => Math.max(1, q - 1))
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 cursor-pointer"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-stone-900">
                            {modalQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setModalQty((q) => q + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleAddToCartFromModal(activeFlowerModal)
                          }
                          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#071C15] bg-white py-3.5 text-xs font-bold text-[#071C15] hover:bg-stone-100 cursor-pointer"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>

                        <Link
                          href={directBuyUrl}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] to-[#D97706] py-3.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20"
                        >
                          <span>Buy Now • ₹{itemTotal}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* SLIDE-OVER CART DRAWER */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
            <div className="flex h-full w-full max-w-md flex-col justify-between bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-[#E8502B]" />
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    Your Flower Cart
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full bg-stone-100 p-2 text-stone-600 hover:bg-stone-200 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <p className="text-sm text-stone-500">
                      Your flower cart is empty.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 p-3.5"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.flowerName}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-serif text-base font-bold text-stone-900">
                          {item.flowerName}
                        </p>
                        <p className="text-xs text-stone-500">
                          {item.weightLabel} • ₹{item.unitPrice} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.id, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-300 text-stone-700 cursor-pointer"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="h-3 w-3 text-rose-600" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}
                        </button>
                        <span className="w-5 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.id, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-300 text-stone-700 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-stone-200 pt-4 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Total Payable
                    </span>
                    <span className="font-serif text-3xl font-bold text-stone-900">
                      ₹{totalCartAmount}
                    </span>
                  </div>
                  <Link
                    href={`/checkout?type=ONE_TIME&fromCart=true&flower=${encodeURIComponent(
                      cart
                        .map(
                          (i) =>
                            `${i.quantity}x ${i.flowerName} (${i.weightLabel})`
                        )
                        .join(", ")
                    )}&price=${totalCartAmount}`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] to-[#D97706] py-4 text-sm font-bold text-white shadow-lg"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </FeatureBoundary>
  );
}