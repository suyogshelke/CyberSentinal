/**
 * Scanner Page — Web Security Scanner
 */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Play, Shield, AlertTriangle, Bug, Info, CheckCircle, XCircle, Clock } from 'lucide-react'
import { scansAPI } from '../services/api'
import { CyberWebSocket } from '../services/websocket'
import toast from 'react-hot-toast'

const SCAN_PHASES = [
  'CONNECTING',
  'ANALYZING HEADERS',
  'ANALYZING TLS',
  'ANALYZING CORS',
  'CHECKING COOKIES',
  'ZAP SCANNING',
  'STORING RESULTS',
  'GENERATING REPORT',
]

const SEVERITY_STYLES = {
  critical: { class: 'badge-critical', icon: <XCircle size={12} /> },
  high:     { class: 'badge-high',     icon: <AlertTriangle size={12} /> },
  medium:   { class: 'badge-medium',   icon: <AlertTriangle size={12} /> },
  low:      { class: 'badge-low',      icon: <Info size={12} /> },
  informational: { class: 'badge-info', icon: <Info size={12} /> },
}

export default function ScannerPage() {
  const [targetUrl, setTargetUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('')
  const [scanComplete, setScanComplete] = useState(false)
  const [scanId, setScanId] = useState<string | null>(null)
  const [findings, setFindings] = useState<Scan['findings']>([])
  const [securityScore, setSecurityScore] = useState<number | null>(null)
  const [ws, setWs] = useState<CyberWebSocket | null>(null)

  interface ScanFinding {
    id: string; title: string; severity: string; category: string; url: string; description: string; solution: string
  }
  interface Scan { findings: ScanFinding[]; security_score: number; findings_count: Record<string, number> }

  const startScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetUrl) return

    setScanning(true)
    setScanComplete(false)
    setFindings([])
    setProgress(0)
    setPhase('INITIALIZING')

    try {
      const { data } = await scansAPI.create({ target_url: targetUrl, scan_type: 'web' })
      setScanId(data.id)

      // Connect WebSocket for progress
      const socket = new CyberWebSocket(
        `/ws/scans/${data.id}/`,
        (msg: unknown) => {
          const update = msg as { type: string; data: { status: string; progress: number; phase: string; security_score?: number; findings_count?: Record<string, number> } }
          if (update.type === 'scan_update') {
            setProgress(update.data.progress)
            setPhase(update.data.phase || '')
            if (update.data.status === 'completed') {
              setSecurityScore(update.data.security_score ?? null)
              loadFindings(data.id)
              setScanning(false)
              setScanComplete(true)
              socket.disconnect()
              toast.success('Scan completed successfully')
            }
            if (update.data.status === 'failed') {
              setScanning(false)
              toast.error('Scan failed')
              socket.disconnect()
            }
          }
        }
      )
      socket.connect()
      setWs(socket)

    } catch (err) {
      toast.error('Failed to start scan')
      setScanning(false)
    }
  }

  const loadFindings = async (id: string) => {
    try {
      const { data } = await scansAPI.getFindings(id)
      setFindings(data.results || data)
    } catch {}
  }

  const countBySeverity = (sev: string) =>
    findings.filter((f: ScanFinding) => f.severity === sev).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <Globe size={20} color="#00d4ff" />
          WEB SECURITY SCANNER
        </h1>
        <p className="text-xs font-mono text-gray-500 mt-0.5">
          AUTHORIZED SECURITY TESTING — ONLY SCAN SYSTEMS YOU OWN OR HAVE PERMISSION TO TEST
        </p>
      </div>

      {/* Scan form */}
      <div className="glass-card p-6">
        <form onSubmit={startScan} className="flex gap-3">
          <div className="flex-1 relative">
            <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="cyber-input pl-9"
              placeholder="https://your-authorized-target.com"
              disabled={scanning}
              required
            />
          </div>
          <button
            type="submit"
            disabled={scanning}
            className="btn-cyber flex items-center gap-2 shrink-0"
          >
            <Play size={14} />
            {scanning ? 'SCANNING...' : 'INITIALIZE SCAN'}
          </button>
        </form>
      </div>

      {/* Scanning animation */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-8"
          >
            <div className="flex flex-col items-center gap-6">
              {/* Circular scanner */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border border-cyan-400/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-t-2 border-r border-cyan-400"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
                <div className="text-center z-10">
                  <p className="text-2xl font-bold tabular-nums" style={{ color: '#00d4ff' }}>{progress}%</p>
                  <p className="text-xs text-gray-600">SCANNING</p>
                </div>
              </div>

              {/* Phase display */}
              <div className="text-center">
                <motion.p
                  className="text-sm font-mono tracking-wider uppercase"
                  style={{ color: '#00d4ff' }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {phase || 'INITIALIZING'}
                </motion.p>
                <p className="text-xs text-gray-600 mt-1 font-mono">{targetUrl}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-md h-1 bg-gray-800 rounded overflow-hidden">
                <motion.div
                  className="h-full rounded"
                  style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Phase list */}
              <div className="grid grid-cols-4 gap-2 w-full max-w-2xl">
                {SCAN_PHASES.map((p, i) => {
                  const done = progress > (i / SCAN_PHASES.length) * 100
                  return (
                    <div key={p} className="flex items-center gap-1.5 text-xs font-mono"
                      style={{ color: done ? '#10b981' : '#374151' }}>
                      {done ? <CheckCircle size={10} /> : <div className="w-2.5 h-2.5 rounded-full border border-gray-700" />}
                      <span className="truncate">{p}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {scanComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Score summary */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono tracking-wider text-white uppercase">SCAN COMPLETE</h3>
                <span className="text-3xl font-bold" style={{
                  color: (securityScore ?? 0) >= 80 ? '#10b981' : (securityScore ?? 0) >= 60 ? '#f59e0b' : '#ff3040'
                }}>
                  {securityScore ?? 'N/A'}/100
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {['critical', 'high', 'medium', 'low', 'informational'].map((sev) => (
                  <div key={sev} className="text-center p-3 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xl font-bold" style={{
                      color: sev === 'critical' ? '#ff3040' : sev === 'high' ? '#f97316' :
                        sev === 'medium' ? '#f59e0b' : sev === 'low' ? '#3b82f6' : '#6b7280'
                    }}>
                      {countBySeverity(sev)}
                    </p>
                    <p className="text-xs font-mono text-gray-600 uppercase mt-1">{sev}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings table */}
            {findings.length > 0 && (
              <div className="glass-card overflow-hidden">
                <div className="p-4 border-b" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
                  <h3 className="text-sm font-mono tracking-wider text-white uppercase">
                    FINDINGS ({findings.length})
                  </h3>
                </div>
                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  {findings.map((finding: ScanFinding) => {
                    const style = SEVERITY_STYLES[finding.severity as keyof typeof SEVERITY_STYLES] ?? SEVERITY_STYLES.low
                    return (
                      <div key={finding.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-start gap-3">
                          <span className={style.class}>{finding.severity.toUpperCase()}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-200 font-medium">{finding.title}</p>
                            <p className="text-xs text-gray-500 mt-1 font-mono truncate">{finding.url}</p>
                            {finding.description && (
                              <p className="text-xs text-gray-400 mt-2 line-clamp-2">{finding.description}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-600 font-mono shrink-0">{finding.category}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
