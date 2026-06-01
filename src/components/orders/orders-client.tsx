"use client";

import { CalendarDays, MapPin, Package, Truck } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UserOrder } from "@/lib/user-orders-data";
import { cn } from "@/lib/utils";

const TRACKING_STEPS = [
  { key: "PENDING", label: "Submitted" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "COMPLETED", label: "Completed" },
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function stepIndex(status: string) {
  if (status === "CANCELLED") return -1;
  const idx = TRACKING_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

function OrderTracker({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
        This order was cancelled.
      </p>
    );
  }

  const current = stepIndex(status);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-center sm:gap-0">
      {TRACKING_STEPS.map((step, i) => {
        const done = i <= current;
        const active = i === current;
        return (
          <li
            key={step.key}
            className={cn(
              "flex flex-1 items-center gap-2 sm:flex-col sm:gap-1 sm:text-center",
              i < TRACKING_STEPS.length - 1 &&
                "sm:after:mx-2 sm:after:h-px sm:after:flex-1 sm:after:bg-zinc-800 sm:after:content-['']"
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                done
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-zinc-700 bg-zinc-950 text-zinc-500"
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                active ? "text-orange-400" : done ? "text-zinc-300" : "text-zinc-600"
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function OrderCard({ order }: { order: UserOrder }) {
  const needsPayment = order.paymentStatus !== "PAID" && order.status !== "CANCELLED";

  return (
    <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div>
          <CardDescription className="font-mono text-xs text-zinc-500">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </CardDescription>
          <CardTitle className="mt-1 flex items-center gap-2 text-white">
            <Truck className="text-orange-500" size={20} />
            {order.truckName}
          </CardTitle>
          <p className="mt-1 text-sm text-zinc-500">
            {order.truckBrand} {order.truckModel}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={order.status} />
          <span
            className={cn(
              "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
              order.paymentStatus === "PAID"
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-zinc-600 bg-zinc-800 text-zinc-400"
            )}
          >
            Payment: {order.paymentStatus}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 text-sm text-zinc-400 sm:grid-cols-2">
          <p className="flex items-center gap-2">
            <CalendarDays size={16} className="shrink-0 text-orange-500" />
            {formatDate(order.startDate)} – {formatDate(order.endDate)}
          </p>
          <p className="flex items-start gap-2 sm:col-span-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-orange-500" />
            <span>
              {order.pickupLocation} → {order.dropoffLocation}
            </span>
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Order progress
          </p>
          <OrderTracker status={order.status} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4">
          <p className="text-lg font-semibold text-orange-500">
            ${order.amountTotal.toLocaleString()} {order.currency}
          </p>
          <div className="flex flex-wrap gap-2">
            {needsPayment && (
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href={`/checkout/${order.id}`}>Complete payment</Link>
              </Button>
            )}
            {order.paymentStatus === "PAID" && (
              <Button asChild variant="outline" className="border-zinc-700">
                <Link href={`/booking/${order.id}/invoice`}>View invoice</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type OrdersClientProps = {
  orders: UserOrder[];
  userName: string;
};

export function OrdersClient({ orders, userName }: OrdersClientProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              TruckRent
            </p>
            <h1 className="mt-1 text-2xl font-bold lg:text-3xl">Track your orders</h1>
            <p className="mt-1 text-sm text-zinc-500">Welcome back, {userName}</p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        {orders.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800">
            <CardContent className="flex flex-col items-center py-16 text-center">
              <Package className="mb-4 text-zinc-600" size={48} />
              <p className="text-lg font-medium text-white">No orders yet</p>
              <p className="mt-2 max-w-sm text-sm text-zinc-500">
                When you rent a truck, your bookings will show up here so you can
                track status and payment.
              </p>
              <Button asChild className="mt-6 bg-orange-500 hover:bg-orange-600">
                <Link href="/trucks">Browse trucks</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-6">
            {orders.map((order) => (
              <li key={order.id}>
                <OrderCard order={order} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
