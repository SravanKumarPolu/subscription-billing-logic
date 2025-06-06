'use client'

import { useState, useEffect } from 'react'

interface TestCredentials {
  paypal: {
    environment: string
    testCustomer: {
      email: string
      password: string
      loginUrl: string
    }
    testCards: {
      visa: string
      mastercard: string
      amex: string
    }
  } | null
  stripe: {
    environment: string
    publishableKey: string
    testCards: {
      success: { number: string; description: string }
      declined: { number: string; description: string }
      insufficient_funds: { number: string; description: string }
      require_3ds: { number: string; description: string }
      processing_error: { number: string; description: string }
    }
    dashboardUrl: string
  } | null
  isTestMode: boolean
}

export default function TestCredentials() {
  const [credentials, setCredentials] = useState<TestCredentials | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchCredentials = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-credentials')
      const data = await response.json()
      
      if (data.success) {
        setCredentials(data.credentials)
      }
    } catch (error) {
      console.error('Failed to fetch test credentials:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && !credentials) {
      fetchCredentials()
    }
  }, [isOpen, credentials])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  if (!credentials?.isTestMode) {
    return null
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-yellow-600">🧪</span>
          <h3 className="text-lg font-semibold text-yellow-800">Test Mode Active</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-yellow-600 hover:text-yellow-800 font-medium"
        >
          {isOpen ? 'Hide' : 'Show'} Test Credentials
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-4 space-y-6">
          {loading ? (
            <div className="text-center py-4">Loading test credentials...</div>
          ) : (
            <>
              {/* PayPal Sandbox */}
              {credentials?.paypal && (
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    💳 PayPal Sandbox
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Test Customer Email
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                          {credentials.paypal.testCustomer.email}
                        </code>
                        <button
                          onClick={() => copyToClipboard(credentials.paypal!.testCustomer.email)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                          {credentials.paypal.testCustomer.password}
                        </code>
                        <button
                          onClick={() => copyToClipboard(credentials.paypal!.testCustomer.password)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Login URL
                      </label>
                      <a
                        href={credentials.paypal.testCustomer.loginUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        {credentials.paypal.testCustomer.loginUrl}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Stripe Test */}
              {credentials?.stripe && (
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    💳 Stripe Test Cards
                  </h4>
                  
                  <div className="space-y-3">
                    {Object.entries(credentials.stripe.testCards).map(([key, card]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {card.description}
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                            {card.number}
                          </code>
                          <button
                            onClick={() => copyToClipboard(card.number)}
                            className="text-purple-600 hover:text-purple-800 text-sm"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-700">
                        <strong>Common Test Data:</strong><br />
                        Expiry: 12/34 | CVV: 123 | ZIP: 10001
                      </p>
                    </div>
                    
                    <div>
                      <a
                        href={credentials.stripe.dashboardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 text-sm underline"
                      >
                        View Test Dashboard →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>⚠️ Important:</strong> This is test mode. No real money will be charged. 
                All transactions are simulated for development purposes.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
} 