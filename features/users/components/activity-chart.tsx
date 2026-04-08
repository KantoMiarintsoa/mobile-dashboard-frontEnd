"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { notificationService } from "@/service/notification.service";
import { useLocale } from "@/providers/locale-provider";

const Chart = dynamic(() => import("./activity-chart-inner"), { ssr: false });

export function ActivityChart() {
  const { t, locale } = useLocale();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["activity-stats"],
    queryFn: () => notificationService.getStats(7),
    staleTime: 0,
    refetchOnMount: "always",
    refetchInterval: 30000,
  });

  const chartData = stats?.map((s) => ({
    ...s,
    label: new Date(s.date + "T00:00:00").toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
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
        ) : chartData && chartData.length > 0 ? (
          <Chart data={chartData} t={t} />
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            {t("dashboard.no_activity")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
