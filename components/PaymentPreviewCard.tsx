import type { PaymentPreview, Subscription } from "../types/billing"

interface PaymentPreviewCardProps {
  paymentPreview: PaymentPreview
  subscription: Subscription | null
}

export function PaymentPreviewCard({ paymentPreview, subscription }: PaymentPreviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-bold flex items-center space-x-2">
          <span>💰</span>
          <span>Next Payment Preview</span>
        </h2>
        <p className="text-gray-600">How your next subscription payment will be processed</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Payment Method:</span>
          <span className={`px-2 py-1 rounded text-white text-sm ${paymentPreview.color}`}>
            {paymentPreview.method}
          </span>
        </div>

        {paymentPreview.walletAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">From Wallet:</span>
            <span className="font-medium">${paymentPreview.walletAmount.toFixed(2)}</span>
          </div>
        )}

        {paymentPreview.paypalAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">From PayPal:</span>
            <span className="font-medium">${paymentPreview.paypalAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t pt-2">
          <div className="flex items-center justify-between font-bold">
            <span>Total:</span>
            <span>${subscription?.amount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
