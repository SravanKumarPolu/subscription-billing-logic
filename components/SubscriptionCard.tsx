import type { Subscription } from "../types/billing"

interface SubscriptionCardProps {
  subscription: Subscription | null
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Next Billing</h3>
        <div className="w-4 h-4 bg-blue-400 rounded"></div>
      </div>
      <div className="text-2xl font-bold">
        {subscription?.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : "N/A"}
      </div>
      <p className="text-xs text-gray-500">${subscription?.amount.toFixed(2) || "0.00"} due</p>
    </div>
  )
}
