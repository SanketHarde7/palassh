"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  CalendarCheck,
  PauseCircle,
  Star,
  ChevronDown,
  ArrowRight,
  Leaf,
  ShieldCheck,
  PhoneCall,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  SlidersHorizontal,
  MapPin,
  Navigation,
  X,
  Trash2,
  MessageSquarePlus,
  Eye,
} from "lucide-react";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";
import { PincodeBox } from "@/features/pincode-checker/components/PincodeBox";
import { PlanCards } from "@/features/catalog/components/PlanCards";
import {
  FlowerProduct,
  INITIAL_FLOWERS,
  CartItem,
  getActiveFlowersCatalog,
  getStoredCart,
  saveStoredCart,
} from "@/features/catalog/types";

const FAQS = [
  {
    tag: "One-Time & Subscriptions",
    q: "Can I order individual flowers like Marigold or Red Hibiscus without a subscription?",
    a: "Yes! Click on any flower card in our 'Fresh Puja Flowers' section to pick your weight pack (100g, 250g, 500g), add multiple blooms to your cart, or buy directly for tomorrow morning's 5:00 AM – 8:00 AM delivery.",
  },
  {
    tag: "Checkbox Flower Customization",
    q: "Can I tick which flowers I want on specific days of the week?",
    a: "Absolutely. Both while subscribing and inside your My-Orders Day-Wise Schedule, you get simple checkboxes to tick 'Predefined Mixed Pack' or tick individual flowers (Marigold, Chrysanthemum, Red Hibiscus) for each day before 8:00 PM.",
  },
  {
    tag: "Silent Delivery",
    q: "How do you deliver between 5:00 AM – 8:00 AM without waking us up?",
    a: "Our riders follow a strict Silent Drop Protocol. We never ring your doorbell or call in the morning. Your breathable eco-pouch is gently hung on your door handle or placed inside your doorstep basket.",
  },
  {
    tag: "Farm Freshness",
    q: "How are PALASSH flowers different from local market vendors?",
    a: "Roadside flowers are kept in ice boxes for 3–4 days. PALASSH blooms are plucked at 1:30 AM in Nashik & Dahanu farms and reach your home temple by 6:30 AM—zero cold storage, 100% natural fragrance.",
  },
];

interface CustomerReview {
  id: string;
  name: string;
  society: string;
  rating: number;
  quote: string;
}

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    name: "Mrs. Anjali Joshi",
    society: "Hiranandani Estate, Thane West",
    rating: 5,
    quote:
      "On Tuesdays I tick the 'Red Hibiscus' checkbox for Ganpati Bappa, and other days I tick 'Mixed Box'. Having this control on the website is a blessing!",
  },
  {
    id: "rev-2",
    name: "Siddharth & Pooja Nair",
    society: "Rustomjee Urbania, Majiwada",
    rating: 5,
    quote:
      "When we went to Lonavala for 3 days, we paused those exact 3 dates from our schedule list at 7 PM and didn't lose a single delivery.",
  },
  {
    id: "rev-3",
    name: "Kulkarni Family",
    society: "Neelam Nagar, Mulund East",
    rating: 5,
    quote:
      "We ordered 500g Marigold and 250g Chrysanthemum one-time packs for our housewarming puja. Plucked fresh from Nashik farms, zero cold storage!",
  },
];

