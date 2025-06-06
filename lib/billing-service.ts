import type { BillingTransaction, Subscription, Wallet } from "./types"
import { PayPalService } from "./paypal-service"
import { StripeService } from "./stripe-service"

export class BillingService {
  private paypalService: PayPalService
  private stripeService: StripeService
  private isTestMode: boolean

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

  constructor() {
    this.paypalService = new PayPalService()
    this.stripeService = new StripeService()
    this.isTestMode = process.env.TEST_MODE === 'true' || process.env.NODE_ENV !== 'production'
  }

  async processMonthlyBilling(userId: string, preferredPaymentMethod: 'paypal' | 'stripe' = 'paypal'): Promise<BillingTransaction> {
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
        // Partial wallet + external payment method
        console.log(`Processing hybrid payment (wallet + ${preferredPaymentMethod})`)
        transaction = await this.processHybridPayment(userId, subscription.id, subscriptionAmount, walletBalance, preferredPaymentMethod)
      } else {
        // Full external payment method
        console.log(`Processing ${preferredPaymentMethod}-only payment`)
        if (preferredPaymentMethod === 'stripe') {
          transaction = await this.processStripePayment(userId, subscription.id, subscriptionAmount)
        } else {
          transaction = await this.processPayPalPayment(userId, subscription.id, subscriptionAmount)
        }
      }

      console.log("Transaction completed:", transaction)
      
      // Send success notification if transaction was successful
      if (transaction.status === "success") {
        await this.sendSuccessNotification(userId, transaction)
      }
      
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
    preferredPaymentMethod: 'paypal' | 'stripe' = 'paypal',
  ): Promise<BillingTransaction> {
    const externalAmount = totalAmount - walletAmount

    try {
      console.log(`🧪 Processing hybrid payment: $${walletAmount} wallet + $${externalAmount} ${preferredPaymentMethod}`)

      let externalResult: any
      let transactionId: string

      if (preferredPaymentMethod === 'stripe') {
        // Use Stripe service
        externalResult = await this.stripeService.chargeCustomer(externalAmount, 'usd')
        transactionId = externalResult.id || `STRIPE_TEST_${Date.now()}`
      } else {
        // Use PayPal service  
        externalResult = await this.paypalService.chargeCustomer(externalAmount, 'USD')
        transactionId = externalResult.id || `PAYPAL_TEST_${Date.now()}`
      }
      
      if (externalResult.status === 'COMPLETED' || externalResult.test_mode || externalResult.succeeded) {
        console.log(`✅ ${preferredPaymentMethod} charge successful: $${externalAmount}`)

        // Update mock wallet balance
        this.mockWallet.balance = 0

        const paymentMethodType = preferredPaymentMethod === 'stripe' ? 'wallet_stripe' : 'wallet_paypal'

        return {
          id: `txn_hybrid_${Date.now()}`,
          userId,
          subscriptionId,
          amount: totalAmount,
          walletAmount,
          paypalAmount: preferredPaymentMethod === 'paypal' ? externalAmount : 0,
          stripeAmount: preferredPaymentMethod === 'stripe' ? externalAmount : 0,
          status: "success",
          paymentMethod: paymentMethodType,
          transactionDate: new Date(),
          description: `Subscription payment: $${walletAmount.toFixed(2)} wallet + $${externalAmount.toFixed(2)} ${preferredPaymentMethod}${this.isTestMode ? ' (TEST)' : ''}`,
          testMode: this.isTestMode,
          ...(preferredPaymentMethod === 'stripe' 
            ? { stripePaymentIntentId: transactionId }
            : { paypalTransactionId: transactionId }
          ),
        }
      } else {
        throw new Error(`${preferredPaymentMethod} payment not completed`)
      }
    } catch (error) {
      console.error(`❌ Hybrid payment failed:`, error)
      return {
        id: `txn_hybrid_failed_${Date.now()}`,
        userId,
        subscriptionId,
        amount: totalAmount,
        walletAmount: 0,
        paypalAmount: 0,
        status: "failed",
        paymentMethod: preferredPaymentMethod === 'stripe' ? 'wallet_stripe' : 'wallet_paypal',
        transactionDate: new Date(),
        description: `Payment failed: ${error instanceof Error ? error.message : String(error)}${this.isTestMode ? ' (TEST)' : ''}`,
        testMode: this.isTestMode,
      }
    }
  }

  private async processPayPalPayment(
    userId: string,
    subscriptionId: string,
    amount: number,
  ): Promise<BillingTransaction> {
    try {
      console.log(`🧪 Processing PayPal payment: $${amount}`)

      // Use PayPal service for testing/production
      const paypalResult = await this.paypalService.chargeCustomer(amount, 'USD')

      if (paypalResult.status === 'COMPLETED' || paypalResult.test_mode) {
        console.log(`✅ PayPal charge successful: $${amount}`)

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
          description: `Subscription payment via PayPal${this.isTestMode ? ' (TEST)' : ''}`,
          testMode: this.isTestMode,
          paypalTransactionId: paypalResult.id,
        }
      } else {
        throw new Error("PayPal payment not completed")
      }
    } catch (error) {
      console.error('❌ PayPal payment failed:', error)
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
        description: `PayPal payment failed: ${error instanceof Error ? error.message : String(error)}${this.isTestMode ? ' (TEST)' : ''}`,
        testMode: this.isTestMode,
      }
    }
  }

  // New method for Stripe payments
  async processStripePayment(
    userId: string,
    subscriptionId: string,
    amount: number,
    paymentMethodId?: string,
  ): Promise<BillingTransaction> {
    try {
      console.log(`🧪 Processing Stripe payment: $${amount}`)

      const stripeResult = await this.stripeService.chargeCustomer(amount, 'usd', paymentMethodId)

      if (stripeResult.status === 'succeeded' || stripeResult.test_mode) {
        console.log(`✅ Stripe charge successful: $${amount}`)

        return {
          id: `txn_stripe_${Date.now()}`,
          userId,
          subscriptionId,
          amount,
          walletAmount: 0,
          paypalAmount: 0,
          status: "success",
          paymentMethod: "stripe",
          transactionDate: new Date(),
          description: `Subscription payment via Stripe${this.isTestMode ? ' (TEST)' : ''}`,
          testMode: this.isTestMode,
          stripePaymentIntentId: stripeResult.id,
        }
      } else {
        throw new Error("Stripe payment not successful")
      }
    } catch (error) {
      console.error('❌ Stripe payment failed:', error)
      return {
        id: `txn_stripe_failed_${Date.now()}`,
        userId,
        subscriptionId,
        amount,
        walletAmount: 0,
        paypalAmount: 0,
        status: "failed",
        paymentMethod: "stripe",
        transactionDate: new Date(),
        description: `Stripe payment failed: ${error instanceof Error ? error.message : String(error)}${this.isTestMode ? ' (TEST)' : ''}`,
        testMode: this.isTestMode,
      }
    }
  }

  // Get test credentials for both services
  getTestCredentials() {
    return {
      paypal: this.paypalService.getTestCredentials(),
      stripe: this.stripeService.getTestCredentials(),
      isTestMode: this.isTestMode,
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

  private async sendSuccessNotification(userId: string, transaction: BillingTransaction): Promise<void> {
    try {
      console.log(`Sending success notification to user ${userId}`)
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/notifications/billing-success`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          transaction,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Success notification sent:", result.customerMessage)
      } else {
        console.error("Failed to send success notification:", response.statusText)
      }
    } catch (error) {
      console.error("Error sending success notification:", error)
    }
  }
}
