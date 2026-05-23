import { prisma } from "@/lib/prisma";
import { calculateBookingTotal, rentalDays } from "@/lib/booking-pricing";

export async function getBookingForUser(bookingId: string, userId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: {
      payment: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!booking) return null;

  const pricing = calculateBookingTotal(
    booking.pricePerDay,
    booking.startDate,
    booking.endDate,
    booking.driverOption as "self" | "with-driver"
  );

  return {
    ...booking,
    days: rentalDays(booking.startDate, booking.endDate),
    pricing,
  };
}
