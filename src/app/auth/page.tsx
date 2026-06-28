"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useT } from "@/lib/locale-store";
import { useAuthStore } from "@/lib/auth-store";
import { Logo } from "@/components/Logo";

export default function AuthPage() {
  const { t } = useT();
  const router = useRouter();
  const { login } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi");
        setLoading(false);
        return;
      }
      login(data.user);
      router.push("/dashboard");
    } catch {
      setError("Tarmoq xatoligi");
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <div className="bg-card border border-line rounded-2xl p-8">
            <h1 className="font-display text-2xl font-semibold text-ink text-center mb-1">
              {mode === "login" ? t.auth.loginTitle : t.auth.registerTitle}
            </h1>

            <div className="flex bg-cream-deep rounded-full p-1 mt-6 mb-6">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 h-10 rounded-full text-sm font-semibold transition-colors ${mode === "login" ? "bg-card shadow-sm text-ink" : "text-ink-soft"}`}
              >
                {t.auth.switchToLogin}
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 h-10 rounded-full text-sm font-semibold transition-colors ${mode === "register" ? "bg-card shadow-sm text-ink" : "text-ink-soft"}`}
              >
                {t.auth.switchToRegister}
              </button>
            </div>

            {error && (
              <p className="text-sm text-terracotta-deep bg-terracotta/10 rounded-lg px-3.5 py-2.5 mb-4">{error}</p>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="text-sm font-semibold text-ink mb-1.5 block">{t.auth.name}</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-ink mb-1.5 block">{t.auth.email}</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
              </div>
              {mode === "register" && (
                <div>
                  <label className="text-sm font-semibold text-ink mb-1.5 block">{t.auth.phone}</label>
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-ink mb-1.5 block">{t.auth.password}</label>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-terracotta text-white font-semibold hover:bg-terracotta-deep transition-colors disabled:opacity-60 mt-2"
              >
                {loading ? t.common.loading : mode === "login" ? t.auth.loginBtn : t.auth.registerBtn}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-ink-soft mt-6">
            <Link href="/" className="hover:text-terracotta transition-colors">← Bosh sahifaga qaytish</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
