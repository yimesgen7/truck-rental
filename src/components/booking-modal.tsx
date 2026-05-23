"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  bookingSchema,
  driverOptions,
  paymentMethods,
  type BookingFormValues,
} from "@/lib/booking-schema";
import { formatPrice } from "@/lib/trucks-data";
import type { Truck } from "@/types/truck";

type BookingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  truck?: Truck;
};

const fieldClass =
  "h-11 border-zinc-700 bg-zinc-950 text-white";
const labelClass = "text-sm font-medium text-zinc-300";
const errorClass = "text-xs text-red-400";

const defaultValues: BookingFormValues = {
  pickupLocation: "",
  dropoffLocation: "",
  startDate: "",
  endDate: "",
  driverOption: "self",
  paymentMethod: "card",
};

export function BookingModal({ open, onOpenChange, truck }: BookingModalProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      setError("");
      reset(defaultValues);
    }
  }, [open, reset]);

  async function onSubmit(data: BookingFormValues) {
    if (!truck) {
      setError("Please select a truck from the fleet page.");
      return;
    }

    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          catalogTruckId: truck.id,
          truckName: truck.name,
          truckBrand: truck.brand,
          truckModel: truck.model,
          pricePerDay: truck.pricePerDay,
          ...data,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? "Failed to create booking.");
        return;
      }

      onOpenChange(false);
      router.push(`/checkout/${result.bookingId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-800 bg-zinc-900 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {truck ? `Book ${truck.name}` : "Book a truck"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {truck ? (
              <>
                {truck.brand} {truck.model} ·{" "}
                <span className="text-orange-500">
                  {formatPrice(truck.pricePerDay)}
                </span>
              </>
            ) : (
              "Select a truck from the fleet, then complete your booking."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="pickupLocation" className={labelClass}>
              Pickup location
            </label>
            <Input
              id="pickupLocation"
              placeholder="e.g. 123 Fleet Street"
              className={fieldClass}
              aria-invalid={!!errors.pickupLocation}
              {...register("pickupLocation")}
            />
            {errors.pickupLocation && (
              <p className={errorClass}>{errors.pickupLocation.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="dropoffLocation" className={labelClass}>
              Dropoff location
            </label>
            <Input
              id="dropoffLocation"
              placeholder="e.g. 456 Warehouse Ave"
              className={fieldClass}
              aria-invalid={!!errors.dropoffLocation}
              {...register("dropoffLocation")}
            />
            {errors.dropoffLocation && (
              <p className={errorClass}>{errors.dropoffLocation.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="startDate" className={labelClass}>
                Start date
              </label>
              <Input
                id="startDate"
                type="date"
                className={fieldClass}
                aria-invalid={!!errors.startDate}
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className={errorClass}>{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className={labelClass}>
                End date
              </label>
              <Input
                id="endDate"
                type="date"
                className={fieldClass}
                aria-invalid={!!errors.endDate}
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className={errorClass}>{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="driverOption" className={labelClass}>
              Driver option
            </label>
            <select
              id="driverOption"
              className={`${fieldClass} w-full rounded-lg border px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`}
              {...register("driverOption")}
            >
              {driverOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="paymentMethod" className={labelClass}>
              Payment method
            </label>
            <select
              id="paymentMethod"
              className={`${fieldClass} w-full rounded-lg border px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`}
              {...register("paymentMethod")}
            >
              {paymentMethods.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.paymentMethod && (
              <p className={errorClass}>{errors.paymentMethod.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={isSubmitting || !truck}
            className="mt-2 w-full bg-orange-500 py-3 text-base font-semibold text-white hover:bg-orange-600"
          >
            {isSubmitting ? "Creating booking..." : "Continue to checkout"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
