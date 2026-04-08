"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";

interface ChartProps {
  data: { label: string; created: number; updated: number; deleted: number }[];
  t: (key: string) => string;
}

export default function ActivityChartInner({ data, t }: ChartProps) {
  const max = Math.max(...data.flatMap((d) => [d.created, d.updated, d.deleted]));

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            width={30}
            domain={[0, Math.max(max, 1)]}
          />
          <Tooltip content={() => null} />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="created"
            name={t("dashboard.chart_created")}
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 5, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="updated"
            name={t("dashboard.chart_updated")}
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="deleted"
            name={t("dashboard.chart_deleted")}
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 5, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
