import { getSupabaseServerClient } from "./supabase/client";

interface PlategaPayment {
  amount: number;
  currency: string;
  description: string;
  customer_email?: string;
  metadata?: Record<string, string>;
}

export async function createPlategaPayment(payment: PlategaPayment) {
  const apiKey = process.env.PLATEGA_API_KEY!;
  const merchantId = process.env.PLATEGA_MERCHANT_ID!;

  const response = await fetch("https://api.platega.ru/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Merchant-Id": merchantId,
    },
    body: JSON.stringify({
      amount: payment.amount,
      currency: payment.currency || "RUB",
      description: payment.description,
      customer_email: payment.customer_email,
      metadata: payment.metadata,
      success_url: `${process.env.VITE_SUPABASE_URL?.replace(".supabase.co", "")}/subscribe?success=true`,
      cancel_url: `${process.env.VITE_SUPABASE_URL?.replace(".supabase.co", "")}/subscribe?cancelled=true`,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Platega API error: ${errText}`);
  }

  return response.json();
}

export async function verifyPlategaSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  const apiKey = process.env.PLATEGA_API_KEY!;

  const response = await fetch("https://api.platega.ru/v1/webhook/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ payload, signature }),
  });

  if (!response.ok) return false;
  const data = await response.json();
  return data.valid === true;
}

export async function handlePlategaCallback(payload: {
  event: string;
  data: {
    user_id?: string;
    status?: string;
    expires_at?: string;
    payment_id?: string;
  };
}) {
  const supabase = await getSupabaseServerClient();

  if (payload.event === "payment.succeeded" && payload.data.user_id) {
    const { user_id, expires_at } = payload.data;

    await supabase.from("subscriptions").upsert({
      user_id,
      status: "active",
      expires_at: expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      source: "platega",
    });
  }

  if (payload.event === "payment.failed" && payload.data.user_id) {
    await supabase
      .from("subscriptions")
      .update({ status: "expired" })
      .eq("user_id", payload.data.user_id);
  }
}
