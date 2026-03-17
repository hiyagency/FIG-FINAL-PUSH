"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { OtpPurposeInput } from "@/modules/auth/schemas";

type OtpRequestResponse =
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

type EmailOtpRequestFormProps = {
  purpose: OtpPurposeInput;
  callbackUrl?: string;
  defaultEmail?: string;
  emailPlaceholder?: string;
  helperText?: string;
  submitLabel: string;
  className?: string;
};

function buildVerifyHref(input: {
  email: string;
  purpose: OtpPurposeInput;
  callbackUrl: string;
}) {
  const params = new URLSearchParams({
    email: input.email,
    purpose: input.purpose,
    callbackUrl: input.callbackUrl,
    sentAt: Date.now().toString()
  });

  return `/auth/verify?${params.toString()}`;
}

export function EmailOtpRequestForm({
  purpose,
  callbackUrl = "/app",
  defaultEmail = "",
  emailPlaceholder = "founder@brand.com",
  helperText,
  submitLabel,
  className
}: EmailOtpRequestFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const normalizedEmail = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    setEmail(normalizedEmail);
    setError(null);

    startTransition(async () => {
      let result: OtpRequestResponse | null = null;

      try {
        const response = await fetch("/api/auth/otp/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: normalizedEmail,
            purpose,
            callbackUrl
          })
        });

        result = (await response.json()) as OtpRequestResponse;

        if (!response.ok || !result.ok) {
          setError(result?.message ?? "We could not send a verification code. Please try again.");
          return;
        }
      } catch {
        setError("We could not send a verification code. Please try again.");
        return;
      }

      toast.success(result.message);
      router.push(
        buildVerifyHref({
          email: normalizedEmail,
          purpose,
          callbackUrl
        })
      );
    });
  }

  return (
    <form action={handleSubmit} className={cn("space-y-5", className)}>
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor={`${purpose}-otp-email`}>Work email</Label>
        <Input
          id={`${purpose}-otp-email`}
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={emailPlaceholder}
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
        />
      </div>
      {helperText ? <p className="text-sm leading-6 text-slate-500">{helperText}</p> : null}
      <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Sending code..." : submitLabel}
      </Button>
    </form>
  );
}
