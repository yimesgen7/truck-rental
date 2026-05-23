const PAYPAL_SANDBOX = "https://api-m.sandbox.paypal.com";
const PAYPAL_LIVE = "https://api-m.paypal.com";

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const base =
    process.env.PAYPAL_MODE === "live" ? PAYPAL_LIVE : PAYPAL_SANDBOX;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token as string | undefined;
}

export async function createPayPalOrder(params: {
  amount: number;
  currency: string;
  bookingId: string;
  returnUrl: string;
  cancelUrl: string;
}) {
  const token = await getPayPalAccessToken();
  if (!token) return null;

  const base =
    process.env.PAYPAL_MODE === "live" ? PAYPAL_LIVE : PAYPAL_SANDBOX;

  const res = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.bookingId,
          amount: {
            currency_code: params.currency,
            value: params.amount.toFixed(2),
          },
          description: "TruckRent booking",
        },
      ],
      application_context: {
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
        brand_name: "TruckRent",
        user_action: "PAY_NOW",
      },
    }),
  });

  const data = await res.json();
  const approveLink = data.links?.find(
    (l: { rel: string; href: string }) => l.rel === "approve"
  )?.href;

  if (!approveLink) {
    throw new Error("PayPal order creation failed");
  }

  return { orderId: data.id as string, approveUrl: approveLink };
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getPayPalAccessToken();
  if (!token) return false;

  const base =
    process.env.PAYPAL_MODE === "live" ? PAYPAL_LIVE : PAYPAL_SANDBOX;

  const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data.status === "COMPLETED";
}
