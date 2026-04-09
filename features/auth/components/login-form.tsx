"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { useLocale } from "@/providers/locale-provider";

const resolver = classValidatorResolver(LoginFormData);

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const { mutate, isPending } = useLogin();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver,
    defaultValues: {
      email: searchParams.get("email") || "",
      password: searchParams.get("password") || "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null);
    mutate(
      { email: data.email, password: data.password },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (response: any) => {
          const token = response.access_token || response.token || response.accessToken;
          if (token) {
            Cookies.set("token", token, { expires: 7 });
          }
          router.push("/dashboard");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          const message = error?.response?.data?.message;
          if (message === "ACCOUNT_DISABLED") {
            setErrorMessage(t("login.account_disabled"));
          } else {
            setErrorMessage(t("login.error"));
          }
        },
      },
    );
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{t("login.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("login.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t("login.email")}</Label>
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
            <Label htmlFor="password">{t("login.password")}</Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              className="h-11"
              {...register("password")}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          {errorMessage && (
            <p className="text-sm text-red-500 text-center">{errorMessage}</p>
          )}
          <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isPending}>
            {isPending ? t("login.loading") : t("login.submit")}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          {t("login.no_account")}{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            {t("login.register_link")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
