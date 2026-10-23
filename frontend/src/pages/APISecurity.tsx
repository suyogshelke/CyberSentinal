import React from 'react'
import { Lock } from 'lucide-react'
export default function APISecurityPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <Lock size={20} color="#10b981" />
          API SECURITY SCANNER
        </h1>
        <p className="text-xs font-mono text-gray-500 mt-0.5">OPENAPI / SWAGGER SECURITY ANALYSIS</p>
      </div>
      <div className="glass-card p-12 flex items-center justify-center">
        <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">
          LOADING API SECURITY SCANNER...
        </p>
      </div>
    </div>
  )
}
