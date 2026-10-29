export interface FlowerProduct {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  botanicalNote: string;
  imageUrl: string;
  basePricePer100g: number;
  unitType: "WEIGHT" | "COUNT_AND_WEIGHT";
  availableWeights: {
    label: string;
    grams: number;
    price: number;
  }[];
  inStock: boolean;
  isSacredSpecial?: boolean;
  deityAffinity: string;
}

export type FlowerSelectionMode = "MIXED" | "CUSTOM";

export interface SubscriptionPlan {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  perDayEffectivePrice: number;
  billingCycle: "day" | "week" | "month";
  deliveriesCount: number;
  pouchWeight: string;
  mixedPredefinedBreakdown: string;
  badge?: string;
  isPopular?: boolean;
  imageUrl: string;
  flowersIncluded: string[];
  shortHighlights: string[];
  features: string[];
}

export interface CartItem {
  id: string;
  flowerId: string;
  flowerName: string;
  imageUrl: string;
  weightLabel: string;
  unitPrice: number;
  quantity: number;
}

export const INITIAL_FLOWERS: FlowerProduct[] = [
  {
    id: "flw-marigold",
    slug: "marigold",
    name: "Marigold",
    subtitle: "Fresh Saffron & Golden Puja Blooms",
    botanicalNote:
      "Plucked at 1:30 AM from Nashik farms. Zero cold storage, vibrant petals with rich natural fragrance for daily archana and toran.",
    imageUrl: "/images/merigold.jpeg",
    basePricePer100g: 35,
    unitType: "WEIGHT",
    availableWeights: [
      { label: "100g Morning Pouch", grams: 100, price: 35 },
      { label: "250g Family Puja Pack", grams: 250, price: 80 },
      { label: "500g Garland & Toran Pack", grams: 500, price: 150 },
    ],
    inStock: true,
    deityAffinity: "All Daily Puja & Toran Rituals",
  },
  {
    id: "flw-chrysanthemum",
    slug: "chrysanthemum",
    name: "Chrysanthemum",
    subtitle: "Ivory & Golden Temple Blooms",
    botanicalNote:
      "Long-lasting premium blooms that stay dew-fresh in your home mandir from early morning aarti until late evening.",
    imageUrl: "/images/chrysanthemum.jpeg",
    basePricePer100g: 45,
    unitType: "WEIGHT",
    availableWeights: [
      { label: "100g Morning Pouch", grams: 100, price: 45 },
      { label: "250g Family Puja Pack", grams: 250, price: 105 },
      { label: "500g Temple Assortment", grams: 500, price: 195 },
    ],
    inStock: true,
    deityAffinity: "Goddess Lakshmi & Lord Vishnu Puja",
  },
  {
    id: "flw-hibiscus",
    slug: "red-hibiscus",
    name: "Red Hibiscus",
    subtitle: "Sacred Crimson Buds for Ganpati & Devi",
    botanicalNote:
      "Hand-picked Dahanu crimson buds packed in breathable eco-pouches so every bloom opens fresh during your morning prayers.",
    imageUrl: "/images/hibiscus.jpeg",
    basePricePer100g: 50,
    unitType: "COUNT_AND_WEIGHT",
    availableWeights: [
      { label: "5 Buds + Fresh Tulsi (~100g)", grams: 100, price: 50 },
      { label: "11 Buds Sankashti Pack (~200g)", grams: 200, price: 95 },
      { label: "21 Buds Abhishekam Pack (~350g)", grams: 350, price: 175 },
    ],
    inStock: true,
    isSacredSpecial: true,
    deityAffinity: "Lord Ganesha & Goddess Durga Puja",
  },
];

