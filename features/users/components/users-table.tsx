"use client";

import Link from "next/link";
import { useUsers } from "@/features/users/hooks/use-users";
import { useDeleteUser } from "@/features/users/hooks/use-user-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UsersTable() {
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const queryClient = useQueryClient();

  const handleDelete = (id: string) => {
    if (confirm("Supprimer cet utilisateur ?")) {
      deleteUser.mutate(id);
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  if (isLoading) return <p className="p-4 text-muted-foreground">Chargement...</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold md:text-2xl">Utilisateurs</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            Rafraichir
          </Button>
          <Link href="/users/create">
            <Button size="sm">Ajouter</Button>
          </Link>
        </div>
      </div>

      {/* Mobile : cartes */}
      <div className="flex flex-col gap-3 md:hidden">
        {users?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Aucun utilisateur</p>
        )}
        {users?.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="text-base">{user.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p><span className="font-medium">Email :</span> {user.email}</p>
              <p><span className="font-medium">Rôle :</span> {user.role}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Link href={`/users/${user.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Voir</Button>
              </Link>
              <Link href={`/users/${user.id}/edit`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Modifier</Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => handleDelete(user.id)}
                disabled={deleteUser.isPending}
              >
                Supprimer
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
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/users/${user.id}`}>
                      <Button variant="outline" size="sm">Voir</Button>
                    </Link>
                    <Link href={`/users/${user.id}/edit`}>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      disabled={deleteUser.isPending}
                    >
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Aucun utilisateur
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
