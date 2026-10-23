/**
 * Login Page — Futuristic Secure Access Terminal
 */
import React, { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, Lock, Mail, Activity, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import CyberBackground from '../components/3d/CyberBackground'

// Lazy-load the heavy 3D core for login
const SecurityCore = lazy(() => import('../components/3d/SecurityCore'))

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data } = await authAPI.login(email, password)
      setAuth(data.user, data.access, data.refresh)
      toast.success('Authentication successful')
      navigate('/dashboard')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        || 'Authentication failed. Check your credentials.'
      setError(message)
      toast.error('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: '#080c14' }}>
      <CyberBackground />

      {/* Left panel — 3D visualization */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative z-10 p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <Suspense fallback={
            <div className="w-72 h-72 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-cyan-400/30 animate-spin-slow" />
            </div>
          }>
            <SecurityCore status="normal" size={280} />
          </Suspense>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-3"
          >
            <h2 className="text-2xl font-bold tracking-[0.3em] text-white uppercase">
              CYBER<span style={{ color: '#00d4ff' }}>SENTINEL</span>
            </h2>
            <p className="text-sm tracking-widest text-gray-500 uppercase font-mono">
              Security Operations Center
            </p>

            {/* Status indicators */}
            <div className="flex items-center justify-center gap-6 mt-8">
              {[
                { label: 'ENCRYPTION', value: 'AES-256', color: '#10b981' },
                { label: 'PROTOCOL', value: 'TLS 1.3', color: '#00d4ff' },
                { label: 'STATUS', value: 'SECURE', color: '#10b981' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xs font-mono" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs text-gray-600 font-mono mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Live data stream indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#10b981' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-mono text-gray-500">
                THREAT DETECTION ACTIVE
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right panel — Authentication form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-[440px] relative z-10 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <motion.div variants={itemVariants} className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold tracking-[0.3em] text-white uppercase">
              CYBER<span style={{ color: '#00d4ff' }}>SENTINEL</span>
            </h1>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
                <Lock size={16} color="#00d4ff" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-wide">SECURE ACCESS</h1>
                <p className="text-xs font-mono text-gray-500 tracking-widest">AUTHENTICATION TERMINAL</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 font-mono mt-3">
              AUTHORIZED PERSONNEL ONLY — ALL ACCESS LOGGED
            </p>
          </motion.div>

          {/* Login form */}
          <motion.form
            variants={containerVariants}
            onSubmit={handleLogin}
            className="space-y-4"
          >
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg text-sm"
                style={{ background: 'rgba(255,48,64,0.1)', border: '1px solid rgba(255,48,64,0.3)', color: '#ff3040' }}
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider uppercase">
                Identity
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cyber-input pl-10"
                  placeholder="analyst@organization.com"
                  autoComplete="email"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider uppercase">
                Authentication Key
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cyber-input pl-10 pr-10"
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 font-bold text-sm tracking-[0.2em] uppercase rounded-lg transition-all duration-200 relative overflow-hidden"
                style={{
                  background: isLoading
                    ? 'rgba(0,212,255,0.05)'
                    : 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.05))',
                  border: '1px solid rgba(0,212,255,0.4)',
                  color: isLoading ? '#4b5563' : '#00d4ff',
                }}
                whileHover={!isLoading ? { scale: 1.01 } : {}}
                whileTap={!isLoading ? { scale: 0.99 } : {}}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      className="w-4 h-4 rounded-full border-t border-cyan-400"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    AUTHENTICATING...
                  </span>
                ) : (
                  'AUTHENTICATE'
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-8 pt-6"
            style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
            <div className="flex items-center justify-between text-xs font-mono text-gray-600">
              <div className="flex items-center gap-1.5">
                <Activity size={10} />
                <span>SESSION ENCRYPTED</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={10} />
                <span>v1.0.0</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
