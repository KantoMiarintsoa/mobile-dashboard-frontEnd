"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useRegister } from "@/features/auth/hooks/use-register";
import { RegisterFormData } from "@/features/auth/schemas/register.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const resolver = classValidatorResolver(RegisterFormData);

export function RegisterForm() {
  const router = useRouter();
  const { mutate, isPending, isError } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver });

  const onSubmit = (data: RegisterFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    mutate(
      {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (response: any) => {
          const token = response.access_token || response.token || response.accessToken;
          if (token) {
            Cookies.set("token", token, { expires: 7 });
          }
          router.push("/dashboard");
        },
      },
    );
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Créer un compte</h1>
          <p className="text-sm text-muted-foreground">Remplissez vos informations</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" placeholder="Votre nom" className="h-11" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="exemple@email.com" className="h-11" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <PasswordInput id="password" placeholder="••••••••" className="h-11" {...register("password")} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <PasswordInput id="confirmPassword" placeholder="••••••••" className="h-11" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          {isError && (
            <p className="text-sm text-red-500 text-center">Erreur lors de l&apos;inscription</p>
          )}
          <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isPending}>
            {isPending ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-primary font-medium underline">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
