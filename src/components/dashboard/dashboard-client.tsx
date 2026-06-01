"use client";

import {
  CalendarDays,
  DollarSign,
  LayoutDashboard,
  Menu,
  Truck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { BookingsSection } from "@/components/dashboard/sections/bookings-section";
import { OverviewSection } from "@/components/dashboard/sections/overview-section";
import { RevenueSection } from "@/components/dashboard/sections/revenue-section";
import { TrucksSection } from "@/components/dashboard/sections/trucks-section";
import { UsersSection } from "@/components/dashboard/sections/users-section";
import type { DashboardData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

type SectionId =
  | "overview"
  | "bookings"
  | "users"
  | "trucks"
  | "revenue";

const allNavItems: {
  id: SectionId;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "users", label: "User management", icon: Users, adminOnly: true },
  { id: "trucks", label: "Truck management", icon: Truck, adminOnly: true },
  { id: "revenue", label: "Revenue analytics", icon: DollarSign, adminOnly: true },
];

type DashboardClientProps = {
  data: DashboardData;
  userName: string;
};

export function DashboardClient({ data, userName }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sectionParam = searchParams.get("section") as SectionId | null;
  const navItems = allNavItems.filter(
    (item) => !item.adminOnly || data.isAdmin
  );
  const activeSection =
    navItems.find((item) => item.id === sectionParam)?.id ?? "overview";

  function setSection(id: SectionId) {
    router.push(`/dashboard?section=${id}`, { scroll: false });
    setSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              TruckRent
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-300">Admin</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-zinc-700 p-1.5 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-orange-500 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <Link
            href="/"
            className="block rounded-xl border border-zinc-700 px-3 py-2 text-center text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-zinc-700 p-2 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold capitalize lg:text-2xl">
                {navItems.find((n) => n.id === activeSection)?.label ??
                  "Overview"}
              </h1>
              <p className="text-sm text-zinc-500">
                Welcome back, {userName}
              </p>
            </div>
          </div>
          {data.isAdmin && (
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
              ADMIN
            </span>
          )}
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {activeSection === "overview" && <OverviewSection data={data} />}
          {activeSection === "bookings" && <BookingsSection data={data} />}
          {activeSection === "users" && data.isAdmin && (
            <UsersSection users={data.users} />
          )}
          {activeSection === "trucks" && data.isAdmin && (
            <TrucksSection trucks={data.trucks} />
          )}
          {activeSection === "revenue" && data.isAdmin && (
            <RevenueSection data={data} />
          )}
        </main>
      </div>
    </div>
  );
}
