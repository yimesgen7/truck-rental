import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

import { getCatalogTruckSeedData } from "../src/lib/truck-catalog";

const prisma = new PrismaClient();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "admin@example.com")
  .trim()
  .toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123456";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Admin";

async function main() {
  const passwordHash = await hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      role: Role.ADMIN,
      password: passwordHash,
    },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin user seeded: ${admin.email} (${admin.id})`);

  for (const truck of getCatalogTruckSeedData()) {
    const record = await prisma.truck.upsert({
      where: { catalogId: truck.catalogId },
      update: truck,
      create: truck,
    });
    console.log(`Truck seeded: ${record.name} (${record.catalogId})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
