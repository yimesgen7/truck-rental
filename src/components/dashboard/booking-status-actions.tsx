"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DashboardData } from "@/lib/dashboard-data";

type BookingRow = DashboardData["bookings"][number];

const statusOptions = [
  { value: "PENDING", label: "Mark pending" },
  { value: "CONFIRMED", label: "Confirm" },
  { value: "COMPLETED", label: "Mark completed" },
  { value: "CANCELLED", label: "Cancel" },
] as const;

export function BookingStatusActions({ booking }: { booking: BookingRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(status: (typeof statusOptions)[number]["value"]) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Update failed");
        return;
      }

      router.refresh();
    } catch {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            className="border-zinc-700 bg-zinc-950 text-zinc-200 hover:bg-zinc-800"
          >
            {loading ? "Saving..." : "Update status"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-zinc-800 bg-zinc-900 text-white"
        >
          <DropdownMenuLabel className="text-zinc-400">
            Booking {booking.id.slice(0, 8)}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-800" />
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              disabled={booking.status === option.value}
              className="focus:bg-zinc-800 focus:text-white"
              onClick={() => updateStatus(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
