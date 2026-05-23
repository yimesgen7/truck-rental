import { redirect } from "next/navigation";
import { Suspense } from "react";

import { BookingSuccessClient } from "@/components/booking/booking-success-client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  searchParams: Promise<{ bookingId?: string }>;
};

async function SuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { bookingId } = await searchParams;
  if (!bookingId) {
    redirect("/trucks");
  }

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId: session.user.id },
    include: { payment: true },
  });

  if (!booking) {
    redirect("/trucks");
  }

  return (
    <BookingSuccessClient
      booking={{
        id: booking.id,
        truckName: booking.truckName,
        invoiceNumber: booking.invoiceNumber,
        paymentStatus: booking.paymentStatus,
        amountTotal: booking.amountTotal,
        currency: booking.currency,
        payment: booking.payment
          ? { provider: booking.payment.provider }
          : null,
      }}
    />
  );
}

export default function BookingSuccessPage(props: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SuccessContent searchParams={props.searchParams} />
    </Suspense>
  );
}
