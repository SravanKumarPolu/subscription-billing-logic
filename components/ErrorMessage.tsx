"use client"

interface ErrorMessageProps {
  message: string
  onRetry: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded p-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-red-600 text-lg">❌</span>
          <span className="font-medium text-red-800">Error Loading Billing Data</span>
        </div>
        <p className="text-red-600 mb-4">{message}</p>
        <button onClick={onRetry} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Try Again
        </button>
      </div>
    </div>
  )
}
