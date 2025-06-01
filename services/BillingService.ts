import type { BillingTransaction, Subscription, Wallet } from "../types/billing"

export class BillingService {
  private mockWallet: Wallet = {
    id: "wallet_user_123",
    userId: "user_123",
    balance: 25.5,
    currency: "USD",
    updatedAt: new Date(),
  }

  private mockSubscription: Subscription = {
    id: "sub_user_123",
    userId: "user_123",
    planId: "plan_premium",
    status: "active",
    amount: 29.99,
    currency: "USD",
    billingCycle: "monthly",
    nextBillingDate: new Date("2024-02-01"),
    paypalSubscriptionId: "I-BW452GLLEP1G",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  }

  async processMonthlyBilling(userId: string): Promise<BillingTransaction> {
    try {
      console.log(`Processing billing for user: ${userId}`)

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
        console.log("Processing wallet-only payment")
        transaction = await this.processWalletPayment(userId, subscription.id, subscriptionAmount)
      } else if (walletBalance > 0) {
        console.log("Processing hybrid payment (wallet + PayPal)")
        transaction = await this.processHybridPayment(userId, subscription.id, subscriptionAmount, walletBalance)
      } else {
        console.log("Processing PayPal-only payment")
        transaction = await this.processPayPalPayment(userId, subscription.id, subscriptionAmount)
      }

      console.log("Transaction completed:", transaction)
      return transaction
    } catch (error) {
      console.error("Billing processing failed:", error)

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
        description: `Billing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  private async processWalletPayment(
    userId: string,
    subscriptionId: string,
    amount: number,
  ): Promise<BillingTransaction> {
    console.log(`Deducting $${amount} from wallet for user ${userId}`)

    // Update mock wallet balance
    this.mockWallet.balance = Math.max(0, this.mockWallet.balance - amount)

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
      const paypalSuccess = await this.simulatePayPalCharge(paypalAmount)

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
        description: `Payment failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  private async processPayPalPayment(
    userId: string,
    subscriptionId: string,
    amount: number,
  ): Promise<BillingTransaction> {
    try {
      const paypalSuccess = await this.simulatePayPalCharge(amount)

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
        description: `PayPal payment failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  private async simulatePayPalCharge(amount: number): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 90% success rate for demo
    return Math.random() > 0.1
  }

  async getActiveSubscription(userId: string): Promise<Subscription | null> {
    try {
      console.log(`Fetching subscription for user: ${userId}`)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return this.mockSubscription
    } catch (error) {
      console.error("Failed to get subscription:", error)
      return this.mockSubscription
    }
  }

  async getUserWallet(userId: string): Promise<Wallet> {
    try {
      console.log(`Fetching wallet for user: ${userId}`)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return this.mockWallet
    } catch (error) {
      console.error("Failed to get wallet:", error)
      return this.mockWallet
    }
  }

  getWalletBalance(): number {
    return this.mockWallet.balance
  }

  updateWalletBalance(newBalance: number): void {
    this.mockWallet.balance = Math.max(0, newBalance)
  }
}
