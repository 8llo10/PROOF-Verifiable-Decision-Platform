"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, MailCheck, RefreshCw, UserPlus } from "lucide-react";
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
  const [pendingEmail, setPendingEmail] = useState("");

  function confirmationRedirect() {
    return `${window.location.origin}/login?lang=${lang}&confirmed=1`;
  }

  async function resendConfirmation() {
    if (!pendingEmail) return;
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: pendingEmail,
      options: { emailRedirectTo: confirmationRedirect() },
    });
    setBusy(false);
    if (error) {
      setError(ar ? "تعذر إعادة إرسال رسالة التأكيد. حاول مرة ثانية بعد قليل." : "Could not resend the confirmation email. Please try again shortly.");
      return;
    }
    setNotice(ar ? "أرسلنا رسالة تأكيد جديدة. افتحها واضغط رابط التأكيد ثم ارجع لـ PROOF." : "A new confirmation email was sent. Open it, confirm your email, then return to PROOF.");
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setPendingEmail(email);
          setError(ar ? "حسابك موجود، لكن بريدك ما تأكد للحين. أكد البريد أو أعد إرسال رسالة التأكيد." : "Your account exists, but the email is not confirmed yet. Confirm it or resend the confirmation email.");
          return;
        }
        setError(ar ? "تعذر تسجيل الدخول. تأكد من البريد وكلمة المرور." : "Could not sign in. Check your email and password.");
        return;
      }

      router.replace(withLang("/dashboard", lang));
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: confirmationRedirect(),
        data: { preferred_language: lang },
      },
    });
    setBusy(false);

    if (error) {
      setError(ar ? `تعذر إنشاء الحساب: ${error.message}` : `Could not create account: ${error.message}`);
      return;
    }

    if (data.session) {
      router.replace(withLang("/dashboard", lang));
      router.refresh();
      return;
    }

    setPendingEmail(email);
    setNotice(ar ? "تم إنشاء الحساب. أرسلنا لك رسالة تأكيد؛ افتحها واضغط الرابط، وراح ترجع تلقائيًا إلى PROOF." : "Account created. We sent a confirmation email; open it and follow the link to return automatically to PROOF.");
  }

  return <>
    <div className="auth-tabs">
      <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => { setMode("signin"); setError(""); setNotice(""); setPendingEmail(""); }}><LogIn size={15}/>{ar ? "دخول" : "Sign in"}</button>
      <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(""); setNotice(""); setPendingEmail(""); }}><UserPlus size={15}/>{ar ? "حساب جديد" : "Create account"}</button>
    </div>

    <form onSubmit={submit}>
      <label>{ar ? "البريد الإلكتروني" : "Email"}<input type="email" name="email" required autoComplete="email" placeholder="name@example.com" /></label>
      <label>{ar ? "كلمة المرور" : "Password"}<input type="password" name="password" required minLength={6} autoComplete={mode === "signin" ? "current-password" : "new-password"} /></label>

      {error && <div className="error-box">{error}</div>}
      {notice && <div className="success-box"><MailCheck size={17}/><span>{notice}</span></div>}

      {pendingEmail && <button type="button" className="button button-dark button-wide" onClick={resendConfirmation} disabled={busy}><RefreshCw size={16}/>{ar ? "إعادة إرسال رسالة التأكيد" : "Resend confirmation email"}</button>}

      <button className="button button-primary button-wide" disabled={busy}>{busy ? (ar ? "جاري التنفيذ…" : "Working…") : mode === "signin" ? (ar ? "دخول للوحة التحكم" : "Sign in to dashboard") : (ar ? "إنشاء الحساب" : "Create account")}</button>
    </form>
  </>;
}
