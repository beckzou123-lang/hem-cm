import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale } from "@/lib/i18n";

if (typeof window !== "undefined") {
  throw new Error("Locale helpers must not be imported in the browser.");
}

export async function getCurrentLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  if (cookieLocale) {
    return normalizeLocale(cookieLocale);
  }

  try {
    const preference = await prisma.userPreference.findUnique({
      where: { key: "default" },
      select: { language: true }
    });

    return normalizeLocale(preference?.language);
  } catch {
    return DEFAULT_LOCALE;
  }
}
