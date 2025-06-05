import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, transaction } = await request.json()

    console.log(`Sending billing success notification to user ${userId}:`, transaction)

    // Create customer-friendly success message
    const customerMessage = generateSuccessMessage(transaction)
    
    // Mock email notification - replace with actual email service
    // In a real app, you'd integrate with SendGrid, Mailgun, etc.
    const emailData = {
      to: `user_${userId}@example.com`,
      subject: "🎉 Subscription Renewed Successfully!",
      message: customerMessage,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        date: transaction.transactionDate,
        paymentMethod: transaction.paymentMethod
      }
    }

    console.log("Email notification data:", emailData)

    return NextResponse.json(
      {
        success: true,
        message: "Billing success notification sent",
        customerMessage: customerMessage,
        userId,
        timestamp: new Date().toISOString(),
        emailSent: true
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Failed to send billing success notification:", error)
    return NextResponse.json(
      { error: "Failed to send notification", details: error instanceof Error ? error.message : String(error) },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

function generateSuccessMessage(transaction: any): string {
  const amount = `$${transaction.amount.toFixed(2)}`
  const date = new Date(transaction.transactionDate).toLocaleDateString()
  
  let paymentMethodText = ""
  if (transaction.paymentMethod === "wallet") {
    paymentMethodText = "using your wallet balance"
  } else if (transaction.paymentMethod === "paypal") {
    paymentMethodText = "via PayPal"
  } else if (transaction.paymentMethod === "wallet_paypal") {
    paymentMethodText = `using wallet ($${transaction.walletAmount.toFixed(2)}) + PayPal ($${transaction.paypalAmount.toFixed(2)})`
  }

  return `🎉 Great news! Your subscription has been renewed successfully!

💰 Amount: ${amount}
📅 Date: ${date}
💳 Payment: ${paymentMethodText}

Your premium plan is now active for another month. Thank you for being a valued customer!

Need help? Contact our support team anytime.`
}
