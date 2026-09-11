import type { Metadata } from "next";
import "./globals.css";
import "./product.css";
import "./product-polish.css";

export const metadata: Metadata = {
  title: "PROOF — سجل إثبات القرارات | Decision Evidence Registry",
  description: "PROOF يحوّل الموافقات التشغيلية إلى سجلات قابلة للتحقق مع دليل خاص، بصمة SHA-256، اعتماد نهائي وسجل تدقيق. A bilingual decision evidence registry for real operational approvals.",
  applicationName: "PROOF",
  keywords: ["decision evidence", "audit trail", "SHA-256", "operational approvals", "سجل القرارات", "إثبات القرارات"],
  openGraph: {
    title: "PROOF — Decision Evidence Registry",
    description: "Capture operational decisions, protect the original evidence and verify approved records later.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" suppressHydrationWarning><body>{children}</body></html>;
}
