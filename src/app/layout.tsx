import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Strum · Aprenda violão e baixo do jeito divertido",
  description:
    "Strum — um treinador de violão e baixo no estilo Duolingo: trilha de lições, afinador, metrônomo e biblioteca de acordes, tudo em um lugar.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Strum", statusBarStyle: "default" },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#004741",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
