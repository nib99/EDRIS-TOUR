import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "Edris Tour & Travel | Passport, Visa & Travel Support",
  description: "Edris Tour & Travel provides passport application support, COC, police clearance, medical appointment coordination, ILMS support, visa assistance and air-ticket services.",
  keywords: ["Edris Tour and Travel", "passport Ethiopia", "visa Ethiopia", "travel Ethiopia", "COC", "police clearance", "air ticket"],
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/icon-192.png" },
  openGraph: {
    title: "Edris Tour & Travel",
    description: "Reliable travel and document-support services.",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#0b2636",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="om">
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
