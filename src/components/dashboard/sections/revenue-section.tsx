import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardData } from "@/lib/dashboard-data";

export function RevenueSection({ data }: { data: DashboardData }) {
  const maxAmount = Math.max(
    ...data.monthlyRevenue.map((m) => m.amount),
    1
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">
              ${data.stats.totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Avg. per booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              $
              {data.bookings.length > 0
                ? Math.round(
                    data.stats.totalRevenue / data.bookings.length
                  ).toLocaleString()
                : 0}
            </p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Confirmed bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {
                data.bookings.filter((b) => b.status === "CONFIRMED").length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Revenue by month</CardTitle>
          <CardDescription>
            Estimated revenue from bookings created each month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-end gap-3">
            {data.monthlyRevenue.map((month) => (
              <div
                key={month.label}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-lg bg-orange-500 transition-all"
                  style={{
                    height: `${Math.max(8, (month.amount / maxAmount) * 100)}%`,
                  }}
                  title={`$${month.amount.toLocaleString()}`}
                />
                <span className="text-xs text-zinc-500">{month.label}</span>
              </div>
            ))}
          </div>
          <ul className="mt-6 space-y-2 border-t border-zinc-800 pt-4">
            {data.monthlyRevenue.map((month) => (
              <li
                key={month.label}
                className="flex justify-between text-sm"
              >
                <span className="text-zinc-400">{month.label}</span>
                <span className="font-medium text-white">
                  ${month.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
