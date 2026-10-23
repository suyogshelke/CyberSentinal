import React from 'react'
import { GitBranch } from 'lucide-react'
export default function DevSecOpsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <GitBranch size={20} color="#3b82f6" />
          DEVSECOPS SECURITY
        </h1>
        <p className="text-xs font-mono text-gray-500 mt-0.5">CI/CD PIPELINE SECURITY INTEGRATION</p>
      </div>
      <div className="glass-card p-12 flex items-center justify-center">
        <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">
          LOADING DEVSECOPS SECURITY...
        </p>
      </div>
    </div>
  )
}
