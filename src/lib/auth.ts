import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { emailOTP } from "better-auth/plugins";
import { sendEmailOtp } from "./email";

/**
 * Env names (support both project conventions):
 * - secret: BETTER_AUTH_SECRET or AUTH_SECRET
 * - baseURL: BETTER_AUTH_URL or BASE_AUTH_URL or NEXT_PUBLIC_APP_URL
 *
 * basePath MUST match the App Router folder:
 *   src/app/auth/[...all]/route.ts  →  /auth/*
 * Default Better Auth path is /api/auth — that would 404 here and look like "invalid password".
 */
const authSecret =
  process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET;
const authBaseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.BASE_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

export const auth = betterAuth({
  appName: "Grand Resort",
  baseURL: authBaseURL,
  basePath: "/auth",
  secret: authSecret,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // Allow login after seed; still enforce verify on protected app layout
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // Built-in API rate limits (login / OTP). Memory store is fine for single-server dev.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60 * 15, max: 5 },
      "/email-otp/send-verification-otp": { window: 60 * 10, max: 3 },
      "/email-otp/verify-email": { window: 60 * 10, max: 5 },
      "/email-otp/request-password-reset": { window: 60 * 10, max: 3 },
      "/email-otp/reset-password": { window: 60 * 10, max: 5 },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,

    // if active
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 60 * 10,
      sendVerificationOTP: async ({ email, otp, type }) => {
        await sendEmailOtp({
          to: email,
          otp,
          type,
        });
      },
    }),
  ],
  trustedOrigins: [
    authBaseURL,
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;
