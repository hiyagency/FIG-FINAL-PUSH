"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OtpPurposeInput } from "@/modules/auth/schemas";

const DEFAULT_COOLDOWN_SECONDS = 60;

type VerifyOtpResponse =
  | {
      ok: true;
      redirectTo: string;
      isNewUser: boolean;
    }
  | {
      ok: false;
      code: string;
      message: string;
      retryAfterSeconds?: number;
    };

type ResendOtpResponse =
  | {
      ok: true;
      email: string;
      purpose: OtpPurposeInput;
      message: string;
      cooldownSeconds: number;
    }
  | {
      ok: false;
      code: string;
      message: string;
      retryAfterSeconds?: number;
    };

function digitsOnly(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

function formatCooldown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function getInitialCooldown(sentAt?: number) {
  if (!sentAt) {
    return 0;
  }

  const elapsedSeconds = Math.floor((Date.now() - sentAt) / 1000);
  return Math.max(0, DEFAULT_COOLDOWN_SECONDS - elapsedSeconds);
}

export function OtpVerificationPanel({
  email,
  purpose,
  callbackUrl = "/app",
  sentAt
}: {
  email: string;
  purpose: OtpPurposeInput;
  callbackUrl?: string;
  sentAt?: number;
}) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(() => getInitialCooldown(sentAt));
  const [verifyPending, startVerifyTransition] = useTransition();
  const [resendPending, startResendTransition] = useTransition();

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setCooldownSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [cooldownSeconds]);

  const changeEmailHref = useMemo(() => {
    const params = new URLSearchParams();

    if (email) {
      params.set("email", email);
    }

    return purpose === "signup"
      ? `/auth/register${params.size ? `?${params.toString()}` : ""}`
      : `/auth/login${params.size ? `?${params.toString()}` : ""}`;
  }, [email, purpose]);

  const title = purpose === "signup" ? "Confirm your email" : "Enter your verification code";
  const description =
    purpose === "signup"
      ? "We emailed a 6-digit code to finish creating your Lead.ai account."
      : "We emailed a 6-digit code to sign you in securely without leaving the app.";

  async function handleVerify(formData: FormData) {
    const nextOtp = digitsOnly(String(formData.get("otp") || ""));

    setOtp(nextOtp);
    setError(null);

    startVerifyTransition(async () => {
      let result: VerifyOtpResponse | null = null;

      try {
        const response = await fetch("/api/auth/otp/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            purpose,
            otp: nextOtp,
            callbackUrl
          })
        });

        result = (await response.json()) as VerifyOtpResponse;

        if (!response.ok || !result?.ok) {
          const message = result && "message" in result ? result.message : null;
          setError(message ?? "We could not verify that code. Please try again.");
          return;
        }
      } catch {
        setError("We could not verify that code. Please try again.");
        return;
      }

      toast.success(result.isNewUser ? "Your account is ready." : "Signed in successfully.");
      router.replace(result.redirectTo);
      router.refresh();
    });
  }

  async function handleResend() {
    setError(null);

    startResendTransition(async () => {
      let result: ResendOtpResponse | null = null;

      try {
        const response = await fetch("/api/auth/otp/resend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            purpose,
            callbackUrl
          })
        });

        result = (await response.json()) as ResendOtpResponse;

        if (!response.ok || !result?.ok) {
          const message = result && "message" in result ? result.message : null;
          const retryAfterSeconds =
            result && "retryAfterSeconds" in result ? result.retryAfterSeconds : undefined;

          setError(message ?? "We could not send another code right now.");

          if (retryAfterSeconds) {
            setCooldownSeconds(retryAfterSeconds);
          }

          return;
        }
      } catch {
        setError("We could not send another code right now.");
        return;
      }

      setOtp("");
      setCooldownSeconds(result.cooldownSeconds);
      toast.success(result.message);
    });
  }

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Verify email</p>
      <h1 className="mt-3 font-display text-4xl text-slate-950">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
        {email}
      </div>
      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      <form action={handleVerify} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification code</Label>
          <Input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoCapitalize="none"
            autoCorrect="off"
            enterKeyHint="done"
            placeholder="000000"
            value={otp}
            onChange={(event) => {
              setOtp(digitsOnly(event.target.value));
              if (error) {
                setError(null);
              }
            }}
            maxLength={6}
            className="h-14 text-center font-display text-3xl tracking-[0.65em]"
            required
          />
        </div>
        <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>This code expires in 10 minutes and can only be used once.</span>
          <Link href={changeEmailHref} className="font-medium text-brand-600">
            Change email
          </Link>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="sm:min-w-40" disabled={verifyPending || otp.length !== 6}>
            {verifyPending ? "Verifying..." : "Verify code"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleResend}
            disabled={resendPending || cooldownSeconds > 0}
            className="sm:min-w-40"
          >
            {resendPending
              ? "Resending..."
              : cooldownSeconds > 0
                ? `Resend in ${formatCooldown(cooldownSeconds)}`
                : "Resend code"}
          </Button>
        </div>
      </form>
      <p className="mt-6 text-sm leading-6 text-slate-500">
        If you did not request this, you can safely ignore the email.
      </p>
    </div>
  );
}
