export const ROLES = { USER: "USER", ADMIN: "ADMIN" } as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  admin: "/admin",
} as const;
