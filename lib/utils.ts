import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeToHundred(values: number[]) {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    const equal = 100 / values.length;
    return values.map(() => Number(equal.toFixed(2)));
  }

  return values.map((value, index) => {
    if (index === values.length - 1) {
      const subtotal = values
        .slice(0, -1)
        .map((item) => Number(((item / total) * 100).toFixed(2)))
        .reduce((sum, item) => sum + item, 0);

      return Number((100 - subtotal).toFixed(2));
    }

    return Number(((value / total) * 100).toFixed(2));
  });
}

export function scoreDirection(score: number) {
  if (score >= 56) return "POSITIVE";
  if (score <= 44) return "NEGATIVE";
  return "NEUTRAL";
}

export function daysBetween(start: string | Date, end: string | Date) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000));
}

export function formatScore(value: number) {
  return Number(value.toFixed(1));
}

export function uniq<T>(items: T[]) {
  return [...new Set(items)];
}
