import type { Wallet } from "../types/billing"

interface WalletCardProps {
  wallet: Wallet | null
}

export function WalletCard({ wallet }: WalletCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Wallet Balance</h3>
        <div className="w-4 h-4 bg-green-400 rounded"></div>
      </div>
      <div className="text-2xl font-bold">${wallet?.balance.toFixed(2) || "0.00"}</div>
      <p className="text-xs text-gray-500">Available credits</p>
    </div>
  )
}
