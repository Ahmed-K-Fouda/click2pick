import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

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

// format error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error instanceof ZodError) {
    return error.issues.map((e) => e.message).join(". ");
  }

  if (
    error?.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } is already registered`;
  }

  return typeof error.message === "string"
    ? error.message
    : JSON.stringify(error.message);
}

// Round Number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string!");
  }
}
