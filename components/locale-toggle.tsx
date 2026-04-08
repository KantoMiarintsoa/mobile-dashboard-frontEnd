"use client";

import { Globe } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as "fr" | "en")}>
      <SelectTrigger className="w-auto gap-1.5 h-9 px-2 border-none shadow-none bg-transparent">
        <Globe className="size-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="fr">FR</SelectItem>
        <SelectItem value="en">EN</SelectItem>
      </SelectContent>
    </Select>
  );
}
