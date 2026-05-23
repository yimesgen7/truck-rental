import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth-options";
import { calculateBookingTotal } from "@/lib/booking-pricing";
import { createBookingSchema } from "@/lib/booking-schema";
import { mapPaymentMethodToProvider } from "@/lib/payments/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid booking data" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const pricing = calculateBookingTotal(
      data.pricePerDay,
      startDate,
      endDate,
      data.driverOption
    );

    const provider = mapPaymentMethodToProvider(data.paymentMethod);

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        catalogTruckId: data.catalogTruckId,
        truckName: data.truckName,
        truckBrand: data.truckBrand,
        truckModel: data.truckModel,
        pricePerDay: data.pricePerDay,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        startDate,
        endDate,
        driverOption: data.driverOption,
        paymentMethod: data.paymentMethod,
        amountTotal: pricing.total,
        payment: {
          create: {
            provider,
            amount: pricing.total,
            currency: "USD",
            status: "PENDING",
          },
        },
      },
      include: { payment: true },
    });

    return NextResponse.json({
      bookingId: booking.id,
      amountTotal: booking.amountTotal,
      pricing,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
