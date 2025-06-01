import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, amount } = await request.json()

    console.log(`Deducting $${amount} from wallet for user ${userId}`)

    // Mock wallet deduction - replace with actual database update
    // In a real app, you'd update the database here

    return NextResponse.json(
      {
        success: true,
        message: `Deducted $${amount} from wallet`,
        userId,
        amount,
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
    console.error("Error deducting from wallet:", error)
    return NextResponse.json(
      { error: "Failed to deduct from wallet", details: error.message },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
