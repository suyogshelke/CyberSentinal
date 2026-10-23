import React from 'react'
import { Settings } from 'lucide-react'
export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <Settings size={20} color="#00d4ff" />
          SECURITY SETTINGS
        </h1>
        <p className="text-xs font-mono text-gray-500 mt-0.5">PLATFORM CONFIGURATION & PREFERENCES</p>
      </div>
      <div className="glass-card p-12 flex items-center justify-center">
        <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">
          LOADING SECURITY SETTINGS...
        </p>
      </div>
    </div>
  )
}
