"use client"

import { useEffect } from "react"
import { useBillingOperations } from "../hooks/useBillingOperations"
import { WalletCard } from "./WalletCard"
import { SubscriptionCard } from "./SubscriptionCard"
import { PaymentPreviewCard } from "./PaymentPreviewCard"
import { BillingProcessCard } from "./BillingProcessCard"
import { LoadingSpinner } from "./LoadingSpinner"
import { ErrorMessage } from "./ErrorMessage"

interface BillingDashboardProps {
  userId?: string
}

export function BillingDashboard({ userId = "user_123" }: BillingDashboardProps) {
  const { wallet, subscription, loading, error, loadBillingData, getPaymentPreview } = useBillingOperations()

  useEffect(() => {
    loadBillingData(userId)
  }, [userId, loadBillingData])

  const paymentPreview = getPaymentPreview()

  if (loading && !wallet && !subscription) {
    return <LoadingSpinner />
  }

  if (error && !wallet && !subscription) {
    return <ErrorMessage message={error} onRetry={() => loadBillingData(userId)} />
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing Dashboard</h1>
        <button
          onClick={() => loadBillingData(userId)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WalletCard wallet={wallet} />
        <SubscriptionCard subscription={subscription} />
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Status</h3>
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
          </div>
          <div className="text-2xl font-bold">{subscription?.status === "active" ? "Active" : "Inactive"}</div>
          <p className="text-xs text-gray-500 mt-1">{subscription?.planId || "No plan"}</p>
        </div>
      </div>

      {paymentPreview && <PaymentPreviewCard paymentPreview={paymentPreview} subscription={subscription} />}

      <BillingProcessCard />
    </div>
  )
}
