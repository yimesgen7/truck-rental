import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth-options";
import { markBookingPaid } from "@/lib/payments/complete-booking";
import { getStripe } from "@/lib/payments/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, sessionId } = (await request.json()) as {
      bookingId?: string;
      sessionId?: string;
    };

    if (!bookingId || !sessionId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: session.user.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (booking.paymentStatus === "PAID") {
      return NextResponse.json({ ok: true, invoiceNumber: booking.invoiceNumber });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      checkoutSession.payment_status !== "paid" ||
      checkoutSession.metadata?.bookingId !== bookingId
    ) {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const invoiceNumber = await markBookingPaid(
      bookingId,
      "stripe",
      checkoutSession.id
    );

    return NextResponse.json({ ok: true, invoiceNumber });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
