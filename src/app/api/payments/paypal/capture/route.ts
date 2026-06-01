import { NextResponse } from "next/server";

import { markBookingPaid } from "@/lib/payments/complete-booking";
import { capturePayPalOrder } from "@/lib/payments/paypal";
import { prisma } from "@/lib/prisma";

function appUrl() {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");
  const token = searchParams.get("token");

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
    const orderId = token ?? booking.payment?.transactionId;
    if (orderId) {
      const captured = await capturePayPalOrder(orderId);
      if (captured) {
        await markBookingPaid(bookingId, "paypal", orderId);
      }
    }
  }

  return NextResponse.redirect(
    `${appUrl()}/booking/success?bookingId=${bookingId}`
  );
}
