import { BookingStatusActions } from "@/components/dashboard/booking-status-actions";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardData } from "@/lib/dashboard-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BookingsSection({ data }: { data: DashboardData }) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Bookings</CardTitle>
        <CardDescription>
          {data.isAdmin
            ? "All rental bookings across the platform."
            : "Your rental bookings."}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 pb-0">
        {data.bookings.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-zinc-500">
            No bookings yet. Book a truck from the fleet page.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                {data.isAdmin && (
                  <TableHead className="text-zinc-400">Customer</TableHead>
                )}
                <TableHead className="text-zinc-400">Truck</TableHead>
                <TableHead className="text-zinc-400">Dates</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Revenue</TableHead>
                {data.isAdmin && (
                  <TableHead className="text-zinc-400">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="border-zinc-800 hover:bg-zinc-950/50"
                >
                  {data.isAdmin && (
                    <TableCell className="text-zinc-300">
                      <div>
                        <p className="font-medium">
                          {booking.user.name ?? "—"}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {booking.user.email}
                        </p>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="font-medium text-white">
                    {booking.truckName}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDate(booking.startDate)} –{" "}
                    {formatDate(booking.endDate)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="text-orange-500">
                    ${booking.revenue.toLocaleString()}
                  </TableCell>
                  {data.isAdmin && (
                    <TableCell>
                      <BookingStatusActions booking={booking} />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
