import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAutoPrice(str: string | null | undefined): number {
  if (!str) return 500000;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const min = 500000;
  const max = 1000000;
  const range = max - min;
  const steps = range / 50000;
  const step = Math.abs(hash % (steps + 1));
  return min + step * 50000;
}
