"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Wallet, Subscription, BillingTransaction, BillingResult } from "../types/billing"

interface BillingState {
  wallet: Wallet | null
  subscription: Subscription | null
  transactions: BillingTransaction[]
  loading: boolean
  error: string | null
  billingResult: BillingResult | null
}

type BillingAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_WALLET"; payload: Wallet }
  | { type: "SET_SUBSCRIPTION"; payload: Subscription }
  | { type: "ADD_TRANSACTION"; payload: BillingTransaction }
  | { type: "SET_BILLING_RESULT"; payload: BillingResult | null }
  | { type: "UPDATE_WALLET_BALANCE"; payload: number }

const initialState: BillingState = {
  wallet: null,
  subscription: null,
  transactions: [],
  loading: false,
  error: null,
  billingResult: null,
}

function billingReducer(state: BillingState, action: BillingAction): BillingState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_WALLET":
      return { ...state, wallet: action.payload }
    case "SET_SUBSCRIPTION":
      return { ...state, subscription: action.payload }
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] }
    case "SET_BILLING_RESULT":
      return { ...state, billingResult: action.payload }
    case "UPDATE_WALLET_BALANCE":
      return {
        ...state,
        wallet: state.wallet ? { ...state.wallet, balance: action.payload } : null,
      }
    default:
      return state
  }
}

const BillingContext = createContext<{
  state: BillingState
  dispatch: React.Dispatch<BillingAction>
} | null>(null)

export function BillingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(billingReducer, initialState)

  return <BillingContext.Provider value={{ state, dispatch }}>{children}</BillingContext.Provider>
}

export function useBilling() {
  const context = useContext(BillingContext)
  if (!context) {
    throw new Error("useBilling must be used within a BillingProvider")
  }
  return context
}
