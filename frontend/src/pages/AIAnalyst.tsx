/**
 * AI Security Analyst Page — AI-powered security analysis
 */
import React, { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Send, User, Cpu, AlertTriangle } from 'lucide-react'
import { aiAnalystAPI } from '../services/api'

const SecurityCore = lazy(() => import('../components/3d/SecurityCore'))

interface Message {
  id: string; role: 'user' | 'assistant'; content: string; timestamp: Date
}

export default function AIAnalystPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'AI Security Analyst online. I can analyze security threats, explain vulnerabilities, review incidents, and provide remediation recommendations. What would you like to investigate?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const { data } = await aiAnalystAPI.chat([
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMsg.content },
      ])
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '_ai',
          role: 'assistant',
          content: data.message || data.content || 'Analysis complete.',
          timestamp: new Date(),
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '_err',
          role: 'assistant',
          content: 'Unable to process request. Please check your AI service configuration.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 h-[calc(100vh-56px)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <Brain size={20} color="#8b5cf6" />
            AI SECURITY ANALYST
          </h1>
          <p className="text-xs font-mono text-gray-500 mt-0.5">
            AI-POWERED THREAT ANALYSIS & SECURITY INTELLIGENCE
          </p>
        </div>
        <motion.div
          className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          ANALYST ONLINE
        </motion.div>
      </div>

      {/* Main layout */}
      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Left: Security Core + info */}
        <div className="hidden xl:flex flex-col items-center gap-4 w-56 shrink-0">
          <div className="glass-card p-4 flex flex-col items-center w-full">
            <p className="text-xs font-mono text-gray-500 uppercase mb-3">INTELLIGENCE CORE</p>
            <Suspense fallback={<div className="w-28 h-28 rounded-full border border-violet-400/20 animate-pulse" />}>
              <SecurityCore status="normal" size={140} />
            </Suspense>
          </div>

          <div className="glass-card p-4 w-full space-y-3 text-xs font-mono">
            <p className="text-gray-500 uppercase tracking-wider">Capabilities</p>
            {[
              'Threat Analysis',
              'Vulnerability Review',
              'Incident Investigation',
              'Risk Assessment',
              'Remediation Guidance',
              'Pattern Recognition',
            ].map((cap) => (
              <div key={cap} className="flex items-center gap-2 text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b5cf6' }} />
                {cap}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chat */}
        <div className="glass-card flex flex-col flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: msg.role === 'assistant' ? 'rgba(139,92,246,0.15)' : 'rgba(0,212,255,0.1)',
                      border: `1px solid ${msg.role === 'assistant' ? 'rgba(139,92,246,0.3)' : 'rgba(0,212,255,0.3)'}`,
                    }}>
                    {msg.role === 'assistant' ? <Cpu size={14} color="#8b5cf6" /> : <User size={14} color="#00d4ff" />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[75%] rounded-xl p-4 text-sm ${
                    msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                  }`} style={{
                    background: msg.role === 'assistant' ? 'rgba(139,92,246,0.08)' : 'rgba(0,212,255,0.08)',
                    border: `1px solid ${msg.role === 'assistant' ? 'rgba(139,92,246,0.2)' : 'rgba(0,212,255,0.2)'}`,
                  }}>
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs text-gray-600 mt-2 font-mono">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <Cpu size={14} color="#8b5cf6" />
                </div>
                <div className="flex gap-1 p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-violet-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4" style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="cyber-input flex-1"
                placeholder="Ask about threats, vulnerabilities, incidents..."
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()} className="btn-cyber flex items-center gap-2 shrink-0 px-4">
                <Send size={14} />
                SEND
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
