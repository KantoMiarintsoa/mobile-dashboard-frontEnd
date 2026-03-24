"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { RefreshCw, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useUsers } from "@/features/users/hooks/use-users";
import { useDeleteUser } from "@/features/users/hooks/use-user-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { UserFormModal } from "./user-form-modal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function TableSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
      <div className="flex flex-col gap-3 md:hidden">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Skeleton className="h-4 w-48" />
            </CardContent>
            <CardFooter className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Desktop skeleton */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-7 w-7" />
                    <Skeleton className="h-7 w-7" />
                    <Skeleton className="h-7 w-7" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export function UsersTable() {
  const { data: users, isLoading, isFetching } = useUsers();
  const deleteUser = useDeleteUser();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<{ id: string; name: string; email: string } | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const sortedUsers = useMemo(
    () => users?.slice().sort((a, b) => a.id.localeCompare(b.id)),
    [users],
  );

  const isRefreshing = showSkeleton && isFetching;

  useEffect(() => {
    if (showSkeleton && !isFetching) {
      setShowSkeleton(false);
    }
  }, [showSkeleton, isFetching]);

  const handleCreate = () => {
    setModalMode("create");
    setEditingUser(undefined);
    setModalOpen(true);
  };

  const handleEdit = (user: { id: string; name: string; email: string }) => {
    setModalMode("edit");
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDeleteClick = (user: { id: string; name: string }) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    deleteUser.mutate(userToDelete.id, {
      onSuccess: () => {
        toast.success("Utilisateur supprimé avec succès");
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      },
      onError: () => {
        toast.error("Erreur lors de la suppression");
      },
    });
  };

  const handleRefresh = () => {
    setShowSkeleton(true);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold sm:text-xl md:text-2xl">Utilisateurs</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" title="Rafraichir" onClick={handleRefresh} disabled={isFetching}>
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" className="gap-1.5" onClick={handleCreate}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>
        </div>
      </div>

      {isLoading || isRefreshing ? (
        <TableSkeleton />
      ) : (
        <>
          {/* Mobile : cartes */}
          <div className="flex flex-col gap-3 md:hidden">
            {sortedUsers?.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Aucun utilisateur</p>
            )}
            {sortedUsers?.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle className="text-base">{user.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-sm">
                  <p className="text-muted-foreground truncate">{user.email}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link href={`/users/${user.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <Eye className="size-3.5" />
                      Voir
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => handleEdit(user)}
                  >
                    <Pencil className="size-3.5" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    title="Supprimer"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Desktop : table */}
          <div className="hidden md:block rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Link href={`/users/${user.id}`}>
                          <Button variant="outline" size="icon-sm" title="Voir">
                            <Eye className="size-3.5" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon-sm" title="Modifier" onClick={() => handleEdit(user)}>
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          title="Supprimer"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedUsers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Aucun utilisateur
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        user={editingUser}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer <strong>{userToDelete?.name}</strong> ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
