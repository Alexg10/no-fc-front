import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getColorClass(color?: string, type: 'text' | 'bg' = 'text'): string {
  const colorMap: Record<string, Record<'text' | 'bg', string>> = {
    pink: { text: "text-pink", bg: "bg-pink" },
    lime: { text: "text-lime", bg: "bg-lime" },
    blue: { text: "text-blue", bg: "bg-blue" },
  }
  return color ? colorMap[color]?.[type] || "" : ""
}
