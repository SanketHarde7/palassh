"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  CalendarCheck,
  PauseCircle,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Leaf,
  ShieldCheck,
  PhoneCall,
  ShoppingBag,
  CheckCircle2,
  SlidersHorizontal,
  MapPin,
  X,
  Eye,
  AlertCircle,
  Send,
  Flame,
} from "lucide-react";
import { FeatureBoundary } from "@/components/shared/FeatureBoundary";
import { PincodeBox } from "@/features/pincode-checker/components/PincodeBox";
import { PlanCards } from "@/features/catalog/components/PlanCards";
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

const SHOP_ADDRESS =
  "6X4X+HJ5 Glenmark Residency, 60 Feet Rd, Kharegaon, Kalwa, Thane, Maharashtra 400605";

const FAQS = [
  {
    tag: "Morning Delivery Slot",
    q: "What is your exact morning flower delivery timing across Thane?",
    a: "All PALASSH deliveries arrive in a single guaranteed morning window between 6:00 AM – 8:00 AM across Thane pincodes 400601 to 400608, right in time for your morning home mandir aarti.",
  },
  {
    tag: "Direct Buying & Weight Limits",
    q: "How much flower weight can I order directly without a subscription?",
    a: "On normal days, direct a-la-carte customers can order up to a combined maximum of 500g across all flowers. Simply select your preferred gram pack (100g, 250g, or 500g) from the weight selector.",
  },
  {
    tag: "Festive Day Rules & Quotas",
    q: "Why is direct flower buying locked for normal users on Festive Days?",
    a: "During high-demand festivals (Ganeshotsav, Diwali, Dasara, Sankashti, Gudi Padwa), our farm harvest is prioritized for our active subscribers. Weekly subscribers can book up to 2 KG (2,000g) combined, and Monthly subscribers can book up to 3 KG (3,000g) combined.",
  },
  {
    tag: "Checkbox Flower Customization",
    q: "Can I choose between Mixed Flowers or specific flowers like only Red Hibiscus?",
    a: "Yes! Both when subscribing and inside your My-Orders Day-Wise Planner, you can tick the 'Predefined Mixed Sacred Box' checkbox or tick individual flowers—Marigold (झेंडू), Chrysanthemum (शेवंती), or Red Hibiscus (लाल जास्वंद)—for specific days.",
  },
  {
    tag: "Silent Doorbell-Free Drop",
    q: "How do riders deliver between 6:00 AM – 8:00 AM without disturbing our sleep?",
    a: "We follow a strict Silent Devotion Protocol. Our riders never ring your doorbell or call you in the morning. Your breathable eco-pouch is gently hung on your main door handle or placed inside your doorstep basket.",
  },
  {
    tag: "1-Click Pause Before 8 PM",
    q: "What happens if my family is traveling out of Thane for a few days?",
    a: "You never lose a single rupee. Simply open the My-Orders page before 8:00 PM any evening and pause the dates you are away. Every paused delivery automatically carries forward to extend your subscription.",
  },
  {
    tag: "Zero Cold Storage Promise",
    q: "How are PALASSH blooms fresher than local station market flowers?",
    a: "Market flowers are typically 3 to 4 days old and stored in ice boxes, causing them to wilt by noon. PALASSH flowers are harvested at 1:30 AM in Nashik and Dahanu farms, sorted at our Kalwa hub at 4:00 AM, and delivered fresh to your door between 6:00 AM – 8:00 AM.",
  },
];

