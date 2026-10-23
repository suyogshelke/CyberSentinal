/**
 * AppLayout — main application shell
 */
import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import CyberBackground from '../3d/CyberBackground'
import { CyberWebSocket } from '../../services/websocket'

export default function AppLayout() {
  const location = useLocation()
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected')

  useEffect(() => {
    const ws = new CyberWebSocket(
      '/ws/dashboard/',
      () => {}, // handled by individual pages
      setWsStatus
    )
    ws.connect()
    return () => ws.disconnect()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080c14' }}>
      {/* Ambient background */}
      <CyberBackground />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <TopBar wsStatus={wsStatus} />

        {/* Page content with transitions */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
