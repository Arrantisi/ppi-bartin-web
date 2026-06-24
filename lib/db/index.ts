import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "@/lib/env";

const globalForPrisma = global as unknown as {
	prisma: PrismaClient;
};

const pool = new Pool({
	connectionString: env.DATABASE_URL,
	max: 3,
});

const adapter = new PrismaPg(pool);

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		adapter,
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
