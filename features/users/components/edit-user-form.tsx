"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useUser } from "@/features/users/hooks/use-users";
import { useUpdateUser } from "@/features/users/hooks/use-user-mutations";
import { UpdateUserFormData } from "@/features/users/schemas/user.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const resolver = classValidatorResolver(UpdateUserFormData);

interface EditUserFormProps {
  id: string;
}

export function EditUserForm({ id }: EditUserFormProps) {
  const router = useRouter();
  const { data: user, isLoading } = useUser(id);
  const { mutate, isPending, isError } = useUpdateUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormData>({ resolver });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email });
    }
  }, [user, reset]);

  const onSubmit = (data: UpdateUserFormData) => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.email) formData.append("email", data.email);

    mutate(
      {
        id,
        data: {
          name: formData.get("name") as string | undefined,
          email: formData.get("email") as string | undefined,
        },
      },
      { onSuccess: () => router.push(`/users/${id}`) },
    );
  };

  if (isLoading) return <p className="p-4 text-muted-foreground">Chargement...</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href={`/users/${id}`}>
          <Button variant="ghost" size="sm">&larr; Retour</Button>
        </Link>
        <h1 className="text-xl font-bold md:text-2xl">Modifier l&apos;utilisateur</h1>
      </div>
      <Card className="w-full max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Modifier</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            {isError && (
              <p className="text-sm text-red-500">Erreur lors de la mise à jour</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
              {isPending ? "Mise à jour..." : "Enregistrer"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
