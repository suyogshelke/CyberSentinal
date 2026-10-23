/**
 * TopBar — navigation header with system status
 */
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, User, Search, LogOut, Activity, Shield, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface TopBarProps {
  wsStatus?: 'connected' | 'disconnected' | 'reconnecting'
}

export default function TopBar({ wsStatus = 'connected' }: TopBarProps) {
  const { user, logout, refreshToken } = useAuthStore()
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      if (refreshToken) await authAPI.logout(refreshToken)
    } catch {}
    logout()
    navigate('/login')
    toast.success('Session terminated')
  }

  const wsColor = wsStatus === 'connected' ? '#10b981' : wsStatus === 'reconnecting' ? '#f59e0b' : '#ef4444'
  const wsLabel = wsStatus === 'connected' ? 'LIVE' : wsStatus === 'reconnecting' ? 'RECONNECTING' : 'OFFLINE'

  return (
    <header
      className="flex items-center justify-between h-14 px-6 shrink-0"
      style={{
        background: 'rgba(8,12,20,0.9)',
        borderBottom: '1px solid rgba(0,212,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Left: System status */}
      <div className="flex items-center gap-6">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ background: wsColor }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs font-mono tracking-widest" style={{ color: wsColor }}>
            {wsLabel}
          </span>
        </div>

        {/* System status */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-500">
          <Activity size={12} />
          <span>SYSTEMS OPERATIONAL</span>
        </div>
      </div>

      {/* Center: Search shortcut */}
      <button
        className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-lg text-xs text-gray-500 transition-colors hover:text-gray-300"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        onClick={() => {/* Command palette */}}
      >
        <Search size={12} />
        <span>Search or command...</span>
        <kbd className="px-1 py-0.5 rounded text-xs"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          ⌘K
        </kbd>
      </button>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ background: '#ef4444' }}
          />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 transition-colors"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.15)' }}>
              <User size={12} color="#00d4ff" />
            </div>
            <span className="hidden sm:block max-w-24 truncate">{user?.username || 'User'}</span>
            <span className="hidden sm:block px-1 py-0.5 rounded text-xs"
              style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>
              {user?.role?.replace('_', ' ')}
            </span>
            <ChevronDown size={12} />
          </button>

          {/* Dropdown */}
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 rounded-xl py-1 z-50"
              style={{
                background: '#0d1520',
                border: '1px solid rgba(0,212,255,0.15)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
                <p className="text-xs font-medium text-gray-300 truncate">{user?.email}</p>
                <p className="text-xs text-gray-600 truncate">{user?.role}</p>
              </div>
              <button
                onClick={() => { navigate('/settings'); setShowProfile(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors"
              >
                <Shield size={12} />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
              >
                <LogOut size={12} />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  )
}
