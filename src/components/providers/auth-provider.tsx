"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useMemo } from "react";

import type { AuthUser, UserRole } from "@/types/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function useAuth() {
  const { data: session, status, update } = useSession();

  const user: AuthUser | null = useMemo(() => {
    if (!session?.user?.email) return null;
    return {
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email,
      role: session.user.role as UserRole,
    };
  }, [session]);

  return {
    user,
    isLoading: status === "loading",
    refresh: update,
    logout: () => signOut({ callbackUrl: "/" }),
  };
}
