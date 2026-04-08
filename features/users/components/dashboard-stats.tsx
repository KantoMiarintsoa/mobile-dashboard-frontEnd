"use client";

import { useState, useEffect } from "react";
import { RefreshCw, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useUsers } from "@/features/users/hooks/use-users";
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
          <CardHeader>
            <Skeleton className="h-4 w-20 sm:w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12 sm:w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardStats() {
  const { data: users, isLoading, isFetching } = useUsers();
  const queryClient = useQueryClient();
  const [showSkeleton, setShowSkeleton] = useState(false);

  const isRefreshing = showSkeleton && isFetching;

  useEffect(() => {
    if (showSkeleton && !isFetching) {
      setShowSkeleton(false);
    }
  }, [showSkeleton, isFetching]);

  const handleRefresh = () => {
    setShowSkeleton(true);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleExportPDF = () => {
    if (!users) return;
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("fr-FR");

    doc.setFontSize(18);
    doc.text("Rapport Dashboard", 14, 20);
    doc.setFontSize(10);
    doc.text(`Généré le ${date}`, 14, 28);

    doc.setFontSize(12);
    doc.text("Statistiques", 14, 40);
    autoTable(doc, {
      startY: 45,
      head: [["Métrique", "Valeur"]],
      body: [
        ["Total utilisateurs", String(users.length)],
        ["Nouveaux (7j)", String(users.filter((u) => (Date.now() - new Date(u.createdAt).getTime()) / 86400000 <= 7).length)],
        ["Anciens (+30j)", String(users.filter((u) => (Date.now() - new Date(u.createdAt).getTime()) / 86400000 > 30).length)],
        ["Statut API", "Connecté"],
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.text("Liste des utilisateurs", 14, finalY + 15);
    autoTable(doc, {
      startY: finalY + 20,
      head: [["Nom", "Email", "Rôle", "Créé le"]],
      body: users.map((u) => [
        u.name,
        u.email,
        u.role,
        new Date(u.createdAt).toLocaleDateString("fr-FR"),
      ]),
    });

    doc.save(`rapport_dashboard_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const totalUsers = users?.length ?? 0;
  const recentUsers = users?.filter((u) => {
    const created = new Date(u.createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length ?? 0;
  const oldUsers = users?.filter((u) => {
    const created = new Date(u.createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 30;
  }).length ?? 0;

  return (
    <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold sm:text-xl md:text-2xl">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="Rafraichir" onClick={handleRefresh} disabled={isFetching}>
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportPDF} disabled={!users?.length}>
            <FileDown className="size-4" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
        </div>
      </div>
      {isLoading || isRefreshing ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Total utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold text-primary">{totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Nouveaux (7j)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold text-primary">{recentUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Statut API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base sm:text-lg font-semibold text-green-600">Connecté</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Anciens (+30j)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold text-primary">{oldUsers}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <ActivityChart />

      <ActivityTimeline />
    </div>
  );
}
