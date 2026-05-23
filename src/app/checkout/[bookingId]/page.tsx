import { redirect } from "next/navigation";
import { Suspense } from "react";

import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getSession } from "@/lib/auth";
import { getBookingForUser } from "@/lib/payments/get-booking";

type PageProps = {
  params: Promise<{ bookingId: string }>;
};

export default async function CheckoutPage({ params }: PageProps) {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/trucks");
  }

  const { bookingId } = await params;
  const booking = await getBookingForUser(bookingId, session.user.id);

  if (!booking) {
    redirect("/trucks");
  }

  const serialized = {
    id: booking.id,
    truckName: booking.truckName,
    truckBrand: booking.truckBrand,
    truckModel: booking.truckModel,
    pickupLocation: booking.pickupLocation,
    dropoffLocation: booking.dropoffLocation,
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
    driverOption: booking.driverOption,
    paymentMethod: booking.paymentMethod,
    amountTotal: booking.amountTotal,
    currency: booking.currency,
    paymentStatus: booking.paymentStatus,
    days: booking.days,
    pricing: booking.pricing,
    payment: booking.payment
      ? { provider: booking.payment.provider }
      : null,
  };

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CheckoutClient booking={serialized} />
    </Suspense>
  );
}