interface CustomerReview {
  id: string;
  name: string;
  society: string;
  rating: number;
  quote: string;
  tag?: string;
}

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    name: "Mrs. Anjali Joshi",
    society: "Hiranandani Estate, Ghodbunder Rd (400607)",
    rating: 5,
    tag: "Monthly Subscriber",
    quote:
      "On Tuesdays I tick the 'Red Hibiscus' (लाल जास्वंद) checkbox for Ganpati Bappa, and other days I keep the Mixed Box. Having this control on the website is a true blessing!",
  },
  {
    id: "rev-2",
    name: "Siddharth & Pooja Nair",
    society: "Rustomjee Urbania, Thane West (400601)",
    rating: 5,
    tag: "Weekly Subscriber",
    quote:
      "When we went to Lonavala for 3 days, we paused those exact 3 dates from our My-Orders schedule at 7 PM and didn't lose a single morning pouch.",
  },
  {
    id: "rev-3",
    name: "Kulkarni Family",
    society: "Vartak Nagar, Pokhran Rd No. 1 (400606)",
    rating: 5,
    tag: "Monthly Subscriber",
    quote:
      "During Sankashti, non-subscribers couldn't find fresh flowers anywhere, but our Monthly plan gave us a 3 KG festive quota at farm prices. Zero cold storage!",
  },
  {
    id: "rev-4",
    name: "Dr. Mahesh Deshpande",
    society: "Panchpakhadi, Naupada (400602)",
    rating: 5,
    tag: "Monthly Subscriber",
    quote:
      "By 6:30 AM every single day, the breathable pouch is silently hung on our door handle. The Marigold (झेंडू) and Tulsi leaves look like they were just plucked from a garden.",
  },
  {
    id: "rev-5",
    name: "Sneha & Rohan Sawant",
    society: "Piramal Vaikunth, Balkum (400608)",
    rating: 5,
    tag: "One Day Trial -> Monthly",
    quote:
      "We first tried the ₹49 One Day Puja Pack just to test the quality. Within 2 days we upgraded to the ₹1,350 Monthly Sacred Assortment. Unbeatable freshness!",
  },
  {
    id: "rev-6",
    name: "Mrs. Vandana Patwardhan",
    society: "Kopri Colony, Thane East (400603)",
    rating: 5,
    tag: "Weekly Subscriber",
    quote:
      "The Chrysanthemum (शेवंती) blooms stay fresh on our home mandir from 7 AM aarti until night. Even my mother-in-law is amazed by the temple-grade quality.",
  },
  {
    id: "rev-7",
    name: "Abhijit Gokhale",
    society: "Raymond Ten X Habitat, Pokhran Rd (400606)",
    rating: 5,
    tag: "Direct & Weekly",
    quote:
      "No more rushing to the station flower market before office! The 6:00 AM – 8:00 AM window is super punctual and the eco-pouch keeps the buds dewy.",
  },
  {
    id: "rev-8",
    name: "Meenal & Pradeep Shinde",
    society: "Glenmark Residency, Kharegaon, Kalwa (400605)",
    rating: 5,
    tag: "Monthly Subscriber",
    quote:
      "Knowing that our flowers come straight from Nashik farms to the Kalwa hub every midnight gives us complete confidence in their purity for daily puja.",
  },
  {
    id: "rev-9",
    name: "Mrs. Sunita Ghanekar",
    society: "Dosti Vihar, Vartak Nagar (400606)",
    rating: 5,
    tag: "Weekly Subscriber",
    quote:
      "The ₹329 Weekly pack with a fresh hand-strung garland and 2 KG festive booking access is the most thoughtful service in Thane.",
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [flowers, setFlowers] = useState<FlowerProduct[]>(INITIAL_FLOWERS);
  const reviewsScrollRef = useRef<HTMLDivElement | null>(null);

  // Flower Detail Modal State
  const [activeFlowerModal, setActiveFlowerModal] =
    useState<FlowerProduct | null>(null);
  const [modalWeightIdx, setModalWeightIdx] = useState<number>(0);

  // Cart & Popup Toast State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [popupToast, setPopupToast] = useState<{
    visible: boolean;
    title: string;
    subtitle: string;
  }>({ visible: false, title: "", subtitle: "" });
  const [cartError, setCartError] = useState<string>("");

  // Customer Reviews State
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [reviewerName, setReviewerName] = useState<string>("");
  const [reviewerSociety, setReviewerSociety] = useState<string>("");
  const [reviewerRating, setReviewerRating] = useState<number>(5);
  const [reviewerQuote, setReviewerQuote] = useState<string>("");
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState<string>("");

  // Tier & Festive State
  const [customerTier, setCustomerTier] = useState<
    "NORMAL" | "ONE_DAY" | "WEEKLY" | "MONTHLY"
  >("NORMAL");
  const [festiveStatus, setFestiveStatus] = useState({
    isFestiveDay: false,
    festivalName: "Festive Puja",
  });

  useEffect(() => {
    const syncState = () => {
      setFlowers(getActiveFlowersCatalog());
      setCart(getStoredCart());
      setCustomerTier(getCurrentCustomerTier());
      setFestiveStatus(getFestiveModeStatus());
    };
    syncState();

    window.addEventListener("palassh-cart-updated", syncState);
    window.addEventListener("palassh-festive-updated", syncState);

    try {
      const savedRevs = localStorage.getItem("palassh_customer_reviews_v2");
      if (savedRevs) {
        const parsed = JSON.parse(savedRevs);
        if (Array.isArray(parsed) && parsed.length > 0) setReviews(parsed);
      }
    } catch {
      // Ignore error
    }

    return () => {
      window.removeEventListener("palassh-cart-updated", syncState);
      window.removeEventListener("palassh-festive-updated", syncState);
    };
  }, []);

  const scrollReviewsRow = (direction: "left" | "right") => {
    if (!reviewsScrollRef.current) return;
    const offset = direction === "left" ? -340 : 340;
    reviewsScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const openFlowerDetail = (flower: FlowerProduct) => {
    setActiveFlowerModal(flower);
    const existing = cart.find((c) => c.flowerId === flower.id);
    if (existing) {
      const idx = flower.availableWeights.findIndex(
        (w) => w.grams === existing.grams
      );
      setModalWeightIdx(idx >= 0 ? idx : 0);
    } else {
      setModalWeightIdx(0);
    }
    setCartError("");
  };

  const handleSelectWeightAndAddToCart = (flower: FlowerProduct) => {
    setCartError("");
    const weightObj =
      flower.availableWeights[modalWeightIdx] || flower.availableWeights[0];
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
      setCartError(validation.reason || "Weight limit exceeded.");
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
    setActiveFlowerModal(null);

    const newTotalGrams = otherFlowersGrams + selectedGrams;
    setPopupToast({
      visible: true,
      title: `${flower.name} (${flower.marathiName}) — ${selectedGrams}g Added!`,
      subtitle: `Total Basket Weight: ${newTotalGrams}g • Tap 'Cart' in Navbar to checkout.`,
    });
    setTimeout(() => {
      setPopupToast((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerQuote.trim()) return;
    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: reviewerName.trim(),
      society: reviewerSociety.trim() || "Thane Resident (400601–400608)",
      rating: reviewerRating,
      tag: "Verified Devotee",
      quote: reviewerQuote.trim(),
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(
        "palassh_customer_reviews_v2",
        JSON.stringify(updated)
      );
    } catch {
      // Ignore error
    }
    setReviewerName("");
    setReviewerSociety("");
    setReviewerQuote("");
    setReviewerRating(5);
    setReviewSubmittedMsg(
      "Thank you! Your review is now live on the horizontal swipe wall above."
    );
    setTimeout(() => setReviewSubmittedMsg(""), 5000);
  };

  const totalCartItems = cart.length;
  const totalCartAmount = cart.reduce((acc, i) => acc + i.unitPrice, 0);
  const totalCartGrams = cart.reduce((acc, i) => acc + (i.grams || 100), 0);

  const homepageFlowers = flowers.slice(0, 3);

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden bg-[#FAF7F2]">
      {/* NON-INTRUSIVE POPUP TOAST (Top-Right) */}
      {popupToast.visible && (
        <div className="fixed top-24 right-3 left-3 sm:left-auto sm:right-6 z-50 sm:max-w-sm rounded-2xl border-2 border-emerald-400/80 bg-[#071C15] p-4 text-white shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-800/80 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-serif text-sm font-bold text-amber-200">
                {popupToast.title}
              </p>
              <p className="mt-0.5 text-[11px] text-emerald-100/85">
                {popupToast.subtitle}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPopupToast((prev) => ({ ...prev, visible: false }));
                    window.dispatchEvent(new Event("palassh-open-cart"));
                  }}
                  className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 px-3 py-1.5 text-[11px] font-bold text-white cursor-pointer"
                >
                  Open Cart ({totalCartGrams}g)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPopupToast((prev) => ({ ...prev, visible: false }))
                  }
                  className="rounded-lg border border-white/20 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-200 hover:bg-white/10 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. MOBILE-OPTIMIZED LUXURY HERO SECTION */}
      <FeatureBoundary featureName="HERO">
        <section className="relative pt-6 pb-16 sm:pt-12 sm:pb-24 lg:pt-14 lg:pb-28 overflow-hidden">
          <div className="pointer-events-none absolute -top-24 left-0 h-72 w-72 sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br from-emerald-300/25 via-teal-200/15 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-72 w-72 sm:h-[380px] sm:w-[380px] rounded-full bg-gradient-to-tr from-orange-300/20 via-amber-200/15 to-transparent blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
                <ScrollReveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-stone-900 shadow-xs">
                    <Leaf className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Farm-to-Mandir • Thane (400601–400608)</span>
                  </div>
                </ScrollReveal>

                <ScrollReveal delayMs={70}>
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-[60px] font-bold leading-[1.1] tracking-tight text-stone-900">
                    Sacred Puja Blooms,{" "}
                    <span className="block mt-1 text-[#E8502B] italic font-normal font-serif">
                      flowers that pray with you.
                    </span>
                  </h1>
                </ScrollReveal>

                <ScrollReveal delayMs={130}>
                  <p className="max-w-lg text-sm sm:text-base lg:text-lg text-stone-600 leading-relaxed">
                    Order fresh{" "}
                    <strong className="text-stone-900 font-semibold">
                      Marigold (झेंडू), Chrysanthemum (शेवंती) & Red Hibiscus (लाल जास्वंद)
                    </strong>{" "}
                    a-la-carte, or subscribe from{" "}
                    <strong className="text-[#E8502B]">₹49/day</strong> with silent{" "}
                    <strong className="text-emerald-950">6:00 AM – 8:00 AM</strong> doorstep delivery.
                  </p>
                </ScrollReveal>

                {/* Sacred Orange & Light-Green Mix Gradient Primary CTA + Secondary CTA */}
                <ScrollReveal delayMs={190}>
                  <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-3 pt-1">
                    <Link
                      href="#fresh-flowers"
                      className="inline-flex items-center justify-center gap-2.5 rounded-2xl sm:rounded-full bg-gradient-to-r from-[#E8502B] via-amber-500 to-emerald-600 px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-105"
                    >
                      <ShoppingBag className="h-4 w-4 text-amber-200" />
                      <span>Shop Fresh Flowers</span>
                    </Link>
                    <Link
                      href="#plans"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl sm:rounded-full border-2 border-amber-400/60 bg-gradient-to-r from-orange-50/60 to-emerald-50/60 px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-stone-900 shadow-xs transition hover:border-[#E8502B] hover:bg-white"
                    >
                      <span>Subscriptions From ₹49</span>
                      <ArrowRight className="h-4 w-4 text-emerald-700" />
                    </Link>
                  </div>
                </ScrollReveal>

                <ScrollReveal delayMs={240}>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-4 border-t border-emerald-200/70 text-[11px] sm:text-xs font-semibold text-stone-700">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span>₹49 Day • ₹329 Week • ₹1,350 Month</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#E8502B]" />
                      <span>6:00 AM – 8:00 AM Silent Drop</span>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-6">
                <ScrollReveal delayMs={150}>
                  <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-lg">
                    <div className="relative overflow-hidden rounded-t-[6rem] sm:rounded-t-[10rem] rounded-b-[1.75rem] sm:rounded-b-[2.5rem] border-4 sm:border-[6px] border-white bg-stone-100 shadow-2xl aspect-4/4">
                      <img
                        src="/images/hero-banner.jpg"
                        alt="PALASSH Morning Puja Basket"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071C15]/90 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2 rounded-xl sm:rounded-2xl border border-emerald-400/30 bg-[#071C15]/90 px-3.5 py-2.5 sm:px-4 sm:py-3 text-white backdrop-blur-md">
                        <div className="min-w-0">
                          <p className="font-serif text-xs sm:text-base font-bold text-amber-200 italic truncate">
                            “flowers that pray with you”
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-emerald-100 truncate">
                            Morning Window • 6:00 AM – 8:00 AM
                          </p>
                        </div>
                        <span className="rounded-full bg-gradient-to-r from-[#E8502B] via-amber-500 to-emerald-600 px-3 py-1 text-[11px] font-bold text-white shrink-0 shadow-sm">
                          ₹49 / day
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </FeatureBoundary>

      {/* 2. PINCODE CONCIERGE DOCK (400601-400608) */}
      <FeatureBoundary featureName="PINCODE">
        <PincodeBox />
      </FeatureBoundary>

      {/* 3. A-LA-CARTE FRESH FLOWERS STORE (Sacred Orange & Light-Green Accents) */}
      <FeatureBoundary featureName="DIRECT_FLOWER_STORE">
        <section
          id="fresh-flowers"
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl border-b border-emerald-200/60"
        >
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-100/90 via-amber-100/80 to-emerald-100/90 border border-amber-300 px-3.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-stone-900">
                  <ShoppingBag className="h-3.5 w-3.5 text-emerald-700" />
                  <span>A-La-Carte Fresh Blooms</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-5xl font-bold text-stone-900">
                  Shop Sacred Puja Flowers
                </h2>
                <p className="text-xs sm:text-base text-stone-600">
                  Select exact weight in grams (<strong className="text-stone-900">100g, 250g, 500g</strong>). Normal days allow up to <strong className="text-stone-900">500g combined</strong>; Weekly (<strong className="text-emerald-800">2 KG</strong>) & Monthly (<strong className="text-emerald-800">3 KG</strong>) unlock festive quotas.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new Event("palassh-open-cart"))
                }
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#E8502B] via-amber-500 to-emerald-600 px-5 py-3.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 hover:brightness-105 cursor-pointer shrink-0"
              >
                <ShoppingBag className="h-4 w-4 text-amber-200" />
                <span>
                  Flower Basket ({totalCartItems} • {totalCartGrams}g • ₹
                  {totalCartAmount})
                </span>
              </button>
            </div>
          </ScrollReveal>

          {festiveStatus.isFestiveDay && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-400 bg-[#071C15] px-4 py-3.5 text-white shadow-lg">
              <div className="flex items-center gap-2.5">
                <Flame className="h-5 w-5 text-amber-400 shrink-0" />
                <p className="text-xs text-emerald-100">
                  <strong className="text-amber-300">Festive Mode Active:</strong> Direct orders reserved for Weekly (2 KG) & Monthly (3 KG) subscribers.
                </p>
              </div>
            </div>
          )}

          {/* 3 Homepage Flower Cards */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {homepageFlowers.map((flower, idx) => {
              const startingWeight = flower.availableWeights[0];
              const inCartItem = cart.find((c) => c.flowerId === flower.id);
              return (
                <ScrollReveal key={flower.id} delayMs={idx * 120}>
                  <div
                    onClick={() => openFlowerDetail(flower)}
                    className="group flex flex-col justify-between h-full overflow-hidden rounded-3xl sm:rounded-[2.2rem] border border-emerald-900/15 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-xl cursor-pointer"
                  >
                    <div>
                      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                        <img
                          src={flower.imageUrl}
                          alt={flower.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071C15]/85 via-transparent to-transparent" />
                        <span className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1 text-[10px] sm:text-[11px] font-bold text-emerald-950 shadow-xs">
                          {inCartItem
                            ? `In Basket: ${inCartItem.grams}g`
                            : "Fresh Farm Harvest"}
                        </span>
                        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
                          <span className="rounded-full bg-black/45 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
                            100g • 250g • 500g
                          </span>
                          <span className="rounded-lg bg-gradient-to-r from-[#E8502B] to-emerald-600 px-2.5 py-1 text-xs font-bold shadow-xs">
                            From ₹{startingWeight.price}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 sm:p-6">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-emerald-700 transition">
                            {flower.name}
                          </h3>
                          <span className="text-xs font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {flower.marathiName}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-500">
                          {flower.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1">
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 py-3 text-xs font-bold text-emerald-900 group-hover:bg-gradient-to-r group-hover:from-[#E8502B] group-hover:via-amber-500 group-hover:to-emerald-600 group-hover:text-white transition">
                        <Eye className="h-3.5 w-3.5" />
                        <span>Select Weight (100g / 250g / 500g)</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#E8502B] via-amber-500 to-emerald-600 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-105"
            >
              <span>View All Registered Flowers (/products)</span>
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
        className="relative border-y border-emerald-200/60 bg-gradient-to-b from-white via-[#FFFDFB] to-[#F2FAF6] py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center space-y-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 border border-amber-300 px-3.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900">
                <Sparkles className="h-3 w-3 text-emerald-700" /> Effortless Devotion
              </span>
              <h2 className="font-serif text-2xl sm:text-5xl font-bold text-stone-900">
                How Your PALASSH Ritual Works
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-10 sm:mt-14 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: CalendarCheck,
                title: "Choose Plan or Weight Pack",
                desc: "Subscribe to One Day (₹49), Weekly (₹329), Monthly (₹1,350) or pick individual flower weight packs (up to 500g).",
              },
              {
                step: "02",
                icon: Clock,
                title: "6–8 AM Silent Doorstep Drop",
                desc: "Every morning between 6:00 AM and 8:00 AM, our rider hangs your breathable flower pouch on your door without ringing the bell.",
              },
              {
                step: "03",
                icon: PauseCircle,
                title: "1-Click Pause Anytime",
                desc: "Traveling out of Thane? Pause before 8:00 PM from your My-Orders dashboard and your remaining days carry forward.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delayMs={i * 120}>
                <div className="group relative overflow-hidden rounded-3xl sm:rounded-[2rem] border border-emerald-100 bg-white p-6 sm:p-8 shadow-md transition hover:-translate-y-1 hover:border-emerald-400 h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E8502B] via-amber-500 to-emerald-600 text-white shadow-sm">
                      <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-emerald-900/15">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-xl sm:text-2xl font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SINGLE-LINE HORIZONTAL SWIPEABLE REVIEWS CAROUSEL + INLINE REVIEW FORM */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl space-y-16">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-100 via-amber-100 to-emerald-100 border border-amber-300 px-3.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-stone-900">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                <span>Swipe Left / Right • Thane Pincodes 400601–400608</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
                Morning Blessings from Thane Families
              </h2>
            </div>

            {/* Desktop Left/Right Carousel Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollReviewsRow("left")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-50 cursor-pointer shadow-2xs"
                aria-label="Scroll Reviews Left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollReviewsRow("right")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#E8502B] via-amber-500 to-emerald-600 text-white hover:brightness-105 cursor-pointer shadow-md shadow-orange-500/20"
                aria-label="Scroll Reviews Right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* SINGLE-LINE HORIZONTAL SWIPEABLE CARDS CONTAINER */}
          <div
            ref={reviewsScrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="w-[84vw] sm:w-[350px] md:w-[370px] shrink-0 snap-center sm:snap-start flex flex-col justify-between rounded-3xl border border-emerald-900/15 bg-white p-6 shadow-md hover:border-emerald-500 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    {rev.tag && (
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900">
                        {rev.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-stone-700 italic">
                    “{rev.quote}”
                  </p>
                </div>

                <div className="mt-5 border-t border-stone-100 pt-3.5 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-serif text-sm sm:text-base font-bold text-stone-900 truncate">
                      {rev.name}
                    </p>
                    <p className="text-[11px] text-emerald-800 font-medium truncate">
                      {rev.society}
                    </p>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* DEDICATED INLINE REVIEW SUBMISSION SECTION */}
          <div className="mt-10 overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-emerald-800/30 bg-gradient-to-br from-[#071C15] via-[#0B2B20] to-[#071C15] p-5 sm:p-10 text-white shadow-xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5 space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/80 border border-emerald-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  <span>Add Your Blessing</span>
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                  Share Your PALASSH Morning Experience
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                  Your review appears immediately in the swipeable Thane Devotee row above.
                </p>
              </div>

              <form
                onSubmit={handleSubmitReview}
                className="lg:col-span-7 rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 text-stone-900 shadow-lg space-y-4"
              >
                {reviewSubmittedMsg && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{reviewSubmittedMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs. Deshmukh"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Society & Thane Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hiranandani Estate (400607)"
                      value={reviewerSociety}
                      onChange={(e) => setReviewerSociety(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewerRating(star)}
                        className={`h-8 w-10 rounded-lg border flex items-center justify-center text-sm font-bold transition cursor-pointer ${
                          reviewerRating >= star
                            ? "border-amber-400 bg-amber-50 text-amber-500"
                            : "border-stone-200 bg-white text-stone-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Experience *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Tell us about the morning flower freshness or 6–8 AM silent delivery..."
                    value={reviewerQuote}
                    onChange={(e) => setReviewerQuote(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-[#FAF7F2] p-3 text-sm text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] via-amber-500 to-emerald-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:brightness-105 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Publish Review</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 7. FAQ SECTION */}
        <div className="rounded-3xl sm:rounded-[2.5rem] border border-emerald-900/15 bg-white p-5 sm:p-10 lg:p-14 shadow-lg">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Common Questions</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
                  Everything About Your Morning Flower Ritual.
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Clear answers on our 6:00 AM – 8:00 AM delivery slot, 500g normal limits, and Festive 2 KG / 3 KG subscriber quotas.
                </p>
              </div>

              <div className="rounded-2xl sm:rounded-3xl bg-[#071C15] p-5 sm:p-6 text-white space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                  Kalwa Dispatch Hub
                </p>
                <p className="text-xs text-emerald-100/85 leading-relaxed flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{SHOP_ADDRESS}</span>
                </p>
                <div className="pt-2 border-t border-white/10">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-200">
                    <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Morning Slot: 6:00 AM – 8:00 AM Daily</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {FAQS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={item.q}
                    className={`overflow-hidden rounded-2xl border transition-all ${
                      isOpen
                        ? "border-emerald-600 bg-emerald-50/20 shadow-xs"
                        : "border-stone-200 bg-white hover:border-emerald-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-3 px-4 sm:px-6 py-4 text-left cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="inline-block rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          {item.tag}
                        </span>
                        <p className="font-serif text-sm sm:text-base font-bold text-stone-900">
                          {item.q}
                        </p>
                      </div>
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                          isOpen
                            ? "bg-emerald-600 text-white rotate-180"
                            : "bg-emerald-50 text-emerald-800"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-emerald-100 px-4 sm:px-6 py-3.5 text-xs sm:text-sm leading-relaxed text-stone-600 bg-white">
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

      {/* FLOWER WEIGHT SELECTOR MODAL (STRICTLY GRAMS ONLY) */}
      {activeFlowerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-stone-200 bg-white p-5 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveFlowerModal(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3.5 border-b border-stone-100 pb-4 pr-8">
              <img
                src={activeFlowerModal.imageUrl}
                alt={activeFlowerModal.name}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-stone-200 shrink-0"
              />
              <div>
                <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  {activeFlowerModal.deityAffinity}
                </span>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  {activeFlowerModal.name}{" "}
                  <span className="text-emerald-800 text-sm font-semibold">
                    ({activeFlowerModal.marathiName})
                  </span>
                </h3>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <p className="text-xs leading-relaxed text-stone-600 bg-[#FAF7F2] p-3.5 rounded-2xl border border-stone-200/60">
                {activeFlowerModal.botanicalNote}
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Select Exact Weight (Grams Only):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {activeFlowerModal.availableWeights.map((wt, idx) => {
                    const isSelected = modalWeightIdx === idx;
                    return (
                      <button
                        key={wt.grams}
                        type="button"
                        onClick={() => {
                          setModalWeightIdx(idx);
                          setCartError("");
                        }}
                        className={`rounded-2xl border p-3 text-center transition cursor-pointer ${
                          isSelected
                            ? "border-2 border-emerald-600 bg-emerald-50/70 shadow-2xs"
                            : "border-stone-200 bg-white hover:border-emerald-400"
                        }`}
                      >
                        <p className="font-serif text-base font-bold text-stone-900">
                          {wt.grams}g
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-emerald-800">
                          ₹{wt.price}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {cartError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{cartError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSelectWeightAndAddToCart(activeFlowerModal)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8502B] via-amber-500 to-emerald-600 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-105 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>
                  Confirm {activeFlowerModal.availableWeights[modalWeightIdx]?.grams}g Pack • ₹
                  {activeFlowerModal.availableWeights[modalWeightIdx]?.price}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}