export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: "plan-daily",
    slug: "daily-puja-pack",
    title: "Daily Puja Pack",
    subtitle: "Flexible single-day or daily morning ritual with fresh farm blooms.",
    price: 76,
    perDayEffectivePrice: 76,
    billingCycle: "day",
    deliveriesCount: 1,
    pouchWeight: "100g – 120g",
    mixedPredefinedBreakdown:
      "40g Marigold + 40g Chrysanthemum + 2 Red Hibiscus + Sacred Tulsi",
    badge: "Flexible Trial",
    isPopular: false,
    imageUrl: "/images/plan-daily.jpg",
    flowersIncluded: ["Marigold", "Chrysanthemum", "Red Hibiscus", "Fresh Tulsi"],
    shortHighlights: [
      "100g – 120g Dew-Fresh Morning Pouch",
      "5:00 AM – 8:00 AM Silent Doorstep Drop",
    ],
    features: [
      "Choose Predefined Mixed Box OR Tick Separate Flowers",
      "5:00 AM – 8:00 AM Silent Doorstep Drop (No Bell Ringing)",
      "Zero Cold-Storage • Plucked at 1:30 AM from Farms",
      "Includes complimentary sacred Tulsi leaves",
    ],
  },
  {
    id: "plan-weekly",
    slug: "weekly-devotion-pack",
    title: "Weekly Devotion Pack",
    subtitle: "7 sacred mornings with day-by-day flower & pause control.",
    price: 510,
    perDayEffectivePrice: 72,
    billingCycle: "week",
    deliveriesCount: 7,
    pouchWeight: "125g + Garland",
    mixedPredefinedBreakdown:
      "50g Marigold + 50g Chrysanthemum + 3 Red Hibiscus + Sacred Garland",
    badge: "Includes Garland",
    isPopular: false,
    imageUrl: "/images/plan-weekly.jpg",
    flowersIncluded: [
      "Marigold",
      "Chrysanthemum",
      "Red Hibiscus",
      "Hand-Strung Garland",
    ],
    shortHighlights: [
      "7 Morning Deliveries (125g + Weekly Garland)",
      "Day-Wise Flower & Pause Control before 8 PM",
    ],
    features: [
      "Switch between Mixed or Separate Flowers any day via Checkboxes",
      "Modify next day's flower or Pause before 8:00 PM",
      "Complimentary hand-strung garland included",
      "Paused days automatically carry forward",
    ],
  },
  {
    id: "plan-monthly",
    slug: "monthly-sacred-assortment",
    title: "Monthly Sacred Assortment",
    subtitle: "Complete 30-day peace of mind with festival special offerings.",
    price: 2100,
    perDayEffectivePrice: 70,
    billingCycle: "month",
    deliveriesCount: 30,
    pouchWeight: "150g + Festival Lotus",
    mixedPredefinedBreakdown:
      "60g Marigold + 50g Chrysanthemum + 4 Red Hibiscus + Belpatra & Tulsi",
    badge: "Most Popular",
    isPopular: true,
    imageUrl: "/images/plan-monthly.jpg",
    flowersIncluded: [
      "Marigold",
      "Chrysanthemum",
      "Red Hibiscus",
      "Festival Lotus & Belpatra",
    ],
    shortHighlights: [
      "30 Morning Deliveries (150g + Festival Specials)",
      "Full 30-Day Checkbox Planner & Unlimited Pauses",
    ],
    features: [
      "Full 30-Day Interactive Checkbox Schedule in My-Orders",
      "Tick specific flowers per day (e.g. Tuesday = Only Red Hibiscus)",
      "Unlimited 1-Click Pause before 8 PM (Days carry forward)",
      "Complimentary Lotus & Belpatra on Ekadashi & Sankashti",
    ],
  },
];

export const CATALOG_STORAGE_KEY = "palassh_flowers_catalog_v2";
export const CART_STORAGE_KEY = "palassh_flower_cart_v1";

export function getActiveFlowersCatalog(): FlowerProduct[] {
  if (typeof window === "undefined") return INITIAL_FLOWERS;
  try {
    const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Fallback to default catalog
  }
  return INITIAL_FLOWERS;
}

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore storage error
  }
  return [];
}

export function saveStoredCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("palassh-cart-updated"));
  } catch {
    // Ignore storage error
  }
}