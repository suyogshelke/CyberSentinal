/**
 * SIEM Dashboard — Security Information & Event Management
 */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Search, Filter } from 'lucide-react'
import { eventsAPI } from '../services/api'
import LiveEventFeed from '../components/ui/LiveEventFeed'
import { CyberWebSocket } from '../services/websocket'
import EventsChart from '../components/charts/EventsChart'

interface SecurityEvent {
  id: string; event_type: string; severity: string; category: string;
  message: string; source_ip: string | null; source: string; timestamp: string; risk_score: number
}

export default function SIEMPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const params: Record<string, string> = {}
        if (search) params.search = search
        if (severityFilter) params.severity = severityFilter
        const { data } = await eventsAPI.list(params)
        setEvents(data.results || data)
      } catch {} finally { setLoading(false) }
    }
    loadEvents()
  }, [search, severityFilter])

  useEffect(() => {
    const ws = new CyberWebSocket('/ws/events/', (msg: unknown) => {
      const data = msg as { type: string; data: SecurityEvent }
      if (data.type === 'security_event') {
        setEvents((prev) => [data.data, ...prev.slice(0, 199)])
      }
    })
    ws.connect()
    return () => ws.disconnect()
  }, [])

  const countBySeverity = (sev: string) => events.filter((e) => e.severity === sev).length

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <Activity size={20} color="#3b82f6" />
          SECURITY INFORMATION & EVENT MANAGEMENT
        </h1>
        <p className="text-xs font-mono text-gray-500 mt-0.5">REAL-TIME SECURITY EVENT MONITORING & ANALYSIS</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total Events', count: events.length, color: '#00d4ff' },
          { label: 'Critical', count: countBySeverity('critical'), color: '#ff3040' },
          { label: 'High', count: countBySeverity('high'), color: '#f97316' },
          { label: 'Medium', count: countBySeverity('medium'), color: '#f59e0b' },
          { label: 'Low', count: countBySeverity('low'), color: '#3b82f6' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs font-mono text-gray-500 uppercase mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live feed */}
        <div className="xl:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono tracking-widest text-gray-500 uppercase">LIVE EVENT STREAM</p>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="cyber-input pl-7 h-8 text-xs w-48"
                  placeholder="Search events..."
                />
              </div>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="cyber-input h-8 text-xs w-32"
              >
                <option value="">All Severity</option>
                {['critical', 'high', 'medium', 'low', 'info'].map((s) => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-800/50 rounded animate-pulse" />)}
            </div>
          ) : (
            <LiveEventFeed events={events} maxHeight={500} />
          )}
        </div>

        {/* Event breakdown */}
        <div className="glass-card p-6">
          <p className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-4">EVENT TIMELINE</p>
          <EventsChart />

          <div className="mt-4 space-y-2">
            {events.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center gap-3 text-xs">
                <span className="w-2 h-2 rounded-full shrink-0" style={{
                  background: e.severity === 'critical' ? '#ff3040' : e.severity === 'high' ? '#f97316' : '#f59e0b'
                }} />
                <span className="font-mono text-gray-500">{new Date(e.timestamp).toLocaleTimeString()}</span>
                <span className="text-gray-400 truncate">{e.event_type.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
