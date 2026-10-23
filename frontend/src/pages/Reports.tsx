import React from 'react'
import { FileText } from 'lucide-react'
export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <FileText size={20} color="#f59e0b" />
          SECURITY REPORTS
        </h1>
        <p className="text-xs font-mono text-gray-500 mt-0.5">EXECUTIVE, TECHNICAL & COMPLIANCE REPORTING</p>
      </div>
      <div className="glass-card p-12 flex items-center justify-center">
        <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">
          LOADING SECURITY REPORTS...
        </p>
      </div>
    </div>
  )
}
