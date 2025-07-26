"use server";
import { prisma } from "@/db/prisma";
import { convertToPlainObj } from "../utils";
import { LATEST_PRODUCT_LIMIT } from "../constants";

export async function getLatestProduct() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  return convertToPlainObj(data);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug: slug },
  });
}
