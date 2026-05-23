import { prisma } from "@/lib/prisma";

function daysBetween(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function bookingRevenue(
  startDate: Date,
  endDate: Date,
  pricePerDay: number
) {
  return daysBetween(startDate, endDate) * pricePerDay;
}

export async function getDashboardData(userId: string, isAdmin: boolean) {
  const bookingsWhere = isAdmin ? {} : { userId };

  const [bookings, users, trucks, userCount, truckCount] = await Promise.all([
    prisma.booking.findMany({
      where: bookingsWhere,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    isAdmin
      ? prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: { select: { bookings: true } },
          },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    isAdmin
      ? prisma.truck.findMany({
          include: { _count: { select: { bookings: true } } },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    isAdmin ? prisma.user.count() : Promise.resolve(0),
    isAdmin ? prisma.truck.count() : Promise.resolve(0),
  ]);

  const bookingsWithRevenue = bookings.map((b) => ({
    id: b.id,
    status: b.status,
    paymentStatus: b.paymentStatus,
    startDate: b.startDate.toISOString(),
    endDate: b.endDate.toISOString(),
    createdAt: b.createdAt.toISOString(),
    revenue: bookingRevenue(b.startDate, b.endDate, b.pricePerDay),
    amountTotal: b.amountTotal,
    user: b.user,
    truckName: b.truckName,
  }));

  const totalRevenue = bookingsWithRevenue.reduce((sum, b) => sum + b.revenue, 0);
  const pendingBookings = bookingsWithRevenue.filter(
    (b) => b.status === "PENDING"
  ).length;

  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const label = d.toLocaleString("default", { month: "short" });
    const month = d.getMonth();
    const year = d.getFullYear();
    const amount = bookingsWithRevenue
      .filter((b) => {
        const created = new Date(b.createdAt);
        return created.getMonth() === month && created.getFullYear() === year;
      })
      .reduce((sum, b) => sum + b.revenue, 0);
    return { label, amount };
  });

  return {
    isAdmin,
    stats: {
      totalBookings: bookings.length,
      totalUsers: userCount,
      totalTrucks: truckCount,
      totalRevenue,
      pendingBookings,
    },
    bookings: bookingsWithRevenue,
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      bookingsCount: u._count.bookings,
    })),
    trucks: trucks.map((t) => ({
      id: t.id,
      name: t.name,
      brand: t.brand,
      model: t.model,
      pricePerDay: t.pricePerDay,
      capacity: t.capacity,
      available: t.available,
      bookingsCount: t._count.bookings,
      createdAt: t.createdAt.toISOString(),
    })),
    monthlyRevenue,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
