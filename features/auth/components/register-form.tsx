"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useRegister } from "@/features/auth/hooks/use-register";
import { RegisterFormData } from "@/features/auth/schemas/register.schema";
import { useLocale } from "@/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const resolver = classValidatorResolver(RegisterFormData);

export function RegisterForm() {
  const router = useRouter();
  const { t } = useLocale();
  const { mutate, isPending, isError } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver });

  const onSubmit = (data: RegisterFormData) => {
    mutate(
      { name: data.name, email: data.email, password: data.password },
      {
        onSuccess: () => {
          router.push(`/login?email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`);
        },
      },
    );
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{t("register.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("register.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">{t("register.name")}</Label>
            <Input id="name" placeholder={t("register.name")} className="h-11" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t("register.email")}</Label>
            <Input id="email" type="email" placeholder="exemple@email.com" className="h-11" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t("register.password")}</Label>
            <PasswordInput id="password" placeholder="••••••••" className="h-11" {...register("password")} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          {isError && (
            <p className="text-sm text-red-500 text-center">{t("register.error")}</p>
          )}
          <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isPending}>
            {isPending ? t("register.loading") : t("register.submit")}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          {t("register.has_account")}{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            {t("register.login_link")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
