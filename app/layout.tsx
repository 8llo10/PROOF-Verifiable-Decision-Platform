import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PROOF — Verifiable Decisions",
  description: "Turn informal operational decisions into verifiable evidence records.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
