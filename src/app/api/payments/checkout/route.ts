import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth-options";
import { BOOKING_CURRENCY } from "@/lib/booking-utils";
import { initializeChapaPayment } from "@/lib/payments/chapa";
import { createPayPalOrder } from "@/lib/payments/paypal";
import { getStripe } from "@/lib/payments/stripe";
import { prisma } from "@/lib/prisma";

function appUrl() {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = (await request.json()) as { bookingId?: string };
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: session.user.id },
      include: { payment: true, user: true, truck: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.paymentStatus === "PAID") {
      return NextResponse.json({
        redirectUrl: `${appUrl()}/booking/success?bookingId=${booking.id}`,
      });
    }

    const provider = booking.payment?.provider ?? "stripe";
    const base = appUrl();
    const successUrl = `${base}/booking/success?bookingId=${booking.id}`;
    const cancelUrl = `${base}/checkout/${booking.id}?cancelled=1`;
    const currency = BOOKING_CURRENCY.toLowerCase();

    if (provider === "stripe") {
      const stripe = getStripe();
      if (!stripe) {
        return NextResponse.json({
          demoMode: true,
          redirectUrl: `${base}/api/payments/demo-confirm?bookingId=${booking.id}`,
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: booking.user.email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency,
              unit_amount: Math.round(booking.totalPrice * 100),
              product_data: {
                name: `${booking.truck.name} rental`,
                description: `${booking.truck.brand} ${booking.truck.model}`,
              },
            },
          },
        ],
        metadata: { bookingId: booking.id },
        success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
      });

      await prisma.payment.update({
        where: { bookingId: booking.id },
        data: { transactionId: checkoutSession.id },
      });

      return NextResponse.json({ redirectUrl: checkoutSession.url });
    }

    if (provider === "chapa") {
      const names = (booking.user.name ?? "TruckRent User").split(" ");
      const chapaUrl = await initializeChapaPayment({
        amount: booking.totalPrice,
        currency: BOOKING_CURRENCY,
        email: booking.user.email,
        firstName: names[0] ?? "TruckRent",
        lastName: names.slice(1).join(" ") || "Customer",
        txRef: `truckrent-${booking.id}`,
        callbackUrl: `${base}/api/payments/chapa/callback?bookingId=${booking.id}`,
        returnUrl: successUrl,
      });

      if (!chapaUrl) {
        return NextResponse.json({
          demoMode: true,
          redirectUrl: `${base}/api/payments/demo-confirm?bookingId=${booking.id}`,
        });
      }

      await prisma.payment.update({
        where: { bookingId: booking.id },
        data: { transactionId: `truckrent-${booking.id}` },
      });

      return NextResponse.json({ redirectUrl: chapaUrl });
    }

    if (provider === "paypal") {
      const paypal = await createPayPalOrder({
        amount: booking.totalPrice,
        currency: BOOKING_CURRENCY,
        bookingId: booking.id,
        returnUrl: `${base}/api/payments/paypal/capture?bookingId=${booking.id}`,
        cancelUrl,
      });

      if (!paypal) {
        return NextResponse.json({
          demoMode: true,
          redirectUrl: `${base}/api/payments/demo-confirm?bookingId=${booking.id}`,
        });
      }

      await prisma.payment.update({
        where: { bookingId: booking.id },
        data: { transactionId: paypal.orderId },
      });

      return NextResponse.json({ redirectUrl: paypal.approveUrl });
    }

    return NextResponse.json({ error: "Unknown payment provider" }, { status: 400 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
