/**
 * WebSocket service for real-time security events
 */

const WS_BASE = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000'

export class CyberWebSocket {
  private ws: WebSocket | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectDelay = 2000
  private maxReconnectDelay = 30000
  private shouldReconnect = true

  constructor(
    private path: string,
    private onMessage: (data: unknown) => void,
    private onStatusChange?: (status: 'connected' | 'disconnected' | 'reconnecting') => void
  ) {}

  connect() {
    const token = localStorage.getItem('cybersentinel-auth')
    const parsedToken = token ? JSON.parse(token)?.state?.accessToken : null

    const url = `${WS_BASE}${this.path}${parsedToken ? `?token=${parsedToken}` : ''}`
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      this.reconnectDelay = 2000
      this.onStatusChange?.('connected')
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.onMessage(data)
      } catch {
        // ignore parse errors
      }
    }

    this.ws.onclose = () => {
      this.onStatusChange?.('disconnected')
      if (this.shouldReconnect) {
        this.scheduleReconnect()
      }
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  private scheduleReconnect() {
    this.onStatusChange?.('reconnecting')
    this.reconnectTimer = setTimeout(() => {
      this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, this.maxReconnectDelay)
      this.connect()
    }, this.reconnectDelay)
  }

  disconnect() {
    this.shouldReconnect = false
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.ws?.close()
  }

  send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }
}
