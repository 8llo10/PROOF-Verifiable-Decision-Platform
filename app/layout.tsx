import type { Metadata } from "next";
import "./globals.css";
import "./product.css";

export const metadata: Metadata = {
  title: "PROOF | سجل القرارات القابل للتحقق",
  description: "حوّل الموافقات والقرارات التشغيلية إلى سجلات موثقة وقابلة للتحقق ببصمة SHA-256 وسجل تدقيق واضح.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" suppressHydrationWarning><body>{children}</body></html>;
}
