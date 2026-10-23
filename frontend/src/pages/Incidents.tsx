/**
 * Incidents Page — SOC Incident Response
 */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Search, Plus } from 'lucide-react'
import { incidentsAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

interface Incident {
  id: string; incident_id: string; title: string; severity: string;
  status: string; source: string; created_at: string; assigned_to: { username: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  new: '#ef4444', investigating: '#f59e0b', contained: '#3b82f6',
  eradicated: '#8b5cf6', recovered: '#10b981', resolved: '#10b981', closed: '#6b7280',
}
const SEV_STYLES: Record<string, string> = {
  critical: 'badge-critical', high: 'badge-high', medium: 'badge-medium', low: 'badge-low'
}

export default function IncidentsPage() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await incidentsAPI.list(search ? { search } : {})
        setIncidents(data.results || data)
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [search])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <Zap size={20} color="#7c3aed" />
            INCIDENT RESPONSE
          </h1>
          <p className="text-xs font-mono text-gray-500 mt-0.5">SOC INCIDENT MANAGEMENT & RESPONSE WORKFLOW</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="cyber-input pl-9"
          placeholder="Search incidents..."
        />
      </div>

      {/* Incidents list */}
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => <div key={i} className="glass-card h-20 animate-pulse" />)
        ) : incidents.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">NO INCIDENTS REQUIRING ATTENTION</p>
          </div>
        ) : (
          incidents.map((inc) => (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-5 flex items-center gap-4 cursor-pointer hover:border-cyan-400/30 transition-all"
              onClick={() => navigate(`/incidents/${inc.id}`)}
            >
              <div className="shrink-0">
                <span className={SEV_STYLES[inc.severity] || 'badge-info'}>
                  {inc.severity.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-500">{inc.incident_id}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{ color: STATUS_COLORS[inc.status] || '#6b7280', background: `${STATUS_COLORS[inc.status] || '#6b7280'}15` }}>
                    {inc.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-200 truncate">{inc.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">{inc.source || 'Unknown source'}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-600 font-mono">
                  {new Date(inc.created_at).toLocaleDateString()}
                </p>
                {inc.assigned_to && (
                  <p className="text-xs text-gray-500 mt-0.5">{inc.assigned_to.username}</p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
