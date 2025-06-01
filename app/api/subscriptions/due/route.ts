import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("Processing subscriptions due request...")

    const body = await request.json()
    const { date } = body

    console.log("Looking for subscriptions due on:", date)

    // Mock subscriptions due - replace with actual database query
    const subscriptionsDue = [
      {
        id: "sub_user_123",
        userId: "user_123",
        nextBillingDate: date,
        amount: 29.99,
        status: "active",
      },
    ]

    console.log("Found subscriptions due:", subscriptionsDue)

    return NextResponse.json(subscriptionsDue, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error in /api/subscriptions/due:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch due subscriptions",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// Add GET method as fallback
export async function GET(request: NextRequest) {
  try {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const subscriptionsDue = [
      {
        id: "sub_user_123",
        userId: "user_123",
        nextBillingDate: tomorrow.toISOString(),
        amount: 29.99,
        status: "active",
      },
    ]

    return NextResponse.json(subscriptionsDue, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch due subscriptions" }, { status: 500 })
  }
}
