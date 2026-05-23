"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type TrucksPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export function TrucksPagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: TrucksPaginationProps) {
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
      <p className="text-sm text-zinc-500">
        Page {page} of {totalPages} · {totalItems} truck
        {totalItems === 1 ? "" : "s"}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`hidden size-10 rounded-xl text-sm font-semibold transition sm:inline-flex sm:items-center sm:justify-center ${
              p === page
                ? "bg-orange-500 text-white"
                : "border border-zinc-700 hover:bg-zinc-900"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
