import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const transactionData = await request.json()

    // Mock transaction creation - replace with actual database insert
    const transaction = {
      ...transactionData,
      id: transactionData.id || `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transactionDate: new Date().toISOString(),
    }

    console.log("Created transaction:", transaction)

    return NextResponse.json(transaction, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Transaction creation error:", error)
    return NextResponse.json(
      { error: "Failed to create transaction", details: (error as Error).message },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Mock transaction history - replace with actual database query
    const transactions = [
      {
        id: "txn_1",
        userId: "user_123",
        subscriptionId: "sub_user_123",
        amount: 29.99,
        walletAmount: 25.5,
        paypalAmount: 4.49,
        status: "success",
        paymentMethod: "wallet_paypal",
        transactionDate: new Date("2024-01-01").toISOString(),
        description: "Subscription payment: $25.50 wallet + $4.49 PayPal",
      },
    ]

    return NextResponse.json(transactions, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions", details: (error as Error).message },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
