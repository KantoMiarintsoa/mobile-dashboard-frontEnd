"use client";

import { useLocale } from "@/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
      title={locale === "fr" ? "Switch to English" : "Passer en français"}
    >
      <span className="text-xs font-bold">{locale.toUpperCase()}</span>
    </Button>
  );
}
