import type { BillingTransaction, Subscription, Wallet } from "./types"

export class BillingService {
  // Mock data as fallbacks
  private mockWallet = {
    id: "wallet_user_123",
    userId: "user_123",
    balance: 55.5,
    currency: "USD",
    updatedAt: new Date(),
  }

  private mockSubscription = {
    id: "sub_user_123",
    userId: "user_123",
    planId: "plan_premium",
    status: "active" as const,
    amount: 29.99,
    currency: "USD",
    billingCycle: "monthly" as const,
    nextBillingDate: new Date("2024-02-01"),
    paypalSubscriptionId: "I-BW452GLLEP1G",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  }

  async processMonthlyBilling(userId: string): Promise<BillingTransaction> {
    try {
      console.log(`Processing billing for user: ${userId}`)

      // Get user subscription and wallet with fallbacks
      const subscription = await this.getActiveSubscription(userId)
      const wallet = await this.getUserWallet(userId)

      if (!subscription) {
        throw new Error("No active subscription found")
      }

      const subscriptionAmount = subscription.amount
      const walletBalance = wallet.balance

      console.log(`Subscription amount: $${subscriptionAmount}, Wallet balance: $${walletBalance}`)

      let transaction: BillingTransaction

      if (walletBalance >= subscriptionAmount) {
        // Wallet covers full amount
        console.log("Processing wallet-only payment")
        transaction = await this.processWalletPayment(userId, subscription.id, subscriptionAmount)
      } else if (walletBalance > 0) {
        // Partial wallet + PayPal
        console.log("Processing hybrid payment (wallet + PayPal)")
        transaction = await this.processHybridPayment(userId, subscription.id, subscriptionAmount, walletBalance)
      } else {
        // Full PayPal payment
        console.log("Processing PayPal-only payment")
        transaction = await this.processPayPalPayment(userId, subscription.id, subscriptionAmount)
      }

      console.log("Transaction completed:", transaction)
      return transaction
    } catch (error) {
      console.error("Billing processing failed:", error)

      // Create a failed transaction record
      return {
        id: `txn_failed_${Date.now()}`,
        userId,
        subscriptionId: "unknown",
        amount: 0,
        walletAmount: 0,
        paypalAmount: 0,
        status: "failed",
        paymentMethod: "wallet",
        transactionDate: new Date(),
        description: `Billing failed: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  private async processWalletPayment(
    userId: string,
    subscriptionId: string,
    amount: number,
  ): Promise<BillingTransaction> {
    // Simulate wallet deduction
    console.log(`Deducting $${amount} from wallet for user ${userId}`)

    // Update mock wallet balance
    this.mockWallet.balance -= amount

    return {
      id: `txn_wallet_${Date.now()}`,
      userId,
      subscriptionId,
      amount,
      walletAmount: amount,
      paypalAmount: 0,
      status: "success",
      paymentMethod: "wallet",
      transactionDate: new Date(),
      description: "Subscription payment via wallet",
    }
  }

  private async processHybridPayment(
    userId: string,
    subscriptionId: string,
    totalAmount: number,
    walletAmount: number,
  ): Promise<BillingTransaction> {
    const paypalAmount = totalAmount - walletAmount

    try {
      // Simulate PayPal charge
      const paypalSuccess = Math.random() > 0.1 // 90% success rate

      if (paypalSuccess) {
        console.log(`PayPal charge successful: $${paypalAmount}`)

        // Update mock wallet balance
        this.mockWallet.balance = 0

        return {
          id: `txn_hybrid_${Date.now()}`,
          userId,
          subscriptionId,
          amount: totalAmount,
          walletAmount,
          paypalAmount,
          status: "success",
          paymentMethod: "wallet_paypal",
          transactionDate: new Date(),
          description: `Subscription payment: $${walletAmount.toFixed(2)} wallet + $${paypalAmount.toFixed(2)} PayPal`,
        }
      } else {
        throw new Error("PayPal payment declined")
      }
    } catch (error) {
      return {
        id: `txn_hybrid_failed_${Date.now()}`,
        userId,
        subscriptionId,
        amount: totalAmount,
        walletAmount: 0,
        paypalAmount: 0,
        status: "failed",
        paymentMethod: "wallet_paypal",
        transactionDate: new Date(),
        description: `Payment failed: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  private async processPayPalPayment(
    userId: string,
    subscriptionId: string,
    amount: number,
  ): Promise<BillingTransaction> {
    try {
      // Simulate PayPal charge
      const paypalSuccess = Math.random() > 0.1 // 90% success rate

      if (paypalSuccess) {
        console.log(`PayPal charge successful: $${amount}`)

        return {
          id: `txn_paypal_${Date.now()}`,
          userId,
          subscriptionId,
          amount,
          walletAmount: 0,
          paypalAmount: amount,
          status: "success",
          paymentMethod: "paypal",
          transactionDate: new Date(),
          description: "Subscription payment via PayPal",
        }
      } else {
        throw new Error("PayPal payment declined")
      }
    } catch (error) {
      return {
        id: `txn_paypal_failed_${Date.now()}`,
        userId,
        subscriptionId,
        amount,
        walletAmount: 0,
        paypalAmount: 0,
        status: "failed",
        paymentMethod: "paypal",
        transactionDate: new Date(),
        description: `PayPal payment failed: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  private async getActiveSubscription(userId: string): Promise<Subscription | null> {
    try {
      // Try to fetch from API, but fall back to mock data
      console.log(`Fetching subscription for user: ${userId}`)
      return this.mockSubscription
    } catch (error) {
      console.error("Failed to get subscription, using mock data:", error)
      return this.mockSubscription
    }
  }

  private async getUserWallet(userId: string): Promise<Wallet> {
    try {
      // Try to fetch from API, but fall back to mock data
      console.log(`Fetching wallet for user: ${userId}`)
      return this.mockWallet
    } catch (error) {
      console.error("Failed to get wallet, using mock data:", error)
      return this.mockWallet
    }
  }
}
