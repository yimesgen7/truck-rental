import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import type { UserRole } from "@/types/auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  return session;
}

export async function requireRole(role: UserRole) {
  const session = await getSession();
  if (!session?.user || session.user.role !== role) {
    return null;
  }
  return session;
}
