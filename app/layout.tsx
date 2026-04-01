import type { Metadata } from "next";

import "@/app/globals.css";

import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/lib/theme-provider";
import { ensureScheduler } from "@/lib/scheduler";
import { LocaleProvider } from "@/lib/locale-provider";
import { getCurrentLocale } from "@/lib/locale";
import { getDictionary, getNavItems } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "HEM-CM",
  description: "Human Event Matrix for Capital Markets"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  ensureScheduler();
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const navItems = getNavItems(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LocaleProvider locale={locale} dictionary={dictionary}>
            <AppShell dictionary={dictionary} navItems={navItems}>
              {children}
            </AppShell>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
