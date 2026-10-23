/**
 * Axios API service with JWT interceptor and auto-refresh
 */
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Use relative path so Vite's dev proxy handles it correctly.
// In production set VITE_API_BASE_URL to your backend URL.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh token on 401
let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      const { refreshToken, setAccessToken, logout } = useAuthStore.getState()
      try {
        const refreshBase = import.meta.env.VITE_API_BASE_URL || ''
        const { data } = await axios.post(`${refreshBase}/api/auth/token/refresh/`, {
          refresh: refreshToken,
        })
        setAccessToken(data.access)
        processQueue(null, data.access)
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        logout()
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

// ─── Auth API ───
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  register: (data: Record<string, string>) =>
    api.post('/auth/register/', data),
  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data: FormData | Record<string, unknown>) =>
    api.patch('/auth/profile/', data),
  changePassword: (data: Record<string, string>) =>
    api.put('/auth/change-password/', data),
}

// ─── Dashboard API ───
export const dashboardAPI = {
  getMetrics: () => api.get('/dashboard/metrics/'),
  getHealth: () => api.get('/health/'),
}

// ─── Assets API ───
export const assetsAPI = {
  list: (params?: Record<string, unknown>) => api.get('/assets/', { params }),
  create: (data: Record<string, unknown>) => api.post('/assets/', data),
  get: (id: string) => api.get(`/assets/${id}/`),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/assets/${id}/`, data),
  delete: (id: string) => api.delete(`/assets/${id}/`),
}

// ─── Scans API ───
export const scansAPI = {
  list: (params?: Record<string, unknown>) => api.get('/scans/', { params }),
  create: (data: Record<string, unknown>) => api.post('/scans/', data),
  get: (id: string) => api.get(`/scans/${id}/`),
  getFindings: (id: string) => api.get(`/scans/${id}/findings/`),
  cancel: (id: string) => api.post(`/scans/${id}/cancel/`),
}

// ─── Vulnerabilities API ───
export const vulnerabilitiesAPI = {
  list: (params?: Record<string, unknown>) => api.get('/vulnerabilities/', { params }),
  get: (id: string) => api.get(`/vulnerabilities/${id}/`),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/vulnerabilities/${id}/`, data),
  stats: () => api.get('/vulnerabilities/stats/'),
}

// ─── Security Events API ───
export const eventsAPI = {
  list: (params?: Record<string, unknown>) => api.get('/events/', { params }),
  get: (id: string) => api.get(`/events/${id}/`),
  create: (data: Record<string, unknown>) => api.post('/events/', data),
  stats: () => api.get('/events/stats/'),
}

// ─── Detection API ───
export const detectionAPI = {
  listRules: () => api.get('/detection/rules/'),
  listAlerts: (params?: Record<string, unknown>) => api.get('/detection/alerts/', { params }),
  acknowledgeAlert: (id: string) => api.post(`/detection/alerts/${id}/acknowledge/`),
}

// ─── Incidents API ───
export const incidentsAPI = {
  list: (params?: Record<string, unknown>) => api.get('/incidents/', { params }),
  get: (id: string) => api.get(`/incidents/${id}/`),
  create: (data: Record<string, unknown>) => api.post('/incidents/', data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/incidents/${id}/`, data),
  timeline: (id: string) => api.get(`/incidents/${id}/timeline/`),
  addNote: (id: string, note: string) => api.post(`/incidents/${id}/timeline/`, { event_type: 'note', title: 'Analyst Note', description: note }),
}

// ─── Threat Intelligence API ───
export const threatIntelAPI = {
  list: (params?: Record<string, unknown>) => api.get('/threat-intelligence/', { params }),
  lookup: (indicator: string, ioc_type: string) =>
    api.post('/threat-intelligence/lookup/', { indicator, ioc_type }),
  get: (id: string) => api.get(`/threat-intelligence/${id}/`),
}

// ─── Reports API ───
export const reportsAPI = {
  list: () => api.get('/reports/'),
  generate: (data: Record<string, unknown>) => api.post('/reports/', data),
  download: (id: string, format: string) =>
    api.get(`/reports/${id}/download/`, { params: { format }, responseType: 'blob' }),
}

// ─── DevSecOps API ───
export const devSecOpsAPI = {
  listPipelines: (params?: Record<string, unknown>) => api.get('/devsecops/pipelines/', { params }),
  getPipeline: (id: string) => api.get(`/devsecops/pipelines/${id}/`),
}

// ─── AI Analyst API ───
export const aiAnalystAPI = {
  analyze: (context: Record<string, unknown>) => api.post('/ai-analyst/analyze/', context),
  chat: (messages: Array<{ role: string; content: string }>) =>
    api.post('/ai-analyst/chat/', { messages }),
}

// ─── Risk API ───
export const riskAPI = {
  overview: () => api.get('/risk/overview/'),
  assetRisk: () => api.get('/risk/assets/'),
}

// ─── Audit API ───
export const auditAPI = {
  list: (params?: Record<string, unknown>) => api.get('/audit/', { params }),
}
