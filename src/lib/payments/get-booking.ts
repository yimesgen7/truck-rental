import { rentalDays } from "@/lib/booking-pricing";
import { serializeBookingForClient } from "@/lib/booking-utils";
import { prisma } from "@/lib/prisma";

export async function getBookingForUser(bookingId: string, userId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: {
      payment: true,
      truck: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!booking) return null;

  const serialized = serializeBookingForClient(booking);

  return {
    ...serialized,
    days: rentalDays(booking.startDate, booking.endDate),
  };
}
