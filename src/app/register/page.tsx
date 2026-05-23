import type { Metadata } from "next";

import { RegisterForm } from "@/app/register/register-form";

export const metadata: Metadata = {
  title: "Register — TruckRent",
  description: "Create a TruckRent account to book and rent trucks.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
