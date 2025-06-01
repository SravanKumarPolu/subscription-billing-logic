export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: "active" | "cancelled" | "past_due" | "paused"
  amount: number
  currency: string
  billingCycle: "monthly" | "yearly"
  nextBillingDate: Date
  paypalSubscriptionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface BillingTransaction {
  id: string
  userId: string
  subscriptionId: string
  amount: number
  walletAmount: number
  paypalAmount: number
  status: "success" | "failed" | "pending"
  paymentMethod: "wallet" | "paypal" | "wallet_paypal"
  transactionDate: Date
  description: string
}

export interface Plan {
  id: string
  name: string
  price: number
  currency: string
  features: string[]
  billingCycle: "monthly" | "yearly"
}

export interface PaymentPreview {
  method: string
  walletAmount: number
  paypalAmount: number
  color: string
}

export interface BillingResult {
  success: boolean
  message: string
  results?: Array<{
    userId: string
    status: "success" | "failed"
    transaction?: BillingTransaction
    error?: string
  }>
  error?: string
  totalProcessed?: number
  successful?: number
  failed?: number
}
