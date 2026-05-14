import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Radar · Señales & Tendencias",
  description: "Plataforma de foresight para capturar, discutir y valorar señales de cambio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <StoreProvider>
          <Navbar />
          <main>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
