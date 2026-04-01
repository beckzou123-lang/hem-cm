"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/locale-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === "dark" ? "light" : "dark";
  const Icon = resolvedTheme === "dark" ? SunMedium : MoonStar;
  const dictionary = useDictionary();

  return (
    <Button variant="secondary" size="sm" onClick={() => setTheme(next)}>
      <Icon className="h-4 w-4" />
      {resolvedTheme === "dark" ? dictionary.theme.toggleToLight : dictionary.theme.toggleToDark}
    </Button>
  );
}
