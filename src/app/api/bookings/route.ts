import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth-options";
import { calculateBookingTotal } from "@/lib/booking-pricing";
import { createBookingSchema } from "@/lib/booking-schema";
import {
  findTruckByCatalogId,
  hasBookingConflict,
} from "@/lib/booking-utils";
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
    const truck = await findTruckByCatalogId(data.catalogTruckId);

    if (!truck) {
      return NextResponse.json(
        { error: "Truck not found. Run database seed to sync the fleet." },
        { status: 404 }
      );
    }

    if (!truck.available) {
      return NextResponse.json(
        { error: "This truck is not available for booking." },
        { status: 400 }
      );
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (await hasBookingConflict(truck.id, startDate, endDate)) {
      return NextResponse.json(
        { error: "This truck is already booked for the selected dates." },
        { status: 409 }
      );
    }

    const pricing = calculateBookingTotal(
      truck.pricePerDay,
      startDate,
      endDate,
      data.driverOption
    );

    const provider = mapPaymentMethodToProvider(data.paymentMethod);

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        truckId: truck.id,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        startDate,
        endDate,
        driverOption: data.driverOption,
        paymentMethod: data.paymentMethod,
        totalPrice: pricing.total,
        payment: {
          create: {
            provider,
            amount: pricing.total,
            status: "PENDING",
          },
        },
      },
      include: { payment: true },
    });

    return NextResponse.json({
      bookingId: booking.id,
      amountTotal: booking.totalPrice,
      pricing,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
