import React from 'react'
import { Server } from 'lucide-react'
export default function AssetsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <Server size={20} color="#00d4ff" />
          ASSET MANAGEMENT
        </h1>
        <p className="text-xs font-mono text-gray-500 mt-0.5">INFRASTRUCTURE REGISTRY & RISK TRACKING</p>
      </div>
      <div className="glass-card p-12 flex items-center justify-center">
        <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">
          LOADING ASSET MANAGEMENT...
        </p>
      </div>
    </div>
  )
}
