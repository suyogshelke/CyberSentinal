/**
 * CyberSentinel — Main App Router
 */
import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import AppLayout from './components/layout/AppLayout'
import LoadingScreen from './components/ui/LoadingScreen'

// Lazy-loaded pages for code splitting
const LoginPage = lazy(() => import('./pages/Login'))
const DashboardPage = lazy(() => import('./pages/Dashboard'))
const AssetsPage = lazy(() => import('./pages/Assets'))
const ScannerPage = lazy(() => import('./pages/Scanner'))
const APISecurityPage = lazy(() => import('./pages/APISecurity'))
const VulnerabilitiesPage = lazy(() => import('./pages/Vulnerabilities'))
const VulnerabilityDetailPage = lazy(() => import('./pages/VulnerabilityDetail'))
const SIEMPage = lazy(() => import('./pages/SIEM'))
const ThreatIntelPage = lazy(() => import('./pages/ThreatIntelligence'))
const IncidentsPage = lazy(() => import('./pages/Incidents'))
const IncidentDetailPage = lazy(() => import('./pages/IncidentDetail'))
const AIAnalystPage = lazy(() => import('./pages/AIAnalyst'))
const DevSecOpsPage = lazy(() => import('./pages/DevSecOps'))
const ReportsPage = lazy(() => import('./pages/Reports'))
const AuditLogsPage = lazy(() => import('./pages/AuditLogs'))
const SettingsPage = lazy(() => import('./pages/Settings'))

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1520',
            color: '#e2e8f0',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#0d1520' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0d1520' } },
        }}
      />
      <Suspense fallback={<LoadingScreen message="INITIALIZING SECURITY CORE..." />}>
        <Routes>
          {/* Public */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Protected — inside app layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="scanner" element={<ScannerPage />} />
            <Route path="api-security" element={<APISecurityPage />} />
            <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
            <Route path="vulnerabilities/:id" element={<VulnerabilityDetailPage />} />
            <Route path="siem" element={<SIEMPage />} />
            <Route path="threat-intelligence" element={<ThreatIntelPage />} />
            <Route path="incidents" element={<IncidentsPage />} />
            <Route path="incidents/:id" element={<IncidentDetailPage />} />
            <Route path="ai-analyst" element={<AIAnalystPage />} />
            <Route path="devsecops" element={<DevSecOpsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit" element={<AuditLogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
