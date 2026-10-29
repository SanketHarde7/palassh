"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flower2,
  Truck,
  Plus,
  Trash2,
  CheckCircle2,
  PauseCircle,
  Clock,
  MapPin,
  IndianRupee,
  PackageCheck,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";
import {
  FlowerProduct,
  INITIAL_FLOWERS,
  INITIAL_PLANS,
  SubscriptionPlan,
  CATALOG_STORAGE_KEY,
  getActiveFlowersCatalog,
} from "@/features/catalog/types";

interface DispatchRow {
  orderId: string;
  customerName: string;
  societyAndFlat: string;
  slot: string;
  orderType: "SUBSCRIPTION" | "ONE_TIME";
  todaysFlowers: string;
  deliveryNote: string;
  status: "DISPATCH_READY" | "PAUSED_TODAY";
}

const DEMO_DISPATCH_LIST: DispatchRow[] = [
  {
    orderId: "PLS-849201",
    customerName: "Snehal Deshmukh",
    societyAndFlat: "B-1204, Hiranandani Estate, Thane West - 400607",
    slot: "5:00 AM – 6:30 AM",
    orderType: "SUBSCRIPTION",
    todaysFlowers: "Mixed Sacred Box (Marigold, Chrysanthemum & Red Hibiscus)",
    deliveryNote: "Hang pouch on main door handle (Do not ring bell)",
    status: "DISPATCH_READY",
  },
  {
    orderId: "PLS-739104",
    customerName: "Mrs. Anjali Joshi",
    societyAndFlat: "A-902, Rustomjee Urbania, Majiwada, Thane - 400601",
    slot: "5:00 AM – 6:30 AM",
    orderType: "SUBSCRIPTION",
    todaysFlowers: "Only Red Hibiscus (Checked via Day-Wise Planner)",
    deliveryNote: "Place inside wooden basket outside door",
    status: "DISPATCH_READY",
  },
  {
    orderId: "PLS-619823",
    customerName: "Siddharth Nair",
    societyAndFlat: "C-404, Glenmark Residency, Kharegaon, Kalwa - 400605",
    slot: "6:30 AM – 8:00 AM",
    orderType: "SUBSCRIPTION",
    todaysFlowers: "Marigold + Chrysanthemum Mix",
    deliveryNote: "Paused before 8 PM (Out of station)",
    status: "PAUSED_TODAY",
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "DISPATCH" | "FLOWERS" | "PRICING"
  >("DISPATCH");
  const [flowers, setFlowers] = useState<FlowerProduct[]>(INITIAL_FLOWERS);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);
  const [dispatchRows, setDispatchRows] =
    useState<DispatchRow[]>(DEMO_DISPATCH_LIST);
  const [toast, setToast] = useState<string>("");

  // New Flower Form State (Strictly English Names)
  const [newFlowerName, setNewFlowerName] = useState("");
  const [newFlowerSubtitle, setNewFlowerSubtitle] = useState("");
  const [newFlowerImage, setNewFlowerImage] = useState("/images/merigold.jpeg");
  const [newFlowerDeity, setNewFlowerDeity] = useState(
    "All Daily Puja Rituals"
  );
  const [price100g, setPrice100g] = useState(40);
  const [price250g, setPrice250g] = useState(95);
  const [price500g, setPrice500g] = useState(180);

  useEffect(() => {
    setFlowers(getActiveFlowersCatalog());

    // Load saved plans if modified
    try {
      const savedPlans = localStorage.getItem("palassh_plans_v1");
      if (savedPlans) {
        setPlans(JSON.parse(savedPlans));
      }
    } catch {
      // Ignore error
    }

    // Sync live customer subscription + one-time orders into Today's Dispatch List
    try {
      const liveRows: DispatchRow[] = [];
      const savedSubRaw = localStorage.getItem("palassh_active_subscription");
      if (savedSubRaw) {
        const sub = JSON.parse(savedSubRaw);
        const firstDay = sub.schedule?.[0];
        const isPausedToday =
          sub.status === "PAUSED" ||
          sub.status === "CANCELLED" ||
          firstDay?.status === "PAUSED";

        liveRows.push({
          orderId: sub.orderId,
          customerName: sub.customerName,
          societyAndFlat: sub.address,
          slot: sub.deliverySlot || "5:00 AM – 6:30 AM",
          orderType: "SUBSCRIPTION",
          todaysFlowers:
            firstDay?.assignedFlower ||
            sub.defaultFlowers ||
            "Mixed Sacred Box",
          deliveryNote: sub.deliveryNote,
          status: isPausedToday ? "PAUSED_TODAY" : "DISPATCH_READY",
        });
      }

      const savedOneTimeRaw = localStorage.getItem("palassh_onetime_orders");
      if (savedOneTimeRaw) {
        const oneTimeList = JSON.parse(savedOneTimeRaw);
        if (Array.isArray(oneTimeList)) {
          oneTimeList.forEach((ord) => {
            liveRows.push({
              orderId: ord.orderId,
              customerName: "One-Time Customer",
              societyAndFlat: ord.address,
              slot: ord.deliverySlot || "5:00 AM – 8:00 AM",
              orderType: "ONE_TIME",
              todaysFlowers: ord.flowerSummary,
              deliveryNote: "Silent Doorstep Drop (One-Time Order)",
              status: "DISPATCH_READY",
            });
          });
        }
      }

      if (liveRows.length > 0) {
        setDispatchRows([...liveRows, ...DEMO_DISPATCH_LIST.slice(1)]);
      }
    } catch {
      // Ignore error
    }
  }, []);

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  // Add New Flower to Catalog
  const handleAddFlower = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlowerName.trim()) return;

    const slug = newFlowerName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const newFlower: FlowerProduct = {
      id: `flw-${Date.now()}`,
      slug,
      name: newFlowerName.trim(),
      subtitle:
        newFlowerSubtitle.trim() || "Fresh Farm-Plucked Sacred Puja Blooms",
      botanicalNote:
        "Plucked fresh at 1:30 AM and delivered in breathable eco-pouches between 5:00 AM – 8:00 AM.",
      imageUrl: newFlowerImage.trim() || "/images/merigold.jpeg",
      basePricePer100g: Number(price100g),
      unitType: "WEIGHT",
      availableWeights: [
        { label: "100g Morning Pouch", grams: 100, price: Number(price100g) },
        {
          label: "250g Family Puja Pack",
          grams: 250,
          price: Number(price250g),
        },
        {
          label: "500g Temple Assortment",
          grams: 500,
          price: Number(price500g),
        },
      ],
      inStock: true,
      deityAffinity: newFlowerDeity.trim() || "All Daily Puja Rituals",
    };

    const updated = [...flowers, newFlower];
    setFlowers(updated);
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));

    setNewFlowerName("");
    setNewFlowerSubtitle("");
    showNotice(
      `Added "${newFlower.name}" to Live Catalog! It is now visible on /products and in Customer Checkboxes.`
    );
  };

  // Toggle In-Stock Status of a Flower
  const handleToggleFlowerStock = (id: string) => {
    const updated = flowers.map((f) =>
      f.id === id ? { ...f, inStock: !f.inStock } : f
    );
    setFlowers(updated);
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
    showNotice("Updated flower availability status.");
  };

  // Remove a Flower
  const handleRemoveFlower = (id: string, name: string) => {
    if (flowers.length <= 1) {
      alert("At least 1 flower must remain in the catalog.");
      return;
    }
    const updated = flowers.filter((f) => f.id !== id);
    setFlowers(updated);
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
    showNotice(`Removed "${name}" from the flower catalog.`);
  };

  // Reset Catalog to Default 3 English Flowers
  const handleResetCatalog = () => {
    setFlowers(INITIAL_FLOWERS);
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(INITIAL_FLOWERS));
    showNotice(
      "Reset catalog to default Marigold, Chrysanthemum & Red Hibiscus."
    );
  };

  // Update Plan Price
  const handleUpdatePlanPrice = (planId: string, newPrice: number) => {
    const updated = plans.map((p) => {
      if (p.id !== planId) return p;
      const perDay = Math.round(newPrice / p.deliveriesCount);
      return {
        ...p,
        price: newPrice,
        perDayEffectivePrice: perDay,
      };
    });
    setPlans(updated);
    localStorage.setItem("palassh_plans_v1", JSON.stringify(updated));
    showNotice("Updated subscription plan pricing.");
  };

  const activeDeliveriesCount = dispatchRows.filter(
    (r) => r.status === "DISPATCH_READY"
  ).length;
  const pausedDeliveriesCount = dispatchRows.filter(
    (r) => r.status === "PAUSED_TODAY"
  ).length;

  return (
    <FeatureBoundary featureName="ADMIN_DASHBOARD">
      <div className="min-h-screen bg-[#FAF7F2] pb-20">
        {/* Top Admin Header Bar */}
        <header className="bg-[#071C15] border-b border-emerald-900 px-4 py-6 sm:px-6 lg:px-8 text-white">
          <div className="mx-auto max-w-7xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950 border border-amber-400/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                <Sparkles className="h-3 w-3 text-[#F05A36]" />
                <span>PALASSH Operations Command Center</span>
              </div>
              <h1 className="mt-1.5 font-serif text-3xl font-bold text-white">
                Morning Dispatch & Catalog Admin
              </h1>
              <p className="text-xs text-emerald-200/80">
                Hub: 6X4X+HJ5 Glenmark residency, 60 Feet Rd, Kharegaon, Kalwa,
                Thane - 400605
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-700 bg-emerald-950/80 px-4 py-2.5 text-xs font-bold text-emerald-100 hover:bg-emerald-900"
              >
                <span>View All Products Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E8502B] to-[#D97706] px-4 py-2.5 text-xs font-bold text-white shadow-md"
              >
                <span>Open Live Storefront</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* Quick KPI Strip */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                5–8 AM Ready for Dispatch
              </span>
              <p className="mt-1 font-serif text-3xl font-bold text-emerald-800">
                {activeDeliveriesCount} Pouches
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Paused Today (Before 8 PM)
              </span>
              <p className="mt-1 font-serif text-3xl font-bold text-amber-600">
                {pausedDeliveriesCount} Skipped
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Registered Flowers
              </span>
              <p className="mt-1 font-serif text-3xl font-bold text-stone-900">
                {flowers.length} Varieties
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Morning Cut-off Status
              </span>
              <p className="mt-1 font-serif text-xl font-bold text-[#E8502B]">
                8:00 PM Lock Active
              </p>
            </div>
          </div>

          {toast && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-sm font-bold text-emerald-950 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{toast}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab("DISPATCH")}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition cursor-pointer ${
                activeTab === "DISPATCH"
                  ? "bg-[#071C15] text-amber-300 shadow-sm"
                  : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              <Truck className="h-4 w-4 text-[#F05A36]" />
              <span>1. Morning 5–8 AM Dispatch List</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("FLOWERS")}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition cursor-pointer ${
                activeTab === "FLOWERS"
                  ? "bg-[#071C15] text-amber-300 shadow-sm"
                  : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              <Flower2 className="h-4 w-4 text-[#F05A36]" />
              <span>2. Add / Remove Flowers ({flowers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("PRICING")}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition cursor-pointer ${
                activeTab === "PRICING"
                  ? "bg-[#071C15] text-amber-300 shadow-sm"
                  : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              <IndianRupee className="h-4 w-4 text-[#F05A36]" />
              <span>3. Edit Subscription Plan Prices</span>
            </button>
          </div>

          {/* TAB 1: MORNING DISPATCH SHEET */}
          {activeTab === "DISPATCH" && (
            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-stone-900">
                    Today&apos;s 5:00 AM – 8:00 AM Flower Packing & Dispatch Sheet
                  </h2>
                  <p className="text-xs text-stone-500">
                    Shows live customer day-wise flower checkbox selections
                    (Mixed vs Separate) and paused flats.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-900">
                  <PackageCheck className="h-4 w-4 text-emerald-600" />
                  <span>Synced with Customer My-Orders</span>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      <th className="py-3 px-4">Order & Type</th>
                      <th className="py-3 px-4">Customer & Society Flat</th>
                      <th className="py-3 px-4">Morning Slot</th>
                      <th className="py-3 px-4">
                        Today&apos;s Flowers to Pack
                      </th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {dispatchRows.map((row) => (
                      <tr
                        key={row.orderId}
                        className={
                          row.status === "PAUSED_TODAY"
                            ? "bg-stone-50/80 opacity-65"
                            : "hover:bg-orange-50/20"
                        }
                      >
                        <td className="py-4 px-4 font-bold text-stone-900">
                          <div>#{row.orderId}</div>
                          <span
                            className={`mt-1 inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                              row.orderType === "ONE_TIME"
                                ? "bg-orange-100 text-[#E8502B]"
                                : "bg-emerald-100 text-emerald-900"
                            }`}
                          >
                            {row.orderType}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-stone-900">
                            {row.customerName}
                          </p>
                          <p className="text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-[#E8502B] shrink-0" />
                            <span>{row.societyAndFlat}</span>
                          </p>
                          <p className="text-[11px] text-stone-400 italic mt-0.5">
                            Note: {row.deliveryNote}
                          </p>
                        </td>
                        <td className="py-4 px-4 font-semibold text-stone-700">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-emerald-700" />
                            {row.slot}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block rounded-xl border border-orange-200 bg-[#FAF7F2] px-3 py-1.5 font-bold text-stone-900">
                            {row.todaysFlowers}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {row.status === "DISPATCH_READY" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-900">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                              Pack & Deliver
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-900">
                              <PauseCircle className="h-3.5 w-3.5 text-amber-700" />
                              Paused Today
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ADD / REMOVE FLOWERS MANAGER */}
          {activeTab === "FLOWERS" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Column: Register New Flower Form (5 Cols) */}
              <form
                onSubmit={handleAddFlower}
                className="lg:col-span-5 rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-lg space-y-4 h-fit"
              >
                <div className="border-b border-stone-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8502B]">
                    Catalog Expansion
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    Register New Flower
                  </h3>
                  <p className="text-xs text-stone-500">
                    Use English names only. Added flowers appear in All Products
                    and Customer Day-Wise Checkboxes.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Flower Name (English Only) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jasmine Buds or White Lotus"
                    value={newFlowerName}
                    onChange={(e) => setNewFlowerName(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Short Subtitle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fragrant Morning Temple Blooms"
                    value={newFlowerSubtitle}
                    onChange={(e) => setNewFlowerSubtitle(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Image Path (in /public/images/)
                  </label>
                  <input
                    type="text"
                    value={newFlowerImage}
                    onChange={(e) => setNewFlowerImage(e.target.value)}
                    placeholder="/images/merigold.jpeg"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Puja / Deity Affinity
                  </label>
                  <input
                    type="text"
                    value={newFlowerDeity}
                    onChange={(e) => setNewFlowerDeity(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                      100g Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={price100g}
                      onChange={(e) => setPrice100g(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                      250g Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={price250g}
                      onChange={(e) => setPrice250g(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                      500g Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={price500g}
                      onChange={(e) => setPrice500g(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold text-stone-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] to-[#D97706] py-3.5 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Flower to Storefront</span>
                </button>
              </form>

              {/* Right Column: Registered Flowers List (7 Cols) */}
              <div className="lg:col-span-7 rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-lg space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Registered Flowers ({flowers.length})
                    </h3>
                    <p className="text-xs text-stone-500">
                      First 3 flowers appear on the Homepage; all flowers appear
                      on /products.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetCatalog}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset Default 3</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {flowers.map((flw) => (
                    <div
                      key={flw.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={flw.imageUrl}
                          alt={flw.name}
                          className="h-16 w-16 rounded-2xl object-cover border border-stone-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-lg font-bold text-stone-900">
                              {flw.name}
                            </h4>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                flw.inStock
                                  ? "bg-emerald-100 text-emerald-900"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {flw.inStock ? "In Stock" : "Paused"}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500">
                            {flw.subtitle}
                          </p>
                          <p className="text-xs font-bold text-[#E8502B] mt-0.5">
                            {flw.availableWeights
                              .map((w) => `${w.grams}g: ₹${w.price}`)
                              .join(" • ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleFlowerStock(flw.id)}
                          className="rounded-xl border border-stone-300 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
                        >
                          {flw.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFlower(flw.id, flw.name)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBSCRIPTION PLAN PRICING EDITOR */}
          {activeTab === "PRICING" && (
            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-lg space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Subscription Tier Pricing Manager
                </h2>
                <p className="text-xs text-stone-500">
                  Update prepaid prices for Daily, Weekly, and Monthly plans.
                  Effective per-morning rate calculates automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-2xl border border-stone-200 bg-[#FAF7F2] p-6 space-y-4"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8502B]">
                      {plan.deliveriesCount} Morning Deliveries
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      {plan.title}
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1.5">
                        Plan Price (₹ / {plan.billingCycle})
                      </label>
                      <input
                        type="number"
                        value={plan.price}
                        onChange={(e) =>
                          handleUpdatePlanPrice(plan.id, Number(e.target.value))
                        }
                        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 font-serif text-2xl font-bold text-stone-900 focus:border-[#E8502B] focus:outline-none"
                      />
                    </div>

                    <p className="text-xs font-semibold text-emerald-900">
                      Effective Rate: ₹{plan.perDayEffectivePrice} / morning
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </FeatureBoundary>
  );
} 