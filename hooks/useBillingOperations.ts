"use client"

import { useCallback } from "react"
import { useBilling } from "../context/BillingContext"
import { BillingService } from "../services/BillingService"
import { BillingCron } from "../services/BillingCron"
import type { PaymentPreview } from "../types/billing"

export function useBillingOperations() {
  const { state, dispatch } = useBilling()
  const billingService = new BillingService()
  const billingCron = new BillingCron()

  const loadBillingData = useCallback(
    async (userId: string) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })
        dispatch({ type: "SET_ERROR", payload: null })

        const [wallet, subscription] = await Promise.all([
          billingService.getUserWallet(userId),
          billingService.getActiveSubscription(userId),
        ])

        if (wallet) {
          dispatch({ type: "SET_WALLET", payload: wallet })
        }

        if (subscription) {
          dispatch({ type: "SET_SUBSCRIPTION", payload: subscription })
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error instanceof Error ? error.message : "Failed to load billing data",
        })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [billingService],
  )

  const processBilling = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })
      dispatch({ type: "SET_BILLING_RESULT", payload: null })

      const result = await billingCron.processAllSubscriptions()
      dispatch({ type: "SET_BILLING_RESULT", payload: result })

      if (result.success && result.results) {
        // Update wallet balance based on successful transactions
        const successfulTransactions = result.results.filter((r) => r.status === "success" && r.transaction)

        if (successfulTransactions.length > 0) {
          const transaction = successfulTransactions[0].transaction!
          if (transaction.walletAmount > 0) {
            const newBalance = billingService.getWalletBalance()
            dispatch({ type: "UPDATE_WALLET_BALANCE", payload: newBalance })
          }
          dispatch({ type: "ADD_TRANSACTION", payload: transaction })
        }
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Billing process failed"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      return {
        success: false,
        error: errorMessage,
        message: "Billing process failed",
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [billingCron, billingService])

  const getPaymentPreview = useCallback((): PaymentPreview | null => {
    if (!state.wallet || !state.subscription) return null

    const subscriptionAmount = state.subscription.amount
    const walletBalance = state.wallet.balance

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
  }, [state.wallet, state.subscription])

  return {
    ...state,
    loadBillingData,
    processBilling,
    getPaymentPreview,
  }
}
