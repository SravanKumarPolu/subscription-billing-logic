import { type NextRequest, NextResponse } from "next/server"
import { BillingCron } from "@/lib/cron-billing"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    console.log("=== Starting Billing Process API ===")

    const body = await request.json().catch(() => ({}))
    const preferredPaymentMethod = body.preferredPaymentMethod || 'paypal'
    
    console.log(`Using preferred payment method: ${preferredPaymentMethod}`)

    const billingCron = new BillingCron()
    const results = await billingCron.processAllSubscriptions(preferredPaymentMethod)

    console.log("=== Billing Process Completed ===")

    return NextResponse.json({
      success: true,
      message: `Billing process completed successfully using ${preferredPaymentMethod}`,
      results,
      timestamp: new Date().toISOString(),
      totalProcessed: results.length,
      successful: results.filter((r) => r.status === "success").length,
      failed: results.filter((r) => r.status === "failed").length,
    })
  } catch (error) {
    console.error("=== Billing Process Failed ===", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
