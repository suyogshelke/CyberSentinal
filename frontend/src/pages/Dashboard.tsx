/**
 * Dashboard — Security Command Center
 */
import React, { useEffect, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, AlertTriangle, Bug, Activity, Server,
  TrendingUp, Eye, Zap, Clock, RefreshCw
} from 'lucide-react'
import { dashboardAPI } from '../services/api'
import { CyberWebSocket } from '../services/websocket'
import LiveEventFeed from '../components/ui/LiveEventFeed'
import SecurityGauge from '../components/charts/SecurityGauge'
import VulnerabilityChart from '../components/charts/VulnerabilityChart'
import EventsChart from '../components/charts/EventsChart'

const SecurityCore = lazy(() => import('../components/3d/SecurityCore'))

// ── Metric card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  color?: string
  trend?: string
  critical?: boolean
}

function MetricCard({ label, value, icon, color = '#00d4ff', trend, critical }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const target = typeof value === 'number' ? value : 0
    let current = 0
    const step = Math.ceil(target / 30)
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setDisplayValue(current)
      if (current >= target) clearInterval(timer)
    }, 30)
    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass-card p-5 relative overflow-hidden group cursor-default"
    >
      {critical && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: 'rgba(255,48,64,0.2)' }}
        />
      )}
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `rgba(${hexToRgb(color)}, 0.1)`, border: `1px solid rgba(${hexToRgb(color)}, 0.3)` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        {trend && (
          <span className="text-xs text-gray-500">{trend}</span>
        )}
      </div>
      <p className="text-3xl font-bold tabular-nums" style={{ color }}>
        {typeof value === 'number' ? displayValue : value}
      </p>
      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-mono">{label}</p>
      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px opacity-50"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </motion.div>
  )
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : '0,212,255'
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
interface DashboardMetrics {
  security_score: number
  vulnerabilities: { critical: number; high: number; medium: number; low: number; informational: number }
  open_incidents: number
  total_assets: number
  active_scans: number
  events_24h: number
  critical_events_24h: number
  recent_events: SecurityEvent[]
  system_status: string
  generated_at: string
}

interface SecurityEvent {
  id: string
  event_type: string
  severity: string
  message: string
  source_ip: string | null
  timestamp: string
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [liveEvents, setLiveEvents] = useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadMetrics = async () => {
    try {
      const { data } = await dashboardAPI.getMetrics()
      setMetrics(data)
      setLiveEvents(data.recent_events || [])
      setLastUpdated(new Date())
    } catch {
      // Keep previous data on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
    const interval = setInterval(loadMetrics, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  // WebSocket for live events
  useEffect(() => {
    const ws = new CyberWebSocket('/ws/events/', (msg: unknown) => {
      const data = msg as { type: string; data: SecurityEvent }
      if (data.type === 'security_event') {
        setLiveEvents((prev) => [data.data, ...prev.slice(0, 49)])
      }
    })
    ws.connect()
    return () => ws.disconnect()
  }, [])

  // Security status based on score
  const status = !metrics ? 'normal'
    : metrics.security_score >= 80 ? 'secure'
    : metrics.security_score >= 60 ? 'normal'
    : metrics.security_score >= 40 ? 'warning'
    : 'critical'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">SECURITY OPERATIONS</h1>
          <p className="text-xs font-mono text-gray-500 mt-0.5">
            COMMAND CENTER — REAL-TIME SECURITY MONITORING
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-600">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={loadMetrics}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            aria-label="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Metrics grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Security Score"
              value={metrics?.security_score ?? 0}
              icon={<Shield size={18} />}
              color={status === 'secure' ? '#10b981' : status === 'warning' ? '#f59e0b' : status === 'critical' ? '#ff3040' : '#00d4ff'}
            />
            <MetricCard
              label="Active Threats"
              value={metrics?.critical_events_24h ?? 0}
              icon={<AlertTriangle size={18} />}
              color="#f97316"
              critical={(metrics?.critical_events_24h ?? 0) > 0}
            />
            <MetricCard
              label="Critical Vulns"
              value={metrics?.vulnerabilities.critical ?? 0}
              icon={<Bug size={18} />}
              color="#ff3040"
              critical={(metrics?.vulnerabilities.critical ?? 0) > 0}
            />
            <MetricCard
              label="Open Incidents"
              value={metrics?.open_incidents ?? 0}
              icon={<Zap size={18} />}
              color="#7c3aed"
            />
            <MetricCard
              label="Assets Monitored"
              value={metrics?.total_assets ?? 0}
              icon={<Server size={18} />}
              color="#00d4ff"
            />
            <MetricCard
              label="Events (24h)"
              value={metrics?.events_24h ?? 0}
              icon={<Activity size={18} />}
              color="#3b82f6"
            />
            <MetricCard
              label="Active Scans"
              value={metrics?.active_scans ?? 0}
              icon={<Eye size={18} />}
              color="#34d399"
            />
            <MetricCard
              label="High Vulns"
              value={metrics?.vulnerabilities.high ?? 0}
              icon={<TrendingUp size={18} />}
              color="#f59e0b"
            />
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Security Core + Gauge */}
            <div className="glass-card p-6 flex flex-col items-center justify-center gap-4">
              <p className="text-xs font-mono tracking-widest text-gray-500 uppercase self-start">
                SECURITY INTELLIGENCE CORE
              </p>
              <Suspense fallback={<div className="w-40 h-40 rounded-full border border-cyan-400/20 animate-pulse" />}>
                <SecurityCore status={status as 'normal' | 'warning' | 'critical' | 'secure'} size={180} />
              </Suspense>
              <SecurityGauge score={metrics?.security_score ?? 0} />
            </div>

            {/* Vulnerability breakdown */}
            <div className="glass-card p-6">
              <p className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-4">
                VULNERABILITY DISTRIBUTION
              </p>
              <VulnerabilityChart data={metrics?.vulnerabilities} />
            </div>

            {/* Live event feed */}
            <div className="glass-card p-6 overflow-hidden">
              <p className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-4">
                LIVE SECURITY FEED
              </p>
              <LiveEventFeed events={liveEvents} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
