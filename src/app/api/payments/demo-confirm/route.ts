import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth-options";
import { markBookingPaid } from "@/lib/payments/complete-booking";
import { prisma } from "@/lib/prisma";
import type { PaymentProvider } from "@/types/payment";

function appUrl() {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.redirect(`${appUrl()}/`);
  }

  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");

  if (!bookingId || !session?.user?.id) {
    return NextResponse.redirect(`${appUrl()}/login`);
  }

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId: session.user.id },
    include: { payment: true },
  });

  if (!booking) {
    return NextResponse.redirect(`${appUrl()}/trucks`);
  }

  if (booking.paymentStatus !== "PAID") {
    await markBookingPaid(
      booking.id,
      (booking.payment?.provider as PaymentProvider) ?? "stripe",
      "demo-payment"
    );
  }

  return NextResponse.redirect(
    `${appUrl()}/booking/success?bookingId=${booking.id}`
  );
}
