"use client";

import { useUsers } from "@/features/users/hooks/use-users";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DashboardStats() {
  const { data: users, isLoading, isFetching } = useUsers();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold md:text-2xl">Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isFetching}>
          {isFetching ? "Chargement..." : "Rafraichir"}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {isLoading ? "..." : users?.length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Statut API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-green-600">
              {isLoading ? "..." : "Connecté"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
