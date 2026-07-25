import { headers } from "next/headers";
import { auth } from "../auth";
import { AuthError } from "../security/errors";
import { isAdmin } from "../security/permissions";

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

// must be logged In
export async function requireSession() {
  const session = await getServerSession();

  if (!session) {
    throw new AuthError("UNAUTHORIZED", "Sign in required");
  }
  return session;
}

// Must be Admin

export async function requireAdminSession() {
  const session = await requireSession();

  if (!isAdmin(session.user.role as string | undefined)) {
    throw new AuthError("FORBIDDEN", "Admin Access Required");
  }
  return session;
}
