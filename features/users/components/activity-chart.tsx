"use client";

import { useQuery } from "@tanstack/react-query";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { notificationService } from "@/service/notification.service";
import { useLocale } from "@/providers/locale-provider";

export function ActivityChart() {
  const { t, locale } = useLocale();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["activity-stats"],
    queryFn: () => notificationService.getStats(7),
    refetchInterval: 60000,
  });

  const chartData = stats?.map((s) => ({
    ...s,
    label: new Date(s.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
      weekday: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {t("dashboard.chart_title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={30} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="created"
                name={t("dashboard.chart_created")}
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="updated"
                name={t("dashboard.chart_updated")}
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="deleted"
                name={t("dashboard.chart_deleted")}
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
