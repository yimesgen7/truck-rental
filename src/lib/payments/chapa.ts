const CHAPA_BASE = "https://api.chapa.co/v1";

type ChapaInitResponse = {
  status: string;
  message: string;
  data?: { checkout_url: string };
};

export async function initializeChapaPayment(params: {
  amount: number;
  currency: string;
  email: string;
  firstName: string;
  lastName: string;
  txRef: string;
  callbackUrl: string;
  returnUrl: string;
}) {
  const secret = process.env.CHAPA_SECRET_KEY;
  if (!secret) return null;

  const res = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amount.toFixed(2),
      currency: params.currency,
      email: params.email,
      first_name: params.firstName,
      last_name: params.lastName,
      tx_ref: params.txRef,
      callback_url: params.callbackUrl,
      return_url: params.returnUrl,
      customization: {
        title: "TruckRent Payment",
        description: "Truck rental booking",
      },
    }),
  });

  const data = (await res.json()) as ChapaInitResponse;
  if (!res.ok || data.status !== "success" || !data.data?.checkout_url) {
    throw new Error(data.message ?? "Chapa initialization failed");
  }

  return data.data.checkout_url;
}

export async function verifyChapaTransaction(txRef: string) {
  const secret = process.env.CHAPA_SECRET_KEY;
  if (!secret) return false;

  const res = await fetch(`${CHAPA_BASE}/transaction/verify/${txRef}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });

  const data = await res.json();
  return data?.status === "success" && data?.data?.status === "success";
}
