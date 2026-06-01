import { z } from "zod";

export const driverOptions = [
  { value: "self", label: "I'll drive myself" },
  { value: "with-driver", label: "Include a professional driver" },
] as const;

export const paymentMethods = [
  { value: "card", label: "Credit / Debit card (Stripe)" },
  { value: "chapa", label: "Chapa" },
  { value: "paypal", label: "PayPal" },
] as const;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function withDateRefinement<T extends z.ZodType>(schema: T) {
  return schema
    .refine(
      (data) => {
        const d = data as { startDate: string; endDate: string };
        const start = new Date(d.startDate);
        const end = new Date(d.endDate);
        return (
          !Number.isNaN(start.getTime()) &&
          !Number.isNaN(end.getTime()) &&
          end >= start
        );
      },
      { message: "End date must be on or after start date", path: ["endDate"] }
    )
    .refine(
      (data) => {
        const d = data as { startDate: string };
        const start = new Date(d.startDate);
        return !Number.isNaN(start.getTime()) && start >= startOfToday();
      },
      { message: "Start date cannot be in the past", path: ["startDate"] }
    );
}

const bookingFields = z.object({
  pickupLocation: z.string().min(2, "Pickup location is required"),
  dropoffLocation: z.string().min(2, "Dropoff location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  driverOption: z.enum(["self", "with-driver"]),
  paymentMethod: z.enum(["card", "chapa", "paypal"]),
});

export const bookingSchema = withDateRefinement(bookingFields);

export const createBookingSchema = withDateRefinement(
  bookingFields.extend({
    catalogTruckId: z.string().min(1, "Truck is required"),
  })
);

export type BookingFormValues = z.infer<typeof bookingSchema>;
export type CreateBookingPayload = z.infer<typeof createBookingSchema>;
