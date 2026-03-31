"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useLogin } from "@/features/auth/hooks/use-login";
import { LoginFormData } from "@/features/auth/schemas/login.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const resolver = classValidatorResolver(LoginFormData);

export function LoginForm() {
  const router = useRouter();
  const { mutate, isPending, isError } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver });

  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    mutate(
      { email: formData.get("email") as string, password: formData.get("password") as string },
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
          <h1 className="text-2xl font-bold tracking-tight">Bienvenue</h1>
          <p className="text-sm text-muted-foreground">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              className="h-11"
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              className="h-11"
              {...register("password")}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          {isError && (
            <p className="text-sm text-red-500 text-center">Email ou mot de passe incorrect</p>
          )}
          <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isPending}>
            {isPending ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

      </CardContent>
    </Card>
  );
}
