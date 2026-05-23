"use client";

import Link from "next/link";

export function InvoiceActions() {
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
        href="/dashboard"
        className="rounded-xl border border-zinc-300 px-6 py-2.5 text-sm font-semibold hover:bg-zinc-50"
      >
        Dashboard
      </Link>
    </div>
  );
}
