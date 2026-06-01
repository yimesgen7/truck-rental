import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OrdersClient } from "@/components/orders/orders-client";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/roles";
import { getUserOrders } from "@/lib/user-orders-data";

export const metadata: Metadata = {
  title: "Track orders — TruckRent",
  description: "View and track your truck rental bookings.",
};

export default async function OrdersPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  if (isAdmin(session.user.role)) {
    redirect("/dashboard");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <OrdersClient
      orders={orders}
      userName={session.user.name ?? session.user.email ?? "User"}
    />
  );
}
