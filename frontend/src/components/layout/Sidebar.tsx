/**
 * Sidebar — futuristic collapsible navigation
 */
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Shield, Globe, Lock, AlertTriangle,
  Activity, Brain, GitBranch, FileText, Settings,
  ChevronLeft, ChevronRight, Server, Eye, Zap,
  Bug, Network, BookOpen, Bell, Target, Cpu
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

interface NavItem {
  label: string
  icon: React.ReactNode
  to: string
}

interface NavSection {
  section: string
  items: NavItem[]
}

const NAV: NavSection[] = [
  {
    section: 'COMMAND CENTER',
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard size={16} />, to: '/dashboard' },
    ],
  },
  {
    section: 'SECURITY',
    items: [
      { label: 'Assets', icon: <Server size={16} />, to: '/assets' },
      { label: 'Web Scanner', icon: <Globe size={16} />, to: '/scanner' },
      { label: 'API Security', icon: <Lock size={16} />, to: '/api-security' },
      { label: 'Vulnerabilities', icon: <Bug size={16} />, to: '/vulnerabilities' },
      { label: 'Security Events', icon: <Activity size={16} />, to: '/siem' },
    ],
  },
  {
    section: 'THREAT OPERATIONS',
    items: [
      { label: 'Threat Intel', icon: <Target size={16} />, to: '/threat-intelligence' },
      { label: 'Incidents', icon: <AlertTriangle size={16} />, to: '/incidents' },
    ],
  },
  {
    section: 'DEVSECOPS',
    items: [
      { label: 'CI/CD Security', icon: <GitBranch size={16} />, to: '/devsecops' },
    ],
  },
  {
    section: 'INTELLIGENCE',
    items: [
      { label: 'AI Analyst', icon: <Brain size={16} />, to: '/ai-analyst' },
      { label: 'Reports', icon: <FileText size={16} />, to: '/reports' },
    ],
  },
  {
    section: 'SYSTEM',
    items: [
      { label: 'Audit Logs', icon: <BookOpen size={16} />, to: '/audit' },
      { label: 'Settings', icon: <Settings size={16} />, to: '/settings' },
    ],
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { logout, refreshToken } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      if (refreshToken) await authAPI.logout(refreshToken)
    } catch {}
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-full shrink-0 overflow-hidden"
      style={{
        background: 'rgba(8,12,20,0.95)',
        borderRight: '1px solid rgba(0,212,255,0.1)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Icon */}
          <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <Shield size={16} color="#00d4ff" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-sm tracking-[0.2em] uppercase whitespace-nowrap overflow-hidden"
                style={{ color: '#00d4ff' }}
              >
                CYBER<span className="text-white">SENTINEL</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1">
        {NAV.map((section) => (
          <div key={section.section} className="mb-2">
            {/* Section header */}
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 pb-1 text-xs font-mono tracking-widest"
                  style={{ color: 'rgba(0,212,255,0.35)' }}
                >
                  {section.section}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Items */}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 mx-2 px-2 py-2 rounded-lg text-sm transition-all duration-150 group relative ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #00d4ff' : '2px solid transparent',
                })}
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="shrink-0 transition-colors"
                      style={{ color: isActive ? '#00d4ff' : undefined }}
                    >
                      {item.icon}
                    </span>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="whitespace-nowrap text-xs font-medium tracking-wide overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {/* Active glow dot */}
                    {isActive && (
                      <motion.div
                        className="absolute right-2 w-1.5 h-1.5 rounded-full"
                        style={{ background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-5 -right-3 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors"
        style={{
          background: '#0d1520',
          border: '1px solid rgba(0,212,255,0.3)',
          color: '#00d4ff',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  )
}
