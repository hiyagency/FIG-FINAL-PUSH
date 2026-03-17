"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { EmailOtpRequestForm } from "@/components/forms/email-otp-request-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginPanel({ registered = false }: { registered?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleCredentials(formData: FormData) {
    setError(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.get("email"),
        password: formData.get("password"),
        callbackUrl: "/app"
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      toast.success("Signed in successfully.");
      router.replace(result?.url || "/app");
      router.refresh();
    });
  }

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Sign in</p>
      <h1 className="mt-3 font-display text-4xl text-slate-950">Access your workspace</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
        Sign in to Lead.ai to run compliant prospecting searches, review website audits, and export lead lists.
      </p>
      {registered ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Account created. Sign in to continue.
        </div>
      ) : null}
      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-medium text-slate-900">Sign in with email code</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Receive a 6-digit code in your inbox and verify it inside Lead.ai.
          </p>
          <EmailOtpRequestForm
            purpose="login"
            submitLabel="Email me a code"
            emailPlaceholder="founder@brand.com"
            helperText="If this email can be used, a verification code will be sent. Codes expire in 10 minutes."
            className="mt-5"
          />
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-900">Use password instead</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Existing password sign-in stays available for teams already using it.
          </p>
          <form action={handleCredentials} className="mt-5 space-y-5">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" placeholder="founder@brand.com" required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input name="password" type="password" placeholder="Password" required />
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Signing in..." : "Sign in with password"}
            </Button>
          </form>
        </div>
      </div>
      <p className="mt-8 text-sm text-slate-600">
        Need an account?{" "}
        <Link href="/auth/register" className="font-medium text-brand-600">
          Create one
        </Link>
      </p>
    </div>
  );
}
