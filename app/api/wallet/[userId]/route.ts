import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    console.log("Fetching wallet for user:", params.userId)

    // Mock wallet data - replace with actual database query
    const wallet = {
      id: `wallet_${params.userId}`,
      userId: params.userId,
      balance: 25.5, // Example balance
      currency: "USD",
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(wallet, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching wallet:", error)
    return NextResponse.json(
      { error: "Failed to fetch wallet", details: error.message },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
