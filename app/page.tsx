export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing Dashboard</h1>
          <button className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
            Refresh
          </button>
        </div>

        {/* Top Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Wallet Balance</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">$25.50</div>
            <div className="text-sm text-gray-500">Available credits</div>
          </div>

          {/* Next Billing */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Next Billing</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">01/02/2024</div>
            <div className="text-sm text-gray-500">$29.99 due</div>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Subscription</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="mb-2">
              <span className="inline-block bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
                active
              </span>
            </div>
            <div className="text-sm text-gray-500">plan_premium</div>
          </div>
        </div>

        {/* Next Payment Preview */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center mb-4">
            <span className="text-xl font-bold text-gray-900 mr-2">$</span>
            <h2 className="text-xl font-bold text-gray-900">Next Payment Preview</h2>
          </div>
          <p className="text-gray-600 mb-6">How your next subscription payment will be processed</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Payment Method:</span>
              <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded-full transition duration-200">
                Wallet + PayPal
              </button>
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From Wallet:</span>
                <span className="font-medium text-gray-900">$25.50</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From PayPal:</span>
                <span className="font-medium text-gray-900">$4.49</span>
              </div>
              
              <hr className="my-3" />
              
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">$29.99</span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Billing Process */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Test Billing Process</h2>
          <p className="text-gray-600 mb-6">Manually trigger the billing process for testing</p>
          
          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition duration-200">
            Run Billing Process
          </button>
        </div>
      </div>
    </div>
  )
} 