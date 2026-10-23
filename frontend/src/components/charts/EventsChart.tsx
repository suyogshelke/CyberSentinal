/**
 * EventsChart — security events over time line chart
 */
import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

export default function EventsChart({ data }: { data?: Array<{ time: string; count: number }> }) {
  if (!data?.length) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-gray-600 font-mono">
        NO EVENT DATA
      </div>
    )
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: '#0d1520',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 8,
              fontSize: 11,
              fontFamily: 'JetBrains Mono',
              color: '#e2e8f0',
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#00d4ff"
            strokeWidth={2}
            fill="url(#eventGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
