import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    console.log("Fetching subscription for user:", params.userId)

    // Mock subscription data - replace with actual database query
    const subscription = {
      id: `sub_${params.userId}`,
      userId: params.userId,
      planId: "plan_premium",
      status: "active",
      amount: 29.99,
      currency: "USD",
      billingCycle: "monthly",
      nextBillingDate: new Date("2024-02-01").toISOString(),
      paypalSubscriptionId: "I-BW452GLLEP1G",
      createdAt: new Date("2024-01-01").toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(subscription, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription", details: (error as Error).message },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const updates = await request.json()

    console.log(`Updating subscription ${params.userId} with:`, updates)

    return NextResponse.json(
      {
        success: true,
        message: "Subscription updated successfully",
        updates,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error updating subscription:", error)
    return NextResponse.json(
      { error: "Failed to update subscription", details: error.message },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
