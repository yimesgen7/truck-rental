"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { AuthPageShell } from "@/components/auth-page-shell";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetUrl(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Request failed.");
        return;
      }

      setMessage(data.message);
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageShell
      title="Forgot password"
      subtitle="Enter your email and we'll send reset instructions."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-300">
            Email
          </label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 border-zinc-700 bg-zinc-950 text-white"
            placeholder="you@example.com"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && (
          <p className="text-sm text-green-400">{message}</p>
        )}
        {resetUrl && (
          <p className="rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-xs text-zinc-400">
            Dev reset link:{" "}
            <Link href={resetUrl} className="break-all text-orange-500 hover:underline">
              {resetUrl}
            </Link>
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-orange-500 py-3 font-semibold transition hover:bg-orange-600 disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-400">
        <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-400">
          Back to login
        </Link>
      </p>
    </AuthPageShell>
  );
}
