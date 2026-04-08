"use client";

import { useState, useEffect } from "react";
import { RefreshCw, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useUsers } from "@/features/users/hooks/use-users";
import { useLocale } from "@/providers/locale-provider";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityTimeline } from "./activity-timeline";
import { ActivityChart } from "./activity-chart";

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader><Skeleton className="h-4 w-20 sm:w-24" /></CardHeader>
          <CardContent><Skeleton className="h-8 w-12 sm:w-16" /></CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardStats() {
  const { data: users, isLoading, isFetching } = useUsers();
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const [showSkeleton, setShowSkeleton] = useState(false);

  const isRefreshing = showSkeleton && isFetching;

  useEffect(() => {
    if (showSkeleton && !isFetching) setShowSkeleton(false);
  }, [showSkeleton, isFetching]);

  const handleRefresh = () => { setShowSkeleton(true); queryClient.invalidateQueries({ queryKey: ["users"] }); };

  const handleExportPDF = () => {
    if (!users) return;
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.text(t("dashboard.pdf_title"), 14, 20);
    doc.setFontSize(10);
    doc.text(t("dashboard.pdf_generated", { date }), 14, 28);

    doc.setFontSize(12);
    doc.text(t("dashboard.pdf_stats"), 14, 40);
    autoTable(doc, {
      startY: 45,
      head: [[t("dashboard.pdf_metric"), t("dashboard.pdf_value")]],
      body: [
        [t("dashboard.total_users"), String(users.length)],
        [t("dashboard.recent_users"), String(users.filter((u) => (Date.now() - new Date(u.createdAt).getTime()) / 86400000 <= 7).length)],
        [t("dashboard.old_users"), String(users.filter((u) => (Date.now() - new Date(u.createdAt).getTime()) / 86400000 > 30).length)],
        [t("dashboard.api_status"), t("dashboard.connected")],
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.text(t("dashboard.pdf_users_list"), 14, finalY + 15);
    autoTable(doc, {
      startY: finalY + 20,
      head: [[t("users.name"), t("users.email"), t("users.role"), t("users.created_at")]],
      body: users.map((u) => [u.name, u.email, u.role, new Date(u.createdAt).toLocaleDateString()]),
    });

    doc.save(`report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const totalUsers = users?.length ?? 0;
  const recentUsers = users?.filter((u) => (Date.now() - new Date(u.createdAt).getTime()) / 86400000 <= 7).length ?? 0;
  const oldUsers = users?.filter((u) => (Date.now() - new Date(u.createdAt).getTime()) / 86400000 > 30).length ?? 0;

  return (
    <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold sm:text-xl md:text-2xl">{t("dashboard.title")}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title={t("dashboard.refresh")} onClick={handleRefresh} disabled={isFetching}>
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportPDF} disabled={!users?.length}>
            <FileDown className="size-4" />
            <span className="hidden sm:inline">{t("dashboard.export_pdf")}</span>
          </Button>
        </div>
      </div>
      {isLoading || isRefreshing ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{t("dashboard.total_users")}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-2xl sm:text-3xl font-bold text-primary">{totalUsers}</p></CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{t("dashboard.recent_users")}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-2xl sm:text-3xl font-bold text-primary">{recentUsers}</p></CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{t("dashboard.api_status")}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-base sm:text-lg font-semibold text-green-600">{t("dashboard.connected")}</p></CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{t("dashboard.old_users")}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-2xl sm:text-3xl font-bold text-primary">{oldUsers}</p></CardContent>
          </Card>
        </div>
      )}

      <ActivityChart />
      <ActivityTimeline />
    </div>
  );
}
