"use client";

import { CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

type SuccessBooking = {
  id: string;
  truckName: string;
  invoiceNumber: string | null;
  paymentStatus: string;
  amountTotal: number;
  currency: string;
  payment: { provider: string } | null;
};

export function BookingSuccessClient({
  booking,
}: {
  booking: SuccessBooking;
}) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verified, setVerified] = useState(booking.paymentStatus === "PAID");
  const [invoiceNumber, setInvoiceNumber] = useState(booking.invoiceNumber);
  const [verifying, setVerifying] = useState(!!sessionId && !verified);

  useEffect(() => {
    if (!sessionId || verified) return;

    async function verifyStripe() {
      try {
        const res = await fetch("/api/payments/stripe/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: booking.id,
            sessionId,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setVerified(true);
          if (data.invoiceNumber) setInvoiceNumber(data.invoiceNumber);
        }
      } finally {
        setVerifying(false);
      }
    }

    verifyStripe();
  }, [sessionId, verified, booking.id]);

  const provider = (booking.payment?.provider ?? "stripe") as PaymentProvider;

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-16 sm:px-6">
        <Card className="border-zinc-800 bg-zinc-900 text-center ring-zinc-800">
          <CardHeader className="items-center">
            <CheckCircle2
              className={`size-16 ${verified ? "text-green-500" : "text-orange-500"}`}
            />
            <CardTitle className="text-2xl text-white">
              {verifying
                ? "Confirming payment..."
                : verified
                  ? "Payment confirmed!"
                  : "Processing payment"}
            </CardTitle>
            <CardDescription>
              {verified
                ? `Your booking for ${booking.truckName} is confirmed.`
                : "Please wait while we verify your payment."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {verified && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left text-sm">
                <p className="text-zinc-500">Amount paid</p>
                <p className="text-xl font-bold text-orange-500">
                  ${booking.amountTotal.toFixed(2)} {booking.currency}
                </p>
                <p className="mt-3 text-zinc-500">Payment via</p>
                <p className="font-medium">
                  {PAYMENT_PROVIDER_LABELS[provider]}
                </p>
                {invoiceNumber && (
                  <>
                    <p className="mt-3 text-zinc-500">Invoice</p>
                    <p className="font-mono font-medium">{invoiceNumber}</p>
                  </>
                )}
              </div>
            )}

            {verified && invoiceNumber && (
              <Button
                asChild
                className="w-full bg-orange-500 text-white hover:bg-orange-600"
              >
                <Link href={`/booking/${booking.id}/invoice`}>
                  <FileText size={18} />
                  View invoice
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              className="w-full border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
            >
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
