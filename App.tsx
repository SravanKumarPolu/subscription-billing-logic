import { BillingProvider } from "./context/BillingContext"
import { BillingDashboard } from "./components/BillingDashboard"
import "./App.css"

function App() {
  return (
    <BillingProvider>
      <div className="min-h-screen bg-gray-100">
        <BillingDashboard userId="user_123" />
      </div>
    </BillingProvider>
  )
}

export default App
