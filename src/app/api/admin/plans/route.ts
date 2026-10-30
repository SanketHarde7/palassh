import { NextResponse } from "next/server";
import { INITIAL_PLANS, SubscriptionPlan } from "@/features/catalog/types";

let currentPlans: SubscriptionPlan[] = [...INITIAL_PLANS];

export async function GET() {
  return NextResponse.json({ plans: currentPlans });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (Array.isArray(body.plans) && body.plans.length > 0) {
      currentPlans = body.plans;
      return NextResponse.json({ success: true, plans: currentPlans });
    }
    return NextResponse.json({ error: "Invalid plans array" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update plans" }, { status: 500 });
  }
}
