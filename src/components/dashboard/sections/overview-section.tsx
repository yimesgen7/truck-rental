import {
  CalendarDays,
  Clock,
  DollarSign,
  Truck,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardData } from "@/lib/dashboard-data";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof Users;
}) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">
          {title}
        </CardTitle>
        <Icon className="text-orange-500" size={20} />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-white">{value}</p>
        <CardDescription className="mt-1 text-zinc-500">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export function OverviewSection({ data }: { data: DashboardData }) {
  const { stats } = data;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total bookings"
          value={String(stats.totalBookings)}
          description="All rental requests"
          icon={CalendarDays}
        />
        {data.isAdmin && (
          <>
            <StatCard
              title="Total users"
              value={String(stats.totalUsers)}
              description="Registered accounts"
              icon={Users}
            />
            <StatCard
              title="Fleet size"
              value={String(stats.totalTrucks)}
              description="Trucks in catalog"
              icon={Truck}
            />
            <StatCard
              title="Total revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              description="Estimated from bookings"
              icon={DollarSign}
            />
          </>
        )}
        {!data.isAdmin && (
          <StatCard
            title="Pending"
            value={String(stats.pendingBookings)}
            description="Awaiting confirmation"
            icon={Clock}
          />
        )}
      </div>

      {data.isAdmin && (
        <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Quick summary</CardTitle>
            <CardDescription>
              {stats.pendingBookings} pending bookings · $
              {stats.totalRevenue.toLocaleString()} total revenue
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-2xl font-bold text-orange-500">
                {stats.pendingBookings}
              </p>
              <p className="mt-1 text-sm text-zinc-500">Pending approvals</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="mt-1 text-sm text-zinc-500">Active users</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-2xl font-bold">{stats.totalTrucks}</p>
              <p className="mt-1 text-sm text-zinc-500">Trucks listed</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
