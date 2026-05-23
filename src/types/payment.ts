export type PaymentProvider = "stripe" | "chapa" | "paypal";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export const PAYMENT_PROVIDER_LABELS: Record<PaymentProvider, string> = {
  stripe: "Stripe",
  chapa: "Chapa",
  paypal: "PayPal",
};
