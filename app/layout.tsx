import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Feju Peças Únicas | Brechó Online",
  description: "Brechó boho witch retrô com peças únicas e envio para todo o Brasil.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
