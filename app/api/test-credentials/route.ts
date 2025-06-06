import { NextResponse } from "next/server"
import { BillingService } from "@/lib/billing-service"

export async function GET() {
  try {
    const billingService = new BillingService()
    const credentials = billingService.getTestCredentials()

    if (!credentials.isTestMode) {
      return NextResponse.json(
        { error: "Test credentials only available in test mode" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      testMode: true,
      credentials,
      instructions: {
        paypal: {
          steps: [
            "1. Create PayPal Developer Account at https://developer.paypal.com",
            "2. Go to Dashboard → Sandbox → Accounts",
            "3. Create Sandbox Business Account (for your app/merchant)",
            "4. Create Sandbox Personal Account (acts as customer)",
            "5. Go to My Apps & Credentials → Create App",
            "6. Copy Client ID and Secret Key",
            "7. Use sandbox personal account to test payments at https://www.sandbox.paypal.com/"
          ],
          environment: "sandbox",
          baseUrl: "https://api.sandbox.paypal.com"
        },
        stripe: {
          steps: [
            "1. Create Stripe account at https://dashboard.stripe.com/register",
            "2. Toggle 'Test Mode' in top-left of dashboard",
            "3. Go to Developers → API Keys",
            "4. Use Publishable Key and Secret Key from test mode",
            "5. Use test cards for payments"
          ],
          environment: "test",
          testCardsUrl: "https://stripe.com/docs/testing"
        }
      }
    })
  } catch (error) {
    console.error("Test credentials error:", error)
    return NextResponse.json(
      { error: "Failed to get test credentials" },
      { status: 500 }
    )
  }
} 