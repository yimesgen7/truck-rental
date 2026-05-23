import { RowActions } from "@/components/dashboard/row-actions";
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

export function TrucksSection({
  trucks,
}: {
  trucks: DashboardData["trucks"];
}) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Truck management</CardTitle>
        <CardDescription>
          Fleet inventory and availability status.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 pb-0">
        {trucks.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-zinc-500">
            No trucks in the database. Add trucks via Prisma Studio or seed
            data.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-400">Brand / Model</TableHead>
                <TableHead className="text-zinc-400">Price/day</TableHead>
                <TableHead className="text-zinc-400">Capacity</TableHead>
                <TableHead className="text-zinc-400">Bookings</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {trucks.map((truck) => (
                <TableRow
                  key={truck.id}
                  className="border-zinc-800 hover:bg-zinc-950/50"
                >
                  <TableCell className="font-medium text-white">
                    {truck.name}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {truck.brand} {truck.model}
                  </TableCell>
                  <TableCell className="text-orange-500">
                    ${truck.pricePerDay}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {truck.capacity.toLocaleString()} kg
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {truck.bookingsCount}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        truck.available
                          ? "text-xs font-medium text-green-400"
                          : "text-xs font-medium text-red-400"
                      }
                    >
                      {truck.available ? "Available" : "Unavailable"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <RowActions label={truck.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
