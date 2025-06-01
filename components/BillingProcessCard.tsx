"use client"
import { useBillingOperations } from "../hooks/useBillingOperations"

export function BillingProcessCard() {
  const { loading, billingResult, processBilling } = useBillingOperations()

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Test Billing Process</h2>
        <p className="text-gray-600">Manually trigger the billing process for testing</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={processBilling}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : "Run Billing Process"}
        </button>

        {billingResult && (
          <div
            className={`p-4 rounded ${
              billingResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-lg ${billingResult.success ? "text-green-600" : "text-red-600"}`}>
                {billingResult.success ? "✅" : "❌"}
              </span>
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
          </div>
        )}
      </div>
    </div>
  )
}
