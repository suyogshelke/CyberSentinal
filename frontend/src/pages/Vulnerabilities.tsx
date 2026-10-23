/**
 * Vulnerabilities Page — Full lifecycle vulnerability management
 */
import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bug, Search, Filter, ChevronDown, ExternalLink } from 'lucide-react'
import { vulnerabilitiesAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

interface Vulnerability {
  id: string; title: string; severity: string; status: string;
  asset: { name: string } | null; category: string; cvss_score: number | null;
  created_at: string; cve_id?: string
}

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low', 'informational']
const SEVERITY_STYLES: Record<string, string> = {
  critical: 'badge-critical', high: 'badge-high', medium: 'badge-medium',
  low: 'badge-low', informational: 'badge-info',
}
const STATUS_COLORS: Record<string, string> = {
  open: '#ef4444', investigating: '#f59e0b', accepted: '#6b7280',
  false_positive: '#6b7280', resolved: '#10b981', reopened: '#f97316',
}

export default function VulnerabilitiesPage() {
  const navigate = useNavigate()
  const [vulns, setVulns] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [counts, setCounts] = useState<Record<string, number>>({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (severityFilter) params.severity = severityFilter
      if (statusFilter) params.status = statusFilter
      const { data } = await vulnerabilitiesAPI.list(params)
      const items = data.results || data
      setVulns(items)

      // Count by severity
      const c: Record<string, number> = {}
      SEVERITY_ORDER.forEach((s) => { c[s] = items.filter((v: Vulnerability) => v.severity === s).length })
      setCounts(c)
    } catch {} finally { setLoading(false) }
  }, [search, severityFilter, statusFilter])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <Bug size={20} color="#ff3040" />
          VULNERABILITY MANAGEMENT
        </h1>
        <p className="text-xs font-mono text-gray-500 mt-0.5">TRACK, INVESTIGATE AND REMEDIATE SECURITY FINDINGS</p>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-5 gap-3">
        {SEVERITY_ORDER.map((sev) => {
          const colors: Record<string, string> = { critical: '#ff3040', high: '#f97316', medium: '#f59e0b', low: '#3b82f6', informational: '#6b7280' }
          return (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev === severityFilter ? '' : sev)}
              className={`glass-card p-4 text-center transition-all ${sev === severityFilter ? 'border-opacity-60' : ''}`}
              style={{ borderColor: sev === severityFilter ? colors[sev] : undefined }}
            >
              <p className="text-2xl font-bold tabular-nums" style={{ color: colors[sev] }}>
                {loading ? '—' : (counts[sev] ?? 0)}
              </p>
              <p className="text-xs font-mono text-gray-500 uppercase mt-1">{sev}</p>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cyber-input pl-9"
            placeholder="Search vulnerabilities..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="cyber-input w-40"
        >
          <option value="">All Status</option>
          {['open', 'investigating', 'accepted', 'false_positive', 'resolved'].map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
              {['Severity', 'Title', 'Asset', 'Category', 'CVSS', 'Status', 'Detected'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td></tr>
              ))
            ) : vulns.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-xs font-mono text-gray-600 uppercase">
                  NO VULNERABILITIES FOUND
                </td>
              </tr>
            ) : (
              vulns.map((v) => (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  onClick={() => navigate(`/vulnerabilities/${v.id}`)}
                >
                  <td className="px-4 py-3">
                    <span className={SEVERITY_STYLES[v.severity] || 'badge-info'}>
                      {v.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-200 max-w-xs truncate">{v.title}</span>
                      {v.cve_id && (
                        <span className="text-xs font-mono text-gray-500">{v.cve_id}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                    {v.asset?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{v.category || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono tabular-nums">
                    {v.cvss_score != null ? v.cvss_score.toFixed(1) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono" style={{ color: STATUS_COLORS[v.status] || '#6b7280' }}>
                      {v.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs font-mono">
                    {new Date(v.created_at).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
