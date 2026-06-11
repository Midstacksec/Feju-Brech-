"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="error-page">
      <p className="eyebrow">algo saiu do eixo</p>
      <h1>O brechó deu uma pequena pausa.</h1>
      <p>Atualize a página ou tente novamente em instantes.</p>
      <button onClick={reset} type="button">
        Tentar de novo
      </button>
    </main>
  );
}
