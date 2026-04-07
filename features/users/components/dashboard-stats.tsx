"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useUsers } from "@/features/users/hooks/use-users";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityTimeline } from "./activity-timeline";

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
        <Button variant="outline" size="icon" title="Rafraichir" onClick={handleRefresh} disabled={isFetching}>
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
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

      <ActivityTimeline />
    </div>
  );
}
