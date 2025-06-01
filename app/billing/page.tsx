"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, CreditCard, Calendar, DollarSign, AlertCircle, CheckCircle } from "lucide-react"

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
  message: string
  results?: any[]
  error?: string
  totalProcessed?: number
  successful?: number
  failed?: number
}

export default function BillingDashboard() {
  const [wallet, setWallet] = useState<WalletData>({ balance: 25.5, currency: "USD" })
  const [subscription, setSubscription] = useState<SubscriptionData>({
    amount: 29.99,
    nextBillingDate: "2024-02-01",
    status: "active",
    planId: "plan_premium",
  })
  const [loading, setLoading] = useState(false)
  const [billingResult, setBillingResult] = useState<BillingResult | null>(null)

  const getPaymentPreview = () => {
    const subscriptionAmount = subscription.amount
    const walletBalance = wallet.balance

    if (walletBalance >= subscriptionAmount) {
      return {
        method: "Wallet Only",
        walletAmount: subscriptionAmount,
        paypalAmount: 0,
        color: "bg-green-500",
      }
    } else if (walletBalance > 0) {
      return {
        method: "Wallet + PayPal",
        walletAmount: walletBalance,
        paypalAmount: subscriptionAmount - walletBalance,
        color: "bg-blue-500",
      }
    } else {
      return {
        method: "PayPal Only",
        walletAmount: 0,
        paypalAmount: subscriptionAmount,
        color: "bg-orange-500",
      }
    }
  }

  const runBillingProcess = async () => {
    try {
      setLoading(true)
      setBillingResult(null)

      console.log("Starting billing process...")

      const response = await fetch("/api/billing/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()
      console.log("Billing result:", result)

      setBillingResult(result)

      if (result.success) {
        // Update wallet balance based on successful transactions
        const successfulTransactions = result.results?.filter((r: any) => r.status === "success") || []
        if (successfulTransactions.length > 0) {
          // Simulate wallet balance update
          const transaction = successfulTransactions[0].transaction
          if (transaction.walletAmount > 0) {
            setWallet((prev) => ({
              ...prev,
              balance: Math.max(0, prev.balance - transaction.walletAmount),
            }))
          }
        }
      }
    } catch (error) {
      console.error("Error processing billing:", error)
      setBillingResult({
        success: false,
        error: `Network error: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const paymentPreview = getPaymentPreview()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing Dashboard</h1>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available credits</p>
          </CardContent>
        </Card>

        {/* Next Billing */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(subscription.nextBillingDate).toLocaleDateString()}</div>
            <p className="text-xs text-muted-foreground">${subscription.amount.toFixed(2)} due</p>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={subscription.status === "active" ? "default" : "secondary"}>{subscription.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{subscription.planId}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Next Payment Preview</span>
          </CardTitle>
          <CardDescription>How your next subscription payment will be processed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Payment Method:</span>
              <Badge className={paymentPreview.color}>{paymentPreview.method}</Badge>
            </div>

            {paymentPreview.walletAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">From Wallet:</span>
                <span className="font-medium">${paymentPreview.walletAmount.toFixed(2)}</span>
              </div>
            )}

            {paymentPreview.paypalAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">From PayPal:</span>
                <span className="font-medium">${paymentPreview.paypalAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t pt-2">
              <div className="flex items-center justify-between font-bold">
                <span>Total:</span>
                <span>${subscription.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Process */}
      <Card>
        <CardHeader>
          <CardTitle>Test Billing Process</CardTitle>
          <CardDescription>Manually trigger the billing process for testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runBillingProcess} className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Run Billing Process"}
          </Button>

          {billingResult && (
            <Card className={billingResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  {billingResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${billingResult.success ? "text-green-800" : "text-red-800"}`}>
                    {billingResult.success ? "Billing Successful" : "Billing Failed"}
                  </span>
                </div>

                <p className={`text-sm ${billingResult.success ? "text-green-700" : "text-red-700"}`}>
                  {billingResult.message || billingResult.error}
                </p>

                {billingResult.success && billingResult.totalProcessed && (
                  <div className="mt-2 text-sm text-green-700">
                    <p>Total Processed: {billingResult.totalProcessed}</p>
                    <p>Successful: {billingResult.successful}</p>
                    <p>Failed: {billingResult.failed}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
