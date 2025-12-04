"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

type OverviewDataPoint = {
  name: string
  total: number
}

type OverviewProps = {
  data?: OverviewDataPoint[]
}

// Fallback demo data (used only if no real data is passed in)
const fallbackData: OverviewDataPoint[] = [
  { name: "Jan", total: 4000 },
  { name: "Feb", total: 3200 },
  { name: "Mar", total: 5100 },
  { name: "Apr", total: 2800 },
  { name: "May", total: 6100 },
  { name: "Jun", total: 4500 },
]

export function Overview({ data }: OverviewProps) {
  const chartData = (data && data.length > 0 ? data : fallbackData) as OverviewDataPoint[]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}