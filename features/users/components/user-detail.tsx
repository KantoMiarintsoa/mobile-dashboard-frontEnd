"use client";

import Link from "next/link";
import { useUser } from "@/features/users/hooks/use-users";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface UserDetailProps {
  id: string;
}

export function UserDetail({ id }: UserDetailProps) {
  const { data: user, isLoading } = useUser(id);
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["users", id] });
  };

  if (isLoading) return <p className="p-4 text-muted-foreground">Chargement...</p>;
  if (!user) return <p className="p-4">Utilisateur introuvable</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Link href="/users">
          <Button variant="ghost" size="sm">&larr; Retour</Button>
        </Link>
        <h1 className="text-xl font-bold md:text-2xl">Détail utilisateur</h1>
        <Button variant="outline" size="sm" className="ml-auto" onClick={handleRefresh}>
          Rafraichir
        </Button>
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div>
            <span className="font-medium">Email : </span>
            {user.email}
          </div>
          <div>
            <span className="font-medium">Rôle : </span>
            {user.role}
          </div>
          <div>
            <span className="font-medium">Créé le : </span>
            {new Date(user.createdAt).toLocaleDateString("fr-FR")}
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/users/${user.id}/edit`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Modifier</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
