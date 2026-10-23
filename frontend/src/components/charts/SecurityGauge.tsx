/**
 * SecurityGauge — animated circular security score gauge
 */
import React from 'react'
import { motion } from 'framer-motion'

interface SecurityGaugeProps {
  score: number
}

export default function SecurityGauge({ score }: SecurityGaugeProps) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const dashoffset = circumference - progress

  const color = score >= 80 ? '#10b981' : score >= 60 ? '#00d4ff' : score >= 40 ? '#f59e0b' : '#ff3040'
  const label = score >= 80 ? 'SECURE' : score >= 60 ? 'NOMINAL' : score >= 40 ? 'AT RISK' : 'CRITICAL'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          {/* Background ring */}
          <circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <motion.circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums" style={{ color }}>
            {score}
          </span>
          <span className="text-xs text-gray-600">/100</span>
        </div>
      </div>
      <span className="text-xs font-mono tracking-widest uppercase" style={{ color }}>
        {label}
      </span>
    </div>
  )
}
