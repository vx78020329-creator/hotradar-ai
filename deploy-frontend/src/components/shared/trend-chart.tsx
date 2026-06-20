"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import type { HeatPoint } from "@/types/event";

interface TrendChartProps {
  data: HeatPoint[];
  height?: number;
  showArea?: boolean;
  color?: string;
  className?: string;
}

export function TrendChart({ data, height = 200, showArea = true, color = "#3B82F6", className }: TrendChartProps) {
  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
    score: d.score,
  }));

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        {showArea ? (
          <AreaChart data={formatted}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
            <XAxis dataKey="date" stroke="#71717A" fontSize={12} />
            <YAxis stroke="#71717A" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181B",
                border: "1px solid #27272A",
                borderRadius: "8px",
                color: "#FAFAFA",
              }}
            />
            <Area type="monotone" dataKey="score" stroke={color} fill="url(#colorScore)" strokeWidth={2} />
          </AreaChart>
        ) : (
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
            <XAxis dataKey="date" stroke="#71717A" fontSize={12} />
            <YAxis stroke="#71717A" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181B",
                border: "1px solid #27272A",
                borderRadius: "8px",
                color: "#FAFAFA",
              }}
            />
            <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2} dot={{ fill: color, r: 4 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
