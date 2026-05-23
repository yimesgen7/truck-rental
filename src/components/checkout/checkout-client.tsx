"use client";

import {
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PAYMENT_PROVIDER_LABELS } from "@/types/payment";
import type { PaymentProvider } from "@/types/payment";

type CheckoutBooking = {
  id: string;
  truckName: string;
  truckBrand: string;
  truckModel: string;
  pickupLocation: string;
  dropoffLocation: string;
  startDate: string;
  endDate: string;
  driverOption: string;
  paymentMethod: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  days: number;
  pricing: {
    days: number;
    base: number;
    driverFee: number;
    total: number;
  };
  payment: {
    provider: string;
  } | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function CheckoutClient({ booking }: { booking: CheckoutBooking }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const provider = (booking.payment?.provider ?? "stripe") as PaymentProvider;

  async function handlePay() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Payment failed to start.");
        return;
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      setError("No payment URL returned.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (booking.paymentStatus === "PAID") {
    router.replace(`/booking/success?bookingId=${booking.id}`);
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
        <p className="font-semibold uppercase tracking-widest text-orange-500">
          Checkout
        </p>
        <h1 className="mt-2 text-3xl font-bold">Complete your payment</h1>
        <p className="mt-2 text-zinc-400">
          Pay securely with {PAYMENT_PROVIDER_LABELS[provider]}.
        </p>

        {cancelled && (
          <p className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            Payment was cancelled. You can try again below.
          </p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Truck className="text-orange-500" size={20} />
                Booking summary
              </CardTitle>
              <CardDescription>
                {booking.truckBrand} {booking.truckModel}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-2xl font-bold text-white">{booking.truckName}</p>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-orange-500" />
                <div>
                  <p>
                    <span className="text-zinc-500">Pickup:</span>{" "}
                    {booking.pickupLocation}
                  </p>
                  <p className="mt-1">
                    <span className="text-zinc-500">Dropoff:</span>{" "}
                    {booking.dropoffLocation}
                  </p>
                </div>
              </div>
              <p className="text-zinc-400">
                {formatDate(booking.startDate)} → {formatDate(booking.endDate)}{" "}
                <span className="text-zinc-500">({booking.days} days)</span>
              </p>
              <p className="text-zinc-400">
                Driver:{" "}
                {booking.driverOption === "with-driver"
                  ? "Professional driver included"
                  : "Self-drive"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Payment</CardTitle>
              <CardDescription>
                Provider: {PAYMENT_PROVIDER_LABELS[provider]}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 border-b border-zinc-800 pb-4 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Rental ({booking.pricing.days} days)</span>
                  <span>${booking.pricing.base.toFixed(2)}</span>
                </div>
                {booking.pricing.driverFee > 0 && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Driver fee</span>
                    <span>${booking.pricing.driverFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span className="text-orange-500">
                    ${booking.amountTotal.toFixed(2)} {booking.currency}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <ShieldCheck size={14} className="text-green-500" />
                Encrypted payment processing
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-orange-500 py-6 text-base font-semibold text-white hover:bg-orange-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pay with {PAYMENT_PROVIDER_LABELS[provider]}
                  </>
                )}
              </Button>

              <Link
                href="/trucks"
                className="block text-center text-sm text-zinc-500 hover:text-zinc-300"
              >
                Cancel and return to trucks
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
