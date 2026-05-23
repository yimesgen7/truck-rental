import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function mapPaymentMethodToProvider(
  method: string
): "stripe" | "chapa" | "paypal" {
  if (method === "paypal") return "paypal";
  if (method === "chapa") return "chapa";
  return "stripe";
}
