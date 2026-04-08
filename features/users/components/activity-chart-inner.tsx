"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ChartProps {
  data: { label: string; created: number; updated: number; deleted: number }[];
  t: (key: string) => string;
}

export default function ActivityChartInner({ data, t }: ChartProps) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} width={30} />
          <Tooltip content={() => null} />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="created"
            name={t("dashboard.chart_created")}
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{ r: 4, fill: "#22c55e" }}
          />
          <Area
            type="monotone"
            dataKey="updated"
            name={t("dashboard.chart_updated")}
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{ r: 4, fill: "#3b82f6" }}
          />
          <Area
            type="monotone"
            dataKey="deleted"
            name={t("dashboard.chart_deleted")}
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{ r: 4, fill: "#ef4444" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
