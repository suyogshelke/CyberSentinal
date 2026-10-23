/**
 * LoadingScreen — futuristic cybersecurity loading state
 */
import React from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  message?: string
  submessage?: string
}

export default function LoadingScreen({
  message = 'INITIALIZING SECURITY CORE...',
  submessage,
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: '#080c14' }}>
      {/* Grid background */}
      <div className="cyber-grid-bg" />

      {/* Glowing center circle */}
      <div className="relative flex items-center justify-center mb-8">
        <motion.div
          className="absolute rounded-full border border-cyan-400/30"
          style={{ width: 120, height: 120 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full border border-cyan-400/20"
          style={{ width: 160, height: 160 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        {/* Rotating ring */}
        <motion.div
          className="absolute rounded-full border-t border-r border-cyber-cyan"
          style={{ width: 80, height: 80 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner core */}
        <motion.div
          className="w-10 h-10 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.8), rgba(0,212,255,0.1))' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Logo */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold tracking-[0.3em] text-white uppercase mb-1">
          CYBER<span style={{ color: '#00d4ff' }}>SENTINEL</span>
        </h1>
        <p className="text-xs text-gray-500 tracking-widest uppercase">
          Security Operations Center
        </p>
      </motion.div>

      {/* Status message */}
      <motion.p
        className="text-sm font-mono tracking-wider uppercase"
        style={{ color: '#00d4ff' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.7, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>

      {submessage && (
        <motion.p
          className="text-xs text-gray-600 mt-2 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {submessage}
        </motion.p>
      )}

      {/* Progress bar */}
      <div className="mt-8 w-48 h-px bg-gray-800 rounded overflow-hidden">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  )
}
