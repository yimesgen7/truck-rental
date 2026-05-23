import { redirect } from "next/navigation";

import { InvoiceActions } from "@/components/booking/invoice-actions";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/roles";
import { rentalDays } from "@/lib/booking-pricing";
import { prisma } from "@/lib/prisma";
import { PAYMENT_PROVIDER_LABELS } from "@/types/payment";
import type { PaymentProvider } from "@/types/payment";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function InvoicePage({ params }: PageProps) {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const booking = await prisma.booking.findFirst({
    where: isAdmin(session.user.role)
      ? { id }
      : { id, userId: session.user.id },
    include: {
      payment: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!booking || booking.paymentStatus !== "PAID") {
    redirect("/dashboard");
  }

  const days = rentalDays(booking.startDate, booking.endDate);
  const provider = (booking.payment?.provider ?? "stripe") as PaymentProvider;

  return (
    <div className="min-h-screen bg-white text-zinc-900 print:bg-white">
      <div className="mx-auto max-w-3xl px-6 py-12 print:py-8">
        <div className="mb-10 flex items-start justify-between border-b border-zinc-200 pb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
              TruckRent
            </p>
            <h1 className="mt-2 text-3xl font-bold">Invoice</h1>
            <p className="mt-1 font-mono text-sm text-zinc-500">
              {booking.invoiceNumber}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">Date issued</p>
            <p>{formatDate(booking.updatedAt)}</p>
          </div>
        </div>

        <div className="mb-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">Bill to</p>
            <p className="mt-2 font-semibold">{booking.user.name ?? "Customer"}</p>
            <p className="text-zinc-600">{booking.user.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Payment
            </p>
            <p className="mt-2 font-semibold text-green-700">Paid</p>
            <p className="text-zinc-600">
              via {PAYMENT_PROVIDER_LABELS[provider]}
            </p>
          </div>
        </div>

        <table className="mb-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-500">
              <th className="pb-3 font-semibold">Description</th>
              <th className="pb-3 font-semibold">Period</th>
              <th className="pb-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-100">
              <td className="py-4">
                <p className="font-semibold">{booking.truckName}</p>
                <p className="text-zinc-500">
                  {booking.truckBrand} {booking.truckModel}
                </p>
                <p className="mt-1 text-zinc-500">
                  Pickup: {booking.pickupLocation}
                </p>
                <p className="text-zinc-500">
                  Dropoff: {booking.dropoffLocation}
                </p>
                <p className="mt-1 text-zinc-500">
                  Driver:{" "}
                  {booking.driverOption === "with-driver"
                    ? "With driver"
                    : "Self-drive"}
                </p>
              </td>
              <td className="py-4 text-zinc-600">
                {formatDate(booking.startDate)}
                <br />
                to {formatDate(booking.endDate)}
                <br />
                <span className="text-zinc-400">({days} days)</span>
              </td>
              <td className="py-4 text-right font-semibold">
                ${booking.amountTotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="pt-6 text-right font-semibold">
                Total ({booking.currency})
              </td>
              <td className="pt-6 text-right text-2xl font-bold text-orange-600">
                ${booking.amountTotal.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <p className="text-center text-xs text-zinc-400">
          Thank you for choosing TruckRent. Questions? support@truckrent.com
        </p>

        <InvoiceActions />
      </div>
    </div>
  );
}
