"use client"

import { useState } from "react"
import { useToast } from "@/hooks/useToast"
import { ToastContainer } from "@/components/Toast"
import TestCredentials from "@/components/TestCredentials"

interface WalletData {
  balance: number
  currency: string
}

interface SubscriptionData {
  amount: number
  nextBillingDate: string
  status: string
  planId: string
}

interface BillingResult {
  success: boolean
  message?: string
  results?: any[]
  error?: string
  totalProcessed?: number
  successful?: number
  failed?: number
  customerMessage?: string
}

export default function HomePage() {
  const [wallet, setWallet] = useState<WalletData>({ balance: 55.5, currency: "USD" })
  const [subscription, setSubscription] = useState<SubscriptionData>({
    amount: 29.99,
    nextBillingDate: "2024-02-01",
    status: "active",
    planId: "plan_premium",
  })
  const [loading, setLoading] = useState(false)
  const [billingResult, setBillingResult] = useState<BillingResult | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'stripe'>('paypal')
  const { toasts, removeToast, showSuccess, showError } = useToast()

  const getPaymentPreview = () => {
    const subscriptionAmount = subscription.amount
    const walletBalance = wallet.balance

    if (walletBalance >= subscriptionAmount) {
      return {
        method: "Wallet Only",
        walletAmount: subscriptionAmount,
        externalAmount: 0,
        externalMethod: selectedPaymentMethod,
      }
    } else if (walletBalance > 0) {
      return {
        method: `Wallet + ${selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)}`,
        walletAmount: walletBalance,
        externalAmount: subscriptionAmount - walletBalance,
        externalMethod: selectedPaymentMethod,
      }
    } else {
      return {
        method: `${selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)} Only`,
        walletAmount: 0,
        externalAmount: subscriptionAmount,
        externalMethod: selectedPaymentMethod,
      }
    }
  }

  const runBillingProcess = async () => {
    try {
      setLoading(true)
      setBillingResult(null)

      console.log(`Starting billing process with ${selectedPaymentMethod}...`)

      const response = await fetch("/api/billing/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferredPaymentMethod: selectedPaymentMethod
        }),
      })

      const result = await response.json()
      console.log("Billing result:", result)

      setBillingResult(result)

      if (result.success) {
        // Show success toast with customer message
        if (result.customerMessage) {
          showSuccess(`Your subscription has been renewed successfully!\n\nAmount: $${subscription.amount.toFixed(2)}\nPayment Method: ${selectedPaymentMethod}\nThank you for being a valued customer!`)
        } else {
          showSuccess(`Billing processed successfully via ${selectedPaymentMethod}!`)
        }
        
        const successfulTransactions = result.results?.filter((r: any) => r.status === "success") || []
        if (successfulTransactions.length > 0) {
          const transaction = successfulTransactions[0].transaction
          if (transaction.walletAmount > 0) {
            setWallet((prev) => ({
              ...prev,
              balance: Math.max(0, prev.balance - transaction.walletAmount),
            }))
          }
        }
      } else {
        // Show error toast
        showError(result.error || "Billing failed. Please try again.")
      }
    } catch (error) {
      console.error("Error processing billing:", error)
      showError("Network error occurred. Please check your connection and try again.")
      setBillingResult({
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const paymentPreview = getPaymentPreview()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Billing Dashboard</h1>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Test Credentials */}
        <TestCredentials />

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-700">Wallet Balance</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">${wallet.balance.toFixed(2)}</div>
            <p className="text-sm text-gray-500">Available credits</p>
          </div>

          {/* Next Billing */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-700">Next Billing</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">01/02/2024</div>
            <p className="text-sm text-gray-500">${subscription.amount.toFixed(2)} due</p>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-700">Subscription</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="mb-2">
              <span className="inline-flex px-2 py-1 text-sm font-medium bg-gray-900 text-white rounded">
                {subscription.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">{subscription.planId}</p>
          </div>
        </div>

        {/* Payment Preview */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">$ Next Payment Preview</h2>
            <p className="text-sm text-gray-600">How your next subscription payment will be processed</p>
          </div>

          {/* Payment Method Selector */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Payment Method for External Payments
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedPaymentMethod('paypal')}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                  selectedPaymentMethod === 'paypal'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="font-medium">PayPal</span>
                {selectedPaymentMethod === 'paypal' && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={() => setSelectedPaymentMethod('stripe')}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                  selectedPaymentMethod === 'stripe'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="font-medium">Stripe</span>
                {selectedPaymentMethod === 'stripe' && (
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Payment Method:</span>
              <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {paymentPreview.method}
              </span>
            </div>

            {paymentPreview.walletAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From Wallet:</span>
                <span className="font-medium text-gray-900">${paymentPreview.walletAmount.toFixed(2)}</span>
              </div>
            )}

            {paymentPreview.externalAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From {selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)}:</span>
                <span className="font-medium text-gray-900">${paymentPreview.externalAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-semibold text-gray-900">${subscription.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Run Billing Process - Main Action */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">💰 Subscription Billing</h2>
            <p className="text-gray-600">Process all pending subscription payments automatically</p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={runBillingProcess}
              disabled={loading}
              className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-4 px-8 rounded-lg font-bold text-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg min-w-[300px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Processing Payments...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>Run Billing Process</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Automatically processes payments using wallet balance first, then {selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)}</p>
          </div>

          {billingResult && (
            <div className={`mt-6 p-4 rounded-lg border ${
              billingResult.success 
                ? "bg-green-50 border-green-200" 
                : "bg-red-50 border-red-200"
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  billingResult.success ? "bg-green-500" : "bg-red-500"
                }`}>
                  {billingResult.success ? (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`font-medium ${
                  billingResult.success ? "text-green-800" : "text-red-800"
                }`}>
                  {billingResult.success ? "Billing Successful" : "Billing Failed"}
                </span>
              </div>

              <p className={`text-sm ${
                billingResult.success ? "text-green-700" : "text-red-700"
              }`}>
                {billingResult.message || billingResult.error}
              </p>

              {billingResult.success && billingResult.customerMessage && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">📧 Customer Notification:</h4>
                  <pre className="text-sm text-green-700 whitespace-pre-wrap font-sans">
                    {billingResult.customerMessage}
                  </pre>
                </div>
              )}

              {billingResult.success && billingResult.totalProcessed && (
                <div className="mt-2 text-sm text-green-700">
                  <p>Total Processed: {billingResult.totalProcessed}</p>
                  <p>Successful: {billingResult.successful}</p>
                  <p>Failed: {billingResult.failed}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 