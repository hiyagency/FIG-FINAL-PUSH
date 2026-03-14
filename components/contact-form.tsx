"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  type ContactFormInput,
  contactFormSchema
} from "@/lib/contact-form-schema";
import { planSchedule } from "@/lib/site-data";

type SubmissionState =
  | { tone: "success"; message: string }
  | { tone: "error"; message: string }
  | null;

export function ContactForm() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      emailAddress: "",
      investmentAmount: "",
      message: "",
      sourcePage: "",
      website: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmissionState(null);

    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...values,
        sourcePage:
          typeof window !== "undefined" ? window.location.href : values.sourcePage
      })
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          fieldErrors?: Partial<Record<keyof ContactFormInput, string[]>>;
          message?: string;
        }
      | null;

    if (!response.ok) {
      if (payload?.fieldErrors) {
        for (const [fieldName, fieldErrors] of Object.entries(payload.fieldErrors)) {
          if (fieldErrors?.[0]) {
            setError(fieldName as keyof ContactFormInput, {
              type: "server",
              message: fieldErrors[0]
            });
          }
        }
      }

      setSubmissionState({
        tone: "error",
        message:
          payload?.message ||
          "We could not submit your enquiry right now. Please try again or contact FIG directly."
      });
      return;
    }

    reset();
    setSubmissionState({
      tone: "success",
      message:
        payload?.message ||
        "Thanks for reaching out. FIG will review your enquiry and contact you soon."
    });
  });

  return (
    <form className="grid gap-5 pb-24 md:pb-0" onSubmit={onSubmit} noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-semibold text-[#08152f]"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Your full name"
            className="field"
            autoComplete="name"
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="mb-2 block text-sm font-semibold text-[#08152f]"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            placeholder="+91 98XXXXXXXX"
            className="field"
            autoComplete="tel"
            {...register("phoneNumber")}
          />
          <p className="mt-2 text-xs text-slate-500">
            Include the best number for a callback or WhatsApp follow-up.
          </p>
          <FieldError message={errors.phoneNumber?.message} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="emailAddress"
            className="mb-2 block text-sm font-semibold text-[#08152f]"
          >
            Email Address
          </label>
          <input
            id="emailAddress"
            type="email"
            placeholder="you@example.com"
            className="field"
            autoComplete="email"
            {...register("emailAddress")}
          />
          <FieldError message={errors.emailAddress?.message} />
        </div>

        <div>
          <label
            htmlFor="investmentAmount"
            className="mb-2 block text-sm font-semibold text-[#08152f]"
          >
            Investment Amount
          </label>
          <input
            id="investmentAmount"
            type="text"
            list="plan-suggestions"
            placeholder="Example: 2 Lakh"
            className="field"
            {...register("investmentAmount")}
          />
          <datalist id="plan-suggestions">
            {planSchedule.map((plan) => (
              <option key={plan.label} value={plan.label} />
            ))}
            <option value="Need guidance on the right plan" />
          </datalist>
          <FieldError message={errors.investmentAmount?.message} />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-semibold text-[#08152f]"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell FIG what you want to know, your preferred plan range, or the best time to contact you."
          className="field resize-y"
          {...register("message")}
        />
        <p className="mt-2 text-xs text-slate-500">
          Share any timing preference, budget context, or questions you would
          like discussed on the call.
        </p>
        <FieldError message={errors.message?.message} />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {submissionState ? (
        <div
          className={
            submissionState.tone === "success"
              ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              : "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          }
          role="status"
          aria-live="polite"
        >
          {submissionState.message}
        </div>
      ) : null}

      <button type="submit" className="button-primary w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Sending enquiry...
          </>
        ) : (
          <>
            <SendHorizonal className="h-4 w-4" />
            Submit enquiry
          </>
        )}
      </button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-600">{message}</p>;
}
