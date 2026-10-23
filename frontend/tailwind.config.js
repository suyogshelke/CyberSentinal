/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // CyberSentinel Design System
        cyber: {
          bg: '#080c14',
          surface: '#0d1520',
          glass: 'rgba(13,21,32,0.7)',
          border: 'rgba(0,212,255,0.15)',
          'border-active': 'rgba(0,212,255,0.5)',

          // Accents
          cyan: '#00d4ff',
          'cyan-dim': '#0099bb',
          blue: '#3b82f6',
          violet: '#7c3aed',
          emerald: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
          'red-bright': '#ff3040',

          // Severity
          critical: '#ff3040',
          high: '#f97316',
          medium: '#f59e0b',
          low: '#3b82f6',
          info: '#6b7280',

          // Status
          secure: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          neutral: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
        'cyber-radial': 'radial-gradient(ellipse at center, rgba(0,212,255,0.05) 0%, transparent 70%)',
      },
      backgroundSize: {
        'cyber-grid': '40px 40px',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0,212,255,0.15), 0 0 40px rgba(0,212,255,0.05)',
        'cyber-glow': '0 0 30px rgba(0,212,255,0.3)',
        'critical': '0 0 20px rgba(255,48,64,0.3)',
        'high': '0 0 20px rgba(249,115,22,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spin-reverse 12s linear infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'data-flow': 'data-flow 2s linear infinite',
        'counter': 'counter 0.5s ease-out',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'data-flow': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
