/**
 * Threat Intelligence Page
 */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Search, AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react'
import { threatIntelAPI } from '../services/api'
import toast from 'react-hot-toast'

interface ThreatResult {
  id: string; indicator: string; ioc_type: string; threat_level: string; confidence: number;
  malicious_count: number; total_engines: number; sources: string[]; description: string;
  tags: string[]; first_seen: string | null; last_seen: string | null; last_checked: string
}

const THREAT_COLORS: Record<string, string> = {
  critical: '#ff3040', high: '#f97316', medium: '#f59e0b', low: '#3b82f6', unknown: '#6b7280', safe: '#10b981'
}

const IOC_TYPES = ['ip', 'domain', 'url', 'md5', 'sha1', 'sha256']

export default function ThreatIntelligencePage() {
  const [indicator, setIndicator] = useState('')
  const [iocType, setIocType] = useState('ip')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ThreatResult | null>(null)

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!indicator.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const { data } = await threatIntelAPI.lookup(indicator.trim(), iocType)
      setResult(data)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Lookup failed'
      toast.error(msg)
    } finally { setLoading(false) }
  }

  const threatColor = result ? (THREAT_COLORS[result.threat_level] || '#6b7280') : '#00d4ff'

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <Target size={20} color="#7c3aed" />
          THREAT INTELLIGENCE
        </h1>
        <p className="text-xs font-mono text-gray-500 mt-0.5">
          IOC LOOKUP — VIRUSTOTAL · ALIENVAULT OTX · ABUSEIPDB
        </p>
      </div>

      {/* Lookup form */}
      <div className="glass-card p-6">
        <form onSubmit={lookup} className="flex gap-3">
          <select
            value={iocType}
            onChange={(e) => setIocType(e.target.value)}
            className="cyber-input w-32 shrink-0"
          >
            {IOC_TYPES.map((t) => (
              <option key={t} value={t}>{t.toUpperCase()}</option>
            ))}
          </select>
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
              className="cyber-input pl-9"
              placeholder="Enter IP, domain, URL, or hash..."
              disabled={loading}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-cyber shrink-0">
            {loading ? (
              <motion.span className="flex items-center gap-2">
                <motion.span className="w-3 h-3 rounded-full border-t border-violet-400"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                ANALYZING...
              </motion.span>
            ) : 'ANALYZE IOC'}
          </button>
        </form>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Threat level */}
            <div className="glass-card p-6 flex flex-col items-center justify-center gap-4"
              style={{ borderColor: `${threatColor}30` }}>
              <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
                style={{ borderColor: threatColor, boxShadow: `0 0 20px ${threatColor}30` }}>
                <AlertTriangle size={32} color={threatColor} />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold uppercase" style={{ color: threatColor }}>
                  {result.threat_level}
                </p>
                <p className="text-xs font-mono text-gray-500 mt-1">THREAT LEVEL</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{result.confidence}%</p>
                <p className="text-xs font-mono text-gray-500">CONFIDENCE</p>
              </div>
              {result.malicious_count > 0 && (
                <p className="text-xs font-mono" style={{ color: '#ff3040' }}>
                  {result.malicious_count}/{result.total_engines} ENGINES FLAGGED
                </p>
              )}
            </div>

            {/* Details */}
            <div className="lg:col-span-2 glass-card p-6 space-y-4">
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase mb-1">Indicator</p>
                <p className="font-mono text-sm text-white break-all">{result.indicator}</p>
              </div>

              {result.description && (
                <div>
                  <p className="text-xs font-mono text-gray-500 uppercase mb-1">Description</p>
                  <p className="text-sm text-gray-300">{result.description}</p>
                </div>
              )}

              {result.sources.length > 0 && (
                <div>
                  <p className="text-xs font-mono text-gray-500 uppercase mb-2">Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((s) => (
                      <span key={s} className="px-2 py-1 rounded text-xs font-mono"
                        style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.tags.length > 0 && (
                <div>
                  <p className="text-xs font-mono text-gray-500 uppercase mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded text-xs font-mono badge-info">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                {result.first_seen && (
                  <div>
                    <p className="text-gray-500 uppercase mb-1">First Seen</p>
                    <p className="text-gray-300">{new Date(result.first_seen).toLocaleDateString()}</p>
                  </div>
                )}
                {result.last_seen && (
                  <div>
                    <p className="text-gray-500 uppercase mb-1">Last Seen</p>
                    <p className="text-gray-300">{new Date(result.last_seen).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
