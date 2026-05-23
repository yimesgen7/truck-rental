import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = {
  title: "Log in — TruckRent",
  description: "Sign in to your TruckRent account.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginForm />
    </Suspense>
  );
}
