import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { verifyPassword } from "better-auth/crypto";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const email = "pradipbisht007@gmail.com";
const password = "changeme";

console.log("Env check:");
console.log("  BETTER_AUTH_SECRET:", !!process.env.BETTER_AUTH_SECRET);
console.log("  AUTH_SECRET:", !!process.env.AUTH_SECRET);
console.log("  BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
console.log("  BASE_AUTH_URL:", process.env.BASE_AUTH_URL);
console.log("  NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

const user = await prisma.user.findUnique({
  where: { email },
  include: { accounts: true },
});

if (!user) {
  console.log("User NOT found");
  process.exit(1);
}

console.log("User:", {
  id: user.id,
  email: user.email,
  role: user.role,
  emailVerified: user.emailVerified,
});

const cred = user.accounts.find((a) => a.providerId === "credential");
console.log(
  "Credential account:",
  cred
    ? { accountId: cred.accountId, hasPassword: !!cred.password }
    : "MISSING",
);

if (cred?.password) {
  const ok = await verifyPassword({ hash: cred.password, password });
  console.log("Password 'changeme' verifies:", ok);
} else {
  console.log("No password hash on credential account");
}

await prisma.$disconnect();
