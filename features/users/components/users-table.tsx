"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { RefreshCw, Plus, Eye, Pencil, Trash2, Search, Download, Ban, CheckCircle } from "lucide-react";
import { saveAs } from "file-saver";
import { useUsers } from "@/features/users/hooks/use-users";
import { useDeleteUser, useDeleteAllUsers, useToggleActive } from "@/features/users/hooks/use-user-mutations";
import { useMe } from "@/features/auth/hooks/use-me";
import { usePresence } from "@/providers/presence-provider";
import { useLocale } from "@/providers/locale-provider";
import { useQueryClient } from "@tanstack/react-query";
import { UserFormModal } from "./user-form-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="flex flex-col gap-3 md:hidden">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent className="flex flex-col gap-2"><Skeleton className="h-4 w-48" /></CardContent>
            <CardFooter className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
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
  const { data: me } = useMe();
  const { isOnline } = usePresence();
  const { t } = useLocale();
  const deleteUser = useDeleteUser();
  const deleteAllUsers = useDeleteAllUsers();
  const toggleActive = useToggleActive();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<{ id: string; name: string; email: string } | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredUsers = useMemo(() => {
    const sorted = users?.slice().sort((a, b) => a.id.localeCompare(b.id));
    if (!debouncedSearch) return sorted;
    const q = debouncedSearch.toLowerCase();
    return sorted?.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, debouncedSearch]);

  const isRefreshing = showSkeleton && isFetching;

  useEffect(() => {
    if (showSkeleton && !isFetching) setShowSkeleton(false);
  }, [showSkeleton, isFetching]);

  const handleCreate = () => { setModalMode("create"); setEditingUser(undefined); setModalOpen(true); };
  const handleEdit = (user: { id: string; name: string; email: string }) => { setModalMode("edit"); setEditingUser(user); setModalOpen(true); };
  const handleDeleteClick = (user: { id: string; name: string }) => { setUserToDelete(user); setDeleteDialogOpen(true); };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    deleteUser.mutate(userToDelete.id, {
      onSuccess: () => { toast.success(t("users.delete_success")); setDeleteDialogOpen(false); setUserToDelete(null); },
      onError: () => { toast.error(t("users.delete_error")); },
    });
  };

  const handleRefresh = () => { setShowSkeleton(true); queryClient.invalidateQueries({ queryKey: ["users"] }); };

  const handleToggleActive = (user: { id: string; active: boolean }) => {
    toggleActive.mutate(user.id, {
      onSuccess: () => { toast.success(user.active ? t("users.disable_success") : t("users.enable_success")); },
      onError: () => { toast.error(t("users.disable_error")); },
    });
  };

  const handleDeleteAllConfirm = () => {
    deleteAllUsers.mutate(undefined, {
      onSuccess: () => { toast.success(t("users.delete_all_success")); setDeleteAllDialogOpen(false); },
      onError: () => { toast.error(t("users.delete_all_error")); },
    });
  };

  const handleExportCSV = () => {
    if (!filteredUsers?.length) return;
    const header = `${t("users.name")},${t("users.email")},${t("users.role")},${t("users.created_at")}`;
    const rows = filteredUsers.map((u) =>
      `"${u.name}","${u.email}","${u.role}","${new Date(u.createdAt).toLocaleDateString()}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `users_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold sm:text-xl md:text-2xl">{t("users.title")}</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder={t("users.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Button variant="outline" size="icon" title={t("users.refresh")} onClick={handleRefresh} disabled={isFetching}>
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportCSV} disabled={!filteredUsers?.length}>
            <Download className="size-4" />
            <span className="hidden sm:inline">CSV</span>
          </Button>
          {me?.role === "ADMIN" && (
            <>
              <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setDeleteAllDialogOpen(true)} disabled={!filteredUsers?.length}>
                <Trash2 className="size-4" />
                <span className="hidden sm:inline">{t("users.delete_all")}</span>
              </Button>
              <Button size="sm" className="gap-1.5" onClick={handleCreate}>
                <Plus className="size-4" />
                <span className="hidden sm:inline">{t("users.add")}</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {isLoading || isRefreshing ? (
        <TableSkeleton />
      ) : (
        <>
          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredUsers?.length === 0 && (
              <p className="text-center text-muted-foreground py-8">{t("users.none")}</p>
            )}
            {filteredUsers?.map((user) => {
              const isMe = me?.id === user.id;
              return (
                <Card key={user.id} className={!user.active ? "opacity-50" : ""}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      {user.name}
                      {isOnline(user.id) && <span className="size-2.5 rounded-full bg-green-500 shrink-0 animate-pulse" title={t("users.online")} />}
                      {!user.active && <span className="text-xs text-red-500">({t("users.disabled")})</span>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1 text-sm">
                    <p className="text-muted-foreground truncate">{user.email}</p>
                    <span className={`inline-block w-fit text-xs px-2 py-0.5 rounded-full ${user.role === "ADMIN" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"}`}>
                      {user.role}
                    </span>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Link href={`/users/${user.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-1.5">
                        <Eye className="size-3.5" />{t("users.view")}
                      </Button>
                    </Link>
                    {me?.role === "ADMIN" && (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => handleEdit(user)}>
                          <Pencil className="size-3.5" />{t("users.edit")}
                        </Button>
                        {isMe ? (
                          <Button variant="outline" size="icon-sm" title={user.active ? t("users.disable") : t("users.enable")} onClick={() => handleToggleActive(user)}>
                            {user.active ? <Ban className="size-3.5" /> : <CheckCircle className="size-3.5" />}
                          </Button>
                        ) : (
                          <Button variant="destructive" size="icon-sm" title={t("users.delete")} onClick={() => handleDeleteClick(user)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Desktop */}
          <div className="hidden md:block rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("users.name")}</TableHead>
                  <TableHead>{t("users.email")}</TableHead>
                  <TableHead>{t("users.role")}</TableHead>
                  <TableHead className="text-right">{t("users.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => {
                  const isMe = me?.id === user.id;
                  return (
                    <TableRow key={user.id} className={!user.active ? "opacity-50" : ""}>
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-2">
                          {user.name}
                          {isOnline(user.id) && <span className="size-2.5 rounded-full bg-green-500 shrink-0 animate-pulse" title={t("users.online")} />}
                          {!user.active && <span className="text-xs text-red-500">({t("users.disabled")})</span>}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === "ADMIN" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"}`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link href={`/users/${user.id}`}>
                            <Button variant="outline" size="icon-sm" title={t("users.view")}><Eye className="size-3.5" /></Button>
                          </Link>
                          {me?.role === "ADMIN" && (
                            <>
                              <Button variant="outline" size="icon-sm" title={t("users.edit")} onClick={() => handleEdit(user)}>
                                <Pencil className="size-3.5" />
                              </Button>
                              {isMe ? (
                                <Button variant="outline" size="icon-sm" title={user.active ? t("users.disable") : t("users.enable")} onClick={() => handleToggleActive(user)}>
                                  {user.active ? <Ban className="size-3.5" /> : <CheckCircle className="size-3.5" />}
                                </Button>
                              ) : (
                                <Button variant="destructive" size="icon-sm" title={t("users.delete")} onClick={() => handleDeleteClick(user)}>
                                  <Trash2 className="size-3.5" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredUsers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">{t("users.none")}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <UserFormModal open={modalOpen} onClose={() => setModalOpen(false)} mode={modalMode} user={editingUser} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("users.confirm_delete_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("users.confirm_delete", { name: userToDelete?.name || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteConfirm} disabled={deleteUser.isPending}>
              {deleteUser.isPending ? t("users.deleting") : t("users.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("users.delete_all_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("users.delete_all_confirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteAllConfirm} disabled={deleteAllUsers.isPending}>
              {deleteAllUsers.isPending ? t("users.deleting") : t("users.delete_all")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
