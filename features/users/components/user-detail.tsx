"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useUser } from "@/features/users/hooks/use-users";
import { useMe } from "@/features/auth/hooks/use-me";
import { useQueryClient } from "@tanstack/react-query";
import { UserFormModal } from "./user-form-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface UserDetailProps {
  id: string;
}

function DetailSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardContent className="px-6 py-8 flex flex-col items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-6 w-36" />
          <div className="w-full flex flex-col gap-3 mt-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-9 w-full mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}

export function UserDetail({ id }: UserDetailProps) {
  const { data: user, isLoading, isFetching } = useUser(id);
  const { data: me } = useMe();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const handleRefresh = () => {
    setShowSkeleton(true);
    queryClient.invalidateQueries({ queryKey: ["users", id] });
  };

  const isRefreshing = showSkeleton && isFetching;

  useEffect(() => {
    if (showSkeleton && !isFetching) {
      setShowSkeleton(false);
    }
  }, [showSkeleton, isFetching]);

  return (
    <div className="flex flex-col gap-4 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-2">
        <Link href="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold md:text-2xl">Détail utilisateur</h1>
        <Button
          variant="outline"
          size="icon"
          className="ml-auto"
          onClick={handleRefresh}
          disabled={isFetching}
          title="Rafraichir"
        >
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {isLoading || isRefreshing ? (
        <DetailSkeleton />
      ) : !user ? (
        <p className="p-4 text-center">Utilisateur introuvable</p>
      ) : (
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardContent className="px-6 py-8 flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>

              <div className="w-full border-t mt-2 pt-4 flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-muted-foreground">Rôle</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === "ADMIN" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"}`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Créé le</span>
                  <span>{new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Modifié le</span>
                  <span>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</span>
                </div>
              </div>

              {me?.role === "ADMIN" && (
                <Button className="mt-4 w-full" onClick={() => setEditOpen(true)}>
                  Modifier
                </Button>
              )}
            </CardContent>
          </Card>

          <UserFormModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            mode="edit"
            user={user}
          />
        </div>
      )}
    </div>
  );
}
