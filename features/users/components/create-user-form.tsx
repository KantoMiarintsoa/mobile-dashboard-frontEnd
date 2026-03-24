"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useCreateUser } from "@/features/users/hooks/use-user-mutations";
import { CreateUserFormData } from "@/features/users/schemas/user.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const resolver = classValidatorResolver(CreateUserFormData);

export function CreateUserForm() {
  const router = useRouter();
  const { mutate, isPending, isError } = useCreateUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({ resolver });

  const onSubmit = (data: CreateUserFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);

    mutate(
      {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        role: formData.get("role") as string,
      },
      { onSuccess: () => router.push("/users") },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="/users">
          <Button variant="ghost" size="sm">&larr; Retour</Button>
        </Link>
        <h1 className="text-xl font-bold md:text-2xl">Ajouter un utilisateur</h1>
      </div>
      <Card className="w-full max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Nouvel utilisateur</CardTitle>
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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <PasswordInput id="password" {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role">Rôle</Label>
              <Input id="role" {...register("role")} />
              {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
            </div>
            {isError && (
              <p className="text-sm text-red-500">Erreur lors de la création</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
              {isPending ? "Création..." : "Créer"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
