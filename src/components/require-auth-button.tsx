"use client";

import { useState } from "react";

import { useBooking } from "@/components/providers/booking-provider";
import { RequireAuthDialog } from "@/components/require-auth-dialog";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
import type { Truck } from "@/types/truck";

type RequireAuthButtonProps = {
  children: React.ReactNode;
  className?: string;
  truck?: Truck;
};

export function RequireAuthButton({
  children,
  className,
  truck,
}: RequireAuthButtonProps) {
  const { user, isLoading } = useAuth();
  const { openBooking } = useBooking();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const handleClick = () => {
    if (isLoading) return;
    if (user) {
      openBooking(truck);
      return;
    }
    setAuthDialogOpen(true);
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={cn(className)}>
        {children}
      </button>
      <RequireAuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
      />
    </>
  );
}
