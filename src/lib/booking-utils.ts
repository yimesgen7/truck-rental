import type { Booking, Payment, Truck, User } from "@prisma/client";

import { calculateBookingTotal } from "@/lib/booking-pricing";
import { prisma } from "@/lib/prisma";

export const BOOKING_CURRENCY = "USD";

export type BookingWithRelations = Booking & {
  truck: Truck;
  payment?: Payment | null;
  user?: Pick<User, "name" | "email"> | null;
};

export function serializeBookingForClient(booking: BookingWithRelations) {
  const pricing = calculateBookingTotal(
    booking.truck.pricePerDay,
    booking.startDate,
    booking.endDate,
    booking.driverOption as "self" | "with-driver"
  );

  return {
    id: booking.id,
    truckName: booking.truck.name,
    truckBrand: booking.truck.brand,
    truckModel: booking.truck.model,
    pickupLocation: booking.pickupLocation,
    dropoffLocation: booking.dropoffLocation,
    startDate: booking.startDate,
    endDate: booking.endDate,
    driverOption: booking.driverOption,
    paymentMethod: booking.paymentMethod,
    amountTotal: booking.totalPrice,
    currency: BOOKING_CURRENCY,
    paymentStatus: booking.paymentStatus,
    status: booking.status,
    invoiceNumber: booking.invoiceNumber,
    pricing,
    payment: booking.payment ?? null,
    user: booking.user ?? null,
  };
}

export async function findTruckByCatalogId(catalogTruckId: string) {
  return prisma.truck.findUnique({
    where: { catalogId: catalogTruckId },
  });
}

export async function hasBookingConflict(
  truckId: string,
  startDate: Date,
  endDate: Date,
  excludeBookingId?: string
) {
  const conflict = await prisma.booking.findFirst({
    where: {
      truckId,
      status: { not: "CANCELLED" },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
    select: { id: true },
  });

  return Boolean(conflict);
}
