"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "rounded-xl px-3 py-2 text-sm transition",
        active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}
