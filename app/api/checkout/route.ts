import { NextRequest, NextResponse } from "next/server";

type CheckoutItem = {
  id: number;
  title: string;
  quantity: number;
  unit_price: number;
};

type CheckoutCustomer = {
  fullName?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

export async function POST(request: NextRequest) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Configure MERCADO_PAGO_ACCESS_TOKEN no .env.local para ativar pagamentos." },
      { status: 503 },
    );
  }

  const body = await request.json();
  const items = Array.isArray(body.items) ? (body.items as CheckoutItem[]) : [];

  if (!items.length) {
    return NextResponse.json({ message: "Sua sacola está vazia." }, { status: 400 });
  }

  const safeItems = items.map((item) => ({
    id: String(item.id),
    title: item.title,
    quantity: Math.max(1, Number(item.quantity) || 1),
    unit_price: Number(item.unit_price),
    currency_id: "BRL",
  }));

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const shippingCost = Number(body.shippingCost) || 0;
  const customer = (body.customer ?? {}) as CheckoutCustomer;
  const [firstName = customer.fullName ?? "", ...lastNameParts] = (customer.fullName ?? "").split(" ");

  const preference = {
    items: safeItems,
    payer: {
      name: firstName,
      surname: lastNameParts.join(" "),
      email: customer.email,
      identification: {
        type: "CPF",
        number: customer.cpf?.replace(/\D/g, ""),
      },
      phone: {
        number: customer.phone?.replace(/\D/g, ""),
      },
      address: {
        zip_code: customer.cep?.replace(/\D/g, ""),
        street_name: customer.street,
        street_number: customer.number,
      },
    },
    shipments: {
      cost: shippingCost,
      mode: "not_specified",
    },
    payment_methods: {
      installments: 12,
    },
    back_urls: {
      success: `${origin}/?checkout=success`,
      failure: `${origin}/?checkout=failure`,
      pending: `${origin}/?checkout=pending`,
    },
    auto_return: "approved",
    statement_descriptor: "FEJU BRECHO",
    external_reference: `feju-${Date.now()}`,
    metadata: {
      cep: body.cep ?? "",
      customer_email: customer.email ?? "",
      payment_choice: body.paymentMethod ?? "Mercado Pago",
      source: "feju-brecho",
    },
  };

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preference),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { message: "Não foi possível criar o pagamento.", details: data },
      { status: response.status },
    );
  }

  return NextResponse.json({
    id: data.id,
    initPoint: data.init_point,
    sandboxInitPoint: data.sandbox_init_point,
  });
}
