"use client";

import { createContext, useContext, useMemo } from "react";

import type { Dictionary, Locale } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dictionary,
  children
}: LocaleContextValue & { children: React.ReactNode }) {
  return <LocaleContext.Provider value={{ locale, dictionary }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("LocaleProvider is missing.");
  return context.locale;
}

export function useDictionary() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("LocaleProvider is missing.");
  return context.dictionary;
}

export function useT() {
  const dictionary = useDictionary();

  return useMemo(() => {
    return (path: string) => {
      const chunks = path.split(".").filter(Boolean);
      let node: unknown = dictionary;

      for (const chunk of chunks) {
        if (!node || typeof node !== "object") return path;
        node = (node as Record<string, unknown>)[chunk];
      }

      return typeof node === "string" ? node : path;
    };
  }, [dictionary]);
}
