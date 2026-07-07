import type { Metadata } from "next";
import "./globals.css";
import { RootLayoutClient } from "@/components/layout/RootLayoutClient";

export const metadata: Metadata = {
  title: "AC Service CRM - Dashboard",
  description: "Aplikasi CRM dan Manajemen Jasa Servis AC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased h-screen flex overflow-hidden bg-background font-sans">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
