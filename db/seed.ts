import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

async function main() {
  const prisma = new PrismaClient();
  // seed product
  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });

  // seed user
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({ data: sampleData.users });
}
main();
