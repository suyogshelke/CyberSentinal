import React from 'react'
import { BookOpen } from 'lucide-react'
export default function AuditLogsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <BookOpen size={20} color="#6b7280" />
          AUDIT LOGS
        </h1>
        <p className="text-xs font-mono text-gray-500 mt-0.5">IMMUTABLE SYSTEM ACTIVITY AUDIT TRAIL</p>
      </div>
      <div className="glass-card p-12 flex items-center justify-center">
        <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">
          LOADING AUDIT LOGS...
        </p>
      </div>
    </div>
  )
}
