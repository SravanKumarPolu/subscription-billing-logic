import { BillingService } from "./billing-service"

export class BillingCron {
  private billingService: BillingService

  constructor() {
    this.billingService = new BillingService()
  }

  async processAllSubscriptions() {
    try {
      console.log("Starting monthly billing process...")

      // Use mock users for demo - in production this would come from database
      const usersDue = ["user_123", "user_456", "user_789"]
      console.log("Users due for billing:", usersDue)

      const results = []

      for (const userId of usersDue) {
        try {
          console.log(`Processing billing for user: ${userId}`)
          const transaction = await this.billingService.processMonthlyBilling(userId)
          results.push({ userId, status: "success", transaction })

          console.log(`Billing successful for user ${userId}`)
        } catch (error) {
          console.error(`Billing failed for user ${userId}:`, error)
          results.push({ userId, status: "failed", error: error.message })
        }
      }

      console.log("Monthly billing process completed:", results)
      return results
    } catch (error) {
      console.error("Billing cron job failed:", error)
      throw error
    }
  }
}
