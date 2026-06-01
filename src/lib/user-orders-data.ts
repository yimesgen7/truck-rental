import { prisma } from "@/lib/prisma";

export async function getUserOrders(userId: string) {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      truck: { select: { name: true, brand: true, model: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings.map((b) => ({
    id: b.id,
    status: b.status,
    paymentStatus: b.paymentStatus,
    truckName: b.truck.name,
    truckBrand: b.truck.brand,
    truckModel: b.truck.model,
    pickupLocation: b.pickupLocation,
    dropoffLocation: b.dropoffLocation,
    startDate: b.startDate.toISOString(),
    endDate: b.endDate.toISOString(),
    amountTotal: b.totalPrice,
    currency: "USD",
    createdAt: b.createdAt.toISOString(),
  }));
}

export type UserOrder = Awaited<ReturnType<typeof getUserOrders>>[number];
