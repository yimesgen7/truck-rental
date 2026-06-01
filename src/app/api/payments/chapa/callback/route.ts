import { NextResponse } from "next/server";

import { markBookingPaid } from "@/lib/payments/complete-booking";
import { verifyChapaTransaction } from "@/lib/payments/chapa";
import { prisma } from "@/lib/prisma";

function appUrl() {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");
  const trxRef = searchParams.get("trx_ref");

  if (!bookingId) {
    return NextResponse.redirect(`${appUrl()}/trucks`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  });

  if (!booking) {
    return NextResponse.redirect(`${appUrl()}/trucks`);
  }

  if (booking.paymentStatus !== "PAID") {
    const ref =
      trxRef ?? booking.payment?.transactionId ?? `truckrent-${bookingId}`;
    const verified = await verifyChapaTransaction(ref);
    if (verified) {
      await markBookingPaid(bookingId, "chapa", ref);
    }
  }

  return NextResponse.redirect(
    `${appUrl()}/booking/success?bookingId=${bookingId}`
  );
}
