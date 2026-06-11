import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => ({}));

  // Production note: connect this route to a database to update order status
  // after Mercado Pago confirms payment, cancellation, chargeback, or refund.
  return NextResponse.json({
    received: true,
    topic: payload.type ?? payload.topic ?? "unknown",
  });
}
