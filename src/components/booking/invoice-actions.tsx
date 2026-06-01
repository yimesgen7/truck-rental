"use client";

import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { isAdmin } from "@/lib/roles";

export function InvoiceActions() {
  const { user } = useAuth();
  const backHref = user && isAdmin(user.role) ? "/dashboard" : "/orders";
  const backLabel = user && isAdmin(user.role) ? "Dashboard" : "Track orders";

  return (
    <div className="mt-10 flex justify-center gap-4 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
      >
        Print invoice
      </button>
      <Link
        href={backHref}
        className="rounded-xl border border-zinc-300 px-6 py-2.5 text-sm font-semibold hover:bg-zinc-50"
      >
        {backLabel}
      </Link>
    </div>
  );
}
