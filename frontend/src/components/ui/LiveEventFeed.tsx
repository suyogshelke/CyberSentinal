/**
 * LiveEventFeed — real-time security event stream
 */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

interface SecurityEvent {
  id: string
  event_type: string
  severity: string
  message: string
  source_ip: string | null
  timestamp: string
}

const SEVERITY_CONFIG = {
  critical: { color: '#ff3040', bg: 'rgba(255,48,64,0.1)', label: 'CRITICAL' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.1)', label: 'HIGH' },
  medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'MEDIUM' },
  low:      { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'LOW' },
  info:     { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', label: 'INFO' },
}

interface LiveEventFeedProps {
  events: SecurityEvent[]
  maxHeight?: number
}

export default function LiveEventFeed({ events, maxHeight = 320 }: LiveEventFeedProps) {
  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3">
        <div className="w-12 h-12 rounded-full border border-green-400/20 flex items-center justify-center">
          <span className="text-lg">✓</span>
        </div>
        <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">NO ACTIVE THREATS</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 overflow-y-auto" style={{ maxHeight }}>
      <AnimatePresence initial={false}>
        {events.map((event) => {
          const cfg = SEVERITY_CONFIG[event.severity as keyof typeof SEVERITY_CONFIG]
            ?? SEVERITY_CONFIG.info
          const time = new Date(event.timestamp)

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -16, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 16, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: cfg.bg, border: `1px solid ${cfg.color}20` }}
            >
              {/* Severity indicator */}
              <motion.div
                className="w-2 h-2 rounded-full mt-1 shrink-0"
                style={{ background: cfg.color }}
                animate={event.severity === 'critical' || event.severity === 'high'
                  ? { opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }
                  : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono font-bold" style={{ color: cfg.color }}>
                    {cfg.label}
                  </span>
                  <span className="text-xs text-gray-600 font-mono truncate">
                    {event.event_type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-300 truncate">{event.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-600 font-mono">
                    {time.toLocaleTimeString()}
                  </span>
                  {event.source_ip && (
                    <span className="text-xs text-gray-600 font-mono">{event.source_ip}</span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
