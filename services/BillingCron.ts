import { BillingService } from "./BillingService"
import type { BillingResult } from "../types/billing"

export class BillingCron {
  private billingService: BillingService

  constructor() {
    this.billingService = new BillingService()
  }

  async processAllSubscriptions(): Promise<BillingResult> {
    try {
      console.log("Starting monthly billing process...")

      // Mock users due for billing
      const usersDue = ["user_123", "user_456", "user_789"]
      console.log("Users due for billing:", usersDue)

      const results = []

      for (const userId of usersDue) {
        try {
          console.log(`Processing billing for user: ${userId}`)
          const transaction = await this.billingService.processMonthlyBilling(userId)
          results.push({ userId, status: "success" as const, transaction })

          console.log(`Billing successful for user ${userId}`)
        } catch (error) {
          console.error(`Billing failed for user ${userId}:`, error)
          results.push({
            userId,
            status: "failed" as const,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }

      const successful = results.filter((r) => r.status === "success").length
      const failed = results.filter((r) => r.status === "failed").length

      console.log("Monthly billing process completed:", results)

      return {
        success: true,
        message: "Billing process completed successfully",
        results,
        totalProcessed: results.length,
        successful,
        failed,
      }
    } catch (error) {
      console.error("Billing cron job failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Billing process failed",
      }
    }
  }
}
