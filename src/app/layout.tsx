import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import Toaster from "@/components/Toaster";

const DESCRIPTION =
  "Strum — um treinador de violão e baixo no estilo Duolingo: trilha de lições que te escuta tocar, afinador, metrônomo, músicas e muito mais.";

export const metadata: Metadata = {
  metadataBase: new URL("https://strum-8pte.vercel.app"),
  title: "Strum · Aprenda violão e baixo do jeito divertido",
  description: DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Strum", statusBarStyle: "default" },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  openGraph: {
    title: "Strum · Aprenda violão e baixo do jeito divertido",
    description: DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    siteName: "Strum",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strum · Aprenda violão e baixo",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#18542a",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Serif:ital@1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
