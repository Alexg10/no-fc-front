import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const colorMap: Record<string, { text: string; bg: string; rgb: string }> = {
  pink: { text: "text-pink", bg: "bg-pink", rgb: "255, 90, 133" },
  lime: { text: "text-lime", bg: "bg-lime", rgb: "231, 255, 109" },
  blue: { text: "text-blue", bg: "bg-blue", rgb: "109, 231, 255" },
  white: { text: "text-white", bg: "bg-white", rgb: "255, 255, 255" },
  black: { text: "text-black", bg: "bg-black", rgb: "0, 0, 0" },
  grey: { text: "text-grey", bg: "bg-grey", rgb: "180, 180, 180" },
};

export function getColorClass(
  color?: string,
  type: "text" | "bg" = "text",
): string {
  return color ? colorMap[color]?.[type] || "" : "";
}

export function getRepeatShadow(color?: string, opacity = 1): string {
  const rgb = color ? colorMap[color]?.rgb || "255, 255, 255" : "255, 255, 255";
  const step = 0.85;
  const shadows = [
    `-0em -${step}em 0em rgba(${rgb}, ${opacity})`,
    `-0em -${step * 2}em 0em rgba(${rgb}, ${opacity})`,
    ...Array.from(
      { length: 50 },
      (_, i) => `0em ${(i + 1) * step}em 0em rgba(${rgb}, ${opacity})`,
    ),
  ];
  return shadows.join(", ");
}
