import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getColorClass(color?: string): string {
  const colorMap: Record<string, string> = {
    pink: "text-pink",
    lime: "text-lime",
    blue: "text-blue",
  }
  return color ? colorMap[color] || "" : ""
}
