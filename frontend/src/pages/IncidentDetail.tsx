import React from 'react'
import { Zap } from 'lucide-react'
export default function IncidentDetailPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <Zap size={20} color="#7c3aed" />
          INCIDENT DETAIL
        </h1>
        <p className="text-xs font-mono text-gray-500 mt-0.5">TIMELINE & INVESTIGATION</p>
      </div>
      <div className="glass-card p-12 flex items-center justify-center">
        <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">
          LOADING INCIDENT DETAIL...
        </p>
      </div>
    </div>
  )
}
