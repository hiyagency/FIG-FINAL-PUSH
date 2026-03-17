import Link from "next/link";

import { EmailOtpRequestForm } from "@/components/forms/email-otp-request-form";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { registerAction } from "@/app/(auth)/auth/register/actions";

export default function RegisterPage() {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Create account</p>
      <h1 className="mt-3 font-display text-4xl text-slate-950">Start using Lead.ai</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
        Set up a secure account for your workspace. The seed script also creates a demo login for local development.
      </p>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-medium text-slate-900">Create account with email verification</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            We will send a 6-digit code to confirm your email and finish signup securely.
          </p>
          <EmailOtpRequestForm
            purpose="signup"
            submitLabel="Send verification code"
            emailPlaceholder="ava@agency.com"
            helperText="Only one active code is valid at a time. If this email can be used, a verification code will be sent."
            className="mt-5"
          />
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-900">Prefer a password?</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Password signup remains available for teams that want both methods enabled.
          </p>
          <form action={registerAction} className="mt-5 space-y-5">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input name="name" placeholder="Ava Morgan" required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" placeholder="ava@agency.com" required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="At least 12 characters"
                minLength={12}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Input
                name="timezone"
                placeholder="Asia/Calcutta"
                defaultValue="Asia/Calcutta"
                required
              />
            </div>
            <SubmitButton pendingLabel="Creating account...">Create Lead.ai account</SubmitButton>
          </form>
        </div>
      </div>
      <p className="mt-8 text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-brand-600">
          Sign in
        </Link>
      </p>
    </div>
  );
}
