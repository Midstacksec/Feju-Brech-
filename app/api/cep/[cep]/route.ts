import { NextResponse } from "next/server";

const shippingByRegion: Record<string, number> = {
  Sudeste: 19.9,
  Sul: 24.9,
  "Centro-Oeste": 29.9,
  Nordeste: 29.9,
  Norte: 34.9,
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cep: string }> },
) {
  try {
    const { cep } = await params;
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      return NextResponse.json({ message: "CEP inválido." }, { status: 400 });
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Não foi possível consultar o CEP." }, { status: 502 });
    }

    const address = await response.json();

    if (address.erro) {
      return NextResponse.json({ message: "CEP não encontrado." }, { status: 404 });
    }

    const shipping = shippingByRegion[address.regiao] ?? 32.9;

    return NextResponse.json({
      cep: address.cep,
      street: address.logradouro,
      neighborhood: address.bairro,
      city: address.localidade,
      state: address.uf,
      region: address.regiao,
      shipping,
      freeShippingFrom: 299,
    });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível consultar o CEP agora." },
      { status: 502 },
    );
  }
}