const SHOP_ADDRESS =
  "6X4X+HJ5 Glenmark residency, 60 Feet Rd, Kharegaon, Kalwa, Thane, Maharashtra 400605";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [flowers, setFlowers] = useState<FlowerProduct[]>(INITIAL_FLOWERS);

  // Flower Detail Modal State (Opens only when clicking a flower card)
  const [activeFlowerModal, setActiveFlowerModal] =
    useState<FlowerProduct | null>(null);
  const [modalWeightIdx, setModalWeightIdx] = useState<number>(0);
  const [modalQty, setModalQty] = useState<number>(1);

  // Cart & Slide-Over Drawer State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartToast, setCartToast] = useState<string>("");

  // Customer Reviews State
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewerName, setReviewerName] = useState<string>("");
  const [reviewerSociety, setReviewerSociety] = useState<string>("");
  const [reviewerRating, setReviewerRating] = useState<number>(5);
  const [reviewerQuote, setReviewerQuote] = useState<string>("");

  useEffect(() => {
    setFlowers(getActiveFlowersCatalog());
    setCart(getStoredCart());

    try {
      const savedRevs = localStorage.getItem("palassh_customer_reviews_v1");
      if (savedRevs) {
        const parsed = JSON.parse(savedRevs);
        if (Array.isArray(parsed) && parsed.length > 0) setReviews(parsed);
      }
    } catch {
      // Ignore error
    }
  }, []);

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
    setCartToast(`Added ${modalQty}x ${flower.name} (${weightObj.label}) to Cart`);
    setTimeout(() => setCartToast(""), 3500);
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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerQuote.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: reviewerName.trim(),
      society: reviewerSociety.trim() || "Thane / Mumbai Resident",
      rating: reviewerRating,
      quote: reviewerQuote.trim(),
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(
        "palassh_customer_reviews_v1",
        JSON.stringify(updated)
      );
    } catch {
      // Ignore error
    }

    setReviewerName("");
    setReviewerSociety("");
    setReviewerQuote("");
    setReviewerRating(5);
    setShowReviewForm(false);
  };

  const totalCartItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartAmount = cart.reduce(
    (acc, i) => acc + i.unitPrice * i.quantity,
    0
  );

  // Only show first 3 flowers on the homepage
  const homepageFlowers = flowers.slice(0, 3);

  return (
    <div className="overflow-hidden bg-[#FAF7F2]">
      {/* FLOATING CART TRIGGER BUTTON (Top-Right Dock) */}
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

      {/* 1. LUXURY HERO SECTION */}
      <FeatureBoundary featureName="HERO">
        <section className="relative pt-10 pb-24 lg:pt-16 lg:pb-28 overflow-hidden">
          <div className="pointer-events-none absolute -top-24 left-10 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-orange-300/25 via-amber-200/15 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 right-10 h-[380px] w-[380px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-200/10 to-transparent blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#071C15] px-4 py-1.5 text-xs font-semibold text-amber-200 shadow-sm">
                  <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Farm-to-Mandir • Thane & Mumbai Societies</span>
                </div>

                <h1 className="font-serif text-5xl sm:text-6xl lg:text-[64px] font-bold leading-[1.06] tracking-tight text-stone-900">
                  Sacred Puja Blooms,{" "}
                  <span className="block mt-1 text-[#E8502B] italic font-normal">
                    Your Way Every Morning.
                  </span>
                </h1>

                <p className="max-w-lg text-base sm:text-lg text-stone-600 leading-relaxed">
                  Order fresh{" "}
                  <strong className="text-stone-900">
                    Marigold, Chrysanthemum & Red Hibiscus
                  </strong>{" "}
                  whenever you need, or subscribe to a daily plan where you tick
                  which flowers arrive on which day.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="#fresh-flowers"
                    className="inline-flex items-center gap-3 rounded-full bg-[#071C15] px-7 py-4 text-sm sm:text-base font-bold text-amber-100 shadow-xl transition hover:bg-[#0D3528]"
                  >
                    <ShoppingBag className="h-4 w-4 text-[#F05A36]" />
                    <span>Shop Fresh Flowers</span>
                  </Link>
                  <Link
                    href="#plans"
                    className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#E8502B] via-[#F05A36] to-[#D97706] px-7 py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-orange-500/25 transition hover:scale-[1.02]"
                  >
                    <span>Explore Subscriptions</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-orange-200/60 text-xs font-semibold text-stone-700">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#E8502B]" />
                    <span>One-Time OR Subscription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    <span>Mixed OR Separate Flowers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>Day-Wise Checkbox Control</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative mx-auto max-w-lg">
                  <div className="absolute -inset-3 rounded-t-[11rem] rounded-b-[3rem] bg-gradient-to-br from-[#E8502B]/20 via-amber-200/20 to-emerald-600/20 blur-xl" />

                  <div className="absolute -top-4 right-4 z-20 flex items-center gap-2.5 rounded-2xl border border-[#D97706]/30 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-950 text-amber-300">
                      <SlidersHorizontal className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#E8502B]">
                        100% Customizable Ritual
                      </p>
                      <p className="text-xs font-bold text-stone-900">
                        Marigold • Chrysanthemum • Red Hibiscus
                      </p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-t-[10rem] rounded-b-[2.5rem] border-[6px] border-white bg-stone-100 shadow-2xl aspect-4/4">
                    <img
                      src="/images/hero-banner.jpg"
                      alt="PALASSH Morning Puja Basket"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071C15]/90 via-transparent to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-amber-300/30 bg-[#071C15]/85 px-5 py-3.5 text-white backdrop-blur-md">
                      <div>
                        <p className="font-serif text-base font-bold text-amber-200">
                          “Flowers that pray with you”
                        </p>
                        <p className="text-[11px] text-emerald-100">
                          Silent Doorstep Delivery • 5:00 AM to 8:00 AM
                        </p>
                      </div>
                      <span className="rounded-full bg-gradient-to-r from-[#E8502B] to-[#D97706] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
                        From ₹35
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FeatureBoundary>

      {/* 2. PINCODE CONCIERGE DOCK */}
      <FeatureBoundary featureName="PINCODE">
        <PincodeBox />
      </FeatureBoundary>

      {/* 3. MINIMAL 3-CARD FLOWER SHOWCASE (CLICK TO OPEN DETAIL MODAL) */}
      <FeatureBoundary featureName="DIRECT_FLOWER_STORE">
        <section
          id="fresh-flowers"
          className="py-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl border-b border-orange-200/60"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/90 border border-orange-200 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8502B]">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>A-La-Carte Fresh Blooms</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
                Shop Sacred Puja Flowers
              </h2>
              <p className="text-sm sm:text-base text-stone-600">
                Click on any flower card below to view weight packs, select
                quantities, add multiple flowers to your cart, or buy directly.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-3 rounded-2xl border border-emerald-800/20 bg-[#071C15] px-5 py-3.5 text-xs font-bold text-amber-200 shadow-sm hover:bg-[#0D3528] cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-[#F05A36]" />
              <span>
                View Cart ({totalCartItems} items • ₹{totalCartAmount})
              </span>
            </button>
          </div>

          {cartToast && (
            <div className="mt-6 flex items-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-sm font-bold text-emerald-950 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{cartToast}</span>
            </div>
          )}

          {/* Strictly 3 Minimal Flower Cards on Homepage */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {homepageFlowers.map((flower) => {
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

                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1 text-[11px] font-bold text-emerald-950 shadow-sm backdrop-blur-md">
                        Fresh Farm Harvest
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
                      <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-[#E8502B] transition">
                        {flower.name}
                      </h3>
                      <p className="mt-1 text-xs text-stone-500">
                        {flower.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-[#FAF7F2] py-3 text-xs font-bold text-stone-800 group-hover:border-[#E8502B] group-hover:bg-[#E8502B] group-hover:text-white transition">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Select Pack & Buy / Add to Cart</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VIEW ALL PRODUCTS BUTTON */}
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 rounded-full border-2 border-[#071C15] bg-white px-8 py-4 text-sm font-bold text-[#071C15] shadow-md transition hover:bg-[#071C15] hover:text-amber-200"
            >
              <span>View All Registered Flowers & Packs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </FeatureBoundary>

      {/* 4. CUSTOMIZABLE SUBSCRIPTION PLANS */}
      <FeatureBoundary featureName="CATALOG">
        <PlanCards />
      </FeatureBoundary>

      {/* 5. 3-STEP RITUAL STRIP */}
      <section
        id="how-it-works"
        className="relative border-y border-orange-200/60 bg-gradient-to-b from-white via-[#FFFDFB] to-[#F4FBF7] py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800">
              <Sparkles className="h-3 w-3 text-[#E8502B]" /> Complete
              Flexibility
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
              How Your PALASSH Ritual Works
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: CalendarCheck,
                accent: "from-[#E8502B] to-[#F59E0B]",
                title: "Buy Direct OR Subscribe",
                desc: "Order individual packs of Marigold, Chrysanthemum, or Red Hibiscus anytime, or choose a Daily, Weekly, or Monthly plan.",
              },
              {
                step: "02",
                icon: SlidersHorizontal,
                accent: "from-[#059669] to-[#0D9488]",
                title: "Tick Flowers via Checkboxes",
                desc: "Tick 'Mixed Box' or tick individual flower checkboxes. You can even tick different flowers for each day in My-Orders.",
              },
              {
                step: "03",
                icon: PauseCircle,
                accent: "from-[#D97706] to-[#E8502B]",
                title: "5–8 AM Drop & 1-Click Pause",
                desc: "Delivered silently without ringing the bell. Traveling out of station? Pause individual dates before 8:00 PM.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-8 shadow-md shadow-stone-900/5 transition hover:-translate-y-1 hover:border-emerald-300/80 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-md`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="font-serif text-4xl font-bold text-stone-200 group-hover:text-emerald-700/30 transition">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-2xl font-bold text-stone-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DEVOTEE REVIEWS + ADD REVIEW FORM + FAQ + GOOGLE MAPS LOCATION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl space-y-24">
        {/* Reviews Section with Add Review Button */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
                80+ Societies Across Thane & Mumbai
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Morning Blessings, Shared by Families
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="inline-flex items-center gap-2 rounded-full bg-[#071C15] px-5 py-3 text-xs font-bold text-amber-200 shadow-sm hover:bg-[#0D3528] cursor-pointer"
            >
              <MessageSquarePlus className="h-4 w-4 text-[#F05A36]" />
              <span>{showReviewForm ? "Close Form" : "+ Write a Review"}</span>
            </button>
          </div>

          {/* Interactive Add Review Form */}
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="mt-8 rounded-3xl border border-orange-200 bg-white p-6 sm:p-8 shadow-lg space-y-4"
            >
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Share Your PALASSH Morning Experience
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Kulkarni"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Society & Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Glenmark Residency, Kalwa"
                    value={reviewerSociety}
                    onChange={(e) => setReviewerSociety(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Rating
                  </label>
                  <select
                    value={reviewerRating}
                    onChange={(e) => setReviewerRating(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-bold text-stone-900 focus:border-[#E8502B] focus:outline-none"
                  >
                    <option value={5}>★★★★★ (5/5 Sacred Quality)</option>
                    <option value={4}>★★★★☆ (4/5 Great Service)</option>
                    <option value={3}>★★★☆☆ (3/5 Good)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Your Review *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell other families about flower freshness, morning silent delivery, or custom checkboxes..."
                  value={reviewerQuote}
                  onChange={(e) => setReviewerQuote(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#E8502B] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#E8502B] to-[#D97706] px-6 py-3 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Publish Review
              </button>
            </form>
          )}

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col justify-between rounded-3xl border border-orange-100 bg-white p-7 shadow-xs hover:border-emerald-200 transition"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-stone-700">
                    “{rev.quote}”
                  </p>
                </div>
                <div className="mt-6 border-t border-stone-100 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-serif text-base font-bold text-stone-900">
                      {rev.name}
                    </p>
                    <p className="text-xs text-emerald-800 font-medium">
                      {rev.society}
                    </p>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PALASSH HUB ADDRESS & GOOGLE MAPS DIRECTION BOX */}
        <div className="overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white shadow-xl shadow-stone-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#071C15] p-8 sm:p-10 text-white">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-900/80 border border-amber-400/30 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-300">
                  <MapPin className="h-3.5 w-3.5 text-[#F05A36]" />
                  <span>Visit Our Thane Hub & Store</span>
                </span>
                <h2 className="font-serif text-3xl font-bold text-white leading-tight">
                  PALASSH Sacred Flower Hub
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                  All morning pouches are sorted, misted with pure water, and
                  dispatched fresh from our Kharegaon, Kalwa hub. You can also
                  visit us directly for bulk wedding or festival flower orders.
                </p>

                <div className="rounded-2xl border border-emerald-800 bg-emerald-950/80 p-4 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Registered Store Address:
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-white leading-relaxed">
                    {SHOP_ADDRESS}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-emerald-800/80 flex flex-wrap items-center gap-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    SHOP_ADDRESS
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] to-[#D97706] px-6 py-3.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 min-h-[340px] bg-stone-100">
              <iframe
                title="PALASSH Store Location - Kalwa Thane"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  SHOP_ADDRESS
                )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                className="h-full w-full min-h-[340px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* LUXURY 2-COLUMN FAQ SECTION */}
        <div className="rounded-[2.5rem] border border-emerald-900/10 bg-gradient-to-br from-white via-[#FFFDFB] to-emerald-50/40 p-8 sm:p-12 lg:p-16 shadow-xl shadow-stone-900/5">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100/80 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#E8502B]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Frequently Asked Questions</span>
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                  Everything About Your Morning Flower Ritual.
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Have a specific question about one-time flower orders,
                  day-wise flower checkboxes, or morning timings? Here is how we
                  care for your daily puja.
                </p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-[#064E3B] to-[#0D281D] p-6 text-white shadow-lg">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                  Thane & Mumbai Morning Desk
                </p>
                <h3 className="mt-1 font-serif text-xl font-bold">
                  Need Bulk Toran or Event Flowers?
                </h3>
                <p className="mt-1 text-xs text-emerald-100/80 leading-relaxed">
                  Our team is available on WhatsApp from 6:00 AM to 9:00 PM for
                  society onboarding & custom festival orders.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-amber-200 backdrop-blur-xs">
                  <PhoneCall className="h-4 w-4 text-emerald-300" />
                  <span>Manage Day-Wise Schedule in My-Orders</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {FAQS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={item.q}
                    className={`overflow-hidden rounded-2xl border transition-all ${
                      isOpen
                        ? "border-[#E8502B] bg-white shadow-md"
                        : "border-stone-200/80 bg-white/80 hover:border-orange-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="inline-block rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          {item.tag}
                        </span>
                        <p className="font-serif text-base sm:text-lg font-bold text-stone-900">
                          {item.q}
                        </p>
                      </div>
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                          isOpen
                            ? "bg-[#E8502B] text-white rotate-180"
                            : "bg-orange-50 text-[#E8502B]"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-orange-100/80 px-6 py-4 text-sm leading-relaxed text-stone-600 bg-[#FAF7F2]/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FLOWER DETAIL MODAL (OPENS WHEN USER CLICKS ANY FLOWER CARD) */}
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

              {/* Weight Pack Selector */}
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

              {/* Quantity Counter */}
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

                    {/* Modal Actions: Add to Cart OR Direct Buy Now */}
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

      {/* SLIDE-OVER CART DRAWER (FOR MULTIPLE FLOWERS CHECKOUT) */}
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
                    Your flower basket is currently empty.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="rounded-full bg-orange-50 px-5 py-2.5 text-xs font-bold text-[#E8502B]"
                  >
                    Browse Fresh Flowers
                  </button>
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
                    Total Amount
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
  );
}