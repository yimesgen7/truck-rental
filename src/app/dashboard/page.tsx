import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard-data";
import { isAdmin } from "@/lib/roles";

export const metadata: Metadata = {
  title: "Dashboard — TruckRent",
  description: "Manage bookings, users, trucks, and revenue.",
};

function DashboardFallback() {
  return <div className="min-h-screen bg-black" />;
}

async function DashboardContent() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const admin = isAdmin(session.user.role);
  const data = await getDashboardData(session.user.id, admin);

  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardClient
        data={data}
        userName={session.user.name ?? session.user.email ?? "User"}
      />
    </Suspense>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent />
    </Suspense>
  );
}
