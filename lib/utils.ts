import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert prisma obj to regular js obj
export function convertToPlainObj<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// format number with decimal

export function formatNumberWithDecimal(val: number): string {
  const [int, dec] = val.toString().split(".");
  return dec ? `${int}.${dec.padEnd(2, "0")}` : `${int}.00`;
}
