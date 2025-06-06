import { NextRequest, NextResponse } from "next/server"
import { BillingService } from "@/lib/billing-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, paymentMethodId } = body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    console.log(`Processing Stripe billing for user: ${userId}`)

    const billingService = new BillingService()
    
    // For this example, we'll use a fixed subscription amount
    // In a real app, you'd fetch the user's subscription details
    const subscriptionAmount = 29.99
    const subscriptionId = "sub_user_123"

    const transaction = await billingService.processStripePayment(
      userId,
      subscriptionId,
      subscriptionAmount,
      paymentMethodId
    )

    console.log("Stripe transaction completed:", transaction)

    return NextResponse.json({
      success: transaction.status === "success",
      transaction,
      message: transaction.status === "success" 
        ? "Stripe payment processed successfully!" 
        : "Stripe payment failed",
    })
  } catch (error) {
    console.error("Stripe billing error:", error)
    return NextResponse.json(
      { 
        error: "Stripe billing process failed",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 