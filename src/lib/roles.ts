import type { UserRole } from "@/types/auth";

export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const satisfies Record<string, UserRole>;

export function isAdmin(role: UserRole | undefined): boolean {
  return role === ROLES.ADMIN;
}
