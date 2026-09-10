"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase-browser";
import type { Lang } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";

export function AuthForm({ lang }: { lang: Lang }) {
  const ar = lang === "ar";
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError(""); setNotice("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError(ar ? "تعذر تسجيل الدخول. تأكد من البريد وكلمة المرور." : "Could not sign in. Check your email and password.");
      router.replace(withLang("/dashboard", lang));
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) return setError(error.message);
    if (data.session) {
      router.replace(withLang("/dashboard", lang));
      router.refresh();
    } else {
      setNotice(ar ? "تم إنشاء الحساب. افتح رسالة التأكيد في بريدك، وبعدها ارجع وسجّل دخولك." : "Account created. Confirm the email in your inbox, then return here and sign in.");
      setMode("signin");
    }
  }

  return <>
    <div className="auth-tabs">
      <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => { setMode("signin"); setError(""); setNotice(""); }}><LogIn size={15}/>{ar ? "دخول" : "Sign in"}</button>
      <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(""); setNotice(""); }}><UserPlus size={15}/>{ar ? "حساب جديد" : "Create account"}</button>
    </div>
    <form onSubmit={submit}>
      <label>{ar ? "البريد الإلكتروني" : "Email"}<input type="email" name="email" required autoComplete="email" placeholder="name@example.com" /></label>
      <label>{ar ? "كلمة المرور" : "Password"}<input type="password" name="password" required minLength={6} autoComplete={mode === "signin" ? "current-password" : "new-password"} /></label>
      {error && <div className="error-box">{error}</div>}
      {notice && <div className="success-box">{notice}</div>}
      <button className="button button-primary button-wide" disabled={busy}>{busy ? (ar ? "جاري التنفيذ…" : "Working…") : mode === "signin" ? (ar ? "دخول للوحة التحكم" : "Sign in to dashboard") : (ar ? "إنشاء الحساب" : "Create account")}</button>
    </form>
  </>;
}
