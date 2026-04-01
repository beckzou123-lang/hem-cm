"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

export function RouteSelect({
  basePath,
  paramName,
  value,
  options
}: {
  basePath: string;
  paramName: string;
  value: string;
  options: Option[];
}) {
  const router = useRouter();

  return (
    <select
      name={paramName}
      value={value}
      className={cn(
        "flex h-10 w-full rounded-xl border border-border bg-background/70 px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      )}
      onChange={(event) => {
        const nextValue = event.target.value;
        router.push(`${basePath}?${paramName}=${encodeURIComponent(nextValue)}`);
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
