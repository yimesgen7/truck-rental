import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/roles";

export default async function AdminPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  if (!isAdmin(session.user.role)) {
    redirect("/dashboard");
  }

  redirect("/dashboard?section=overview");
}
