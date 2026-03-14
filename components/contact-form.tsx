"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LoaderCircle, SendHorizonal } from "lucide-react";
import { useRef, useState } from "react";
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

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdawloak";

export function ContactForm() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>(null);
  const submitLockRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      emailAddress: "",
      investmentAmount: "",
      message: "",
      website: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    if (submitLockRef.current) {
      return;
    }

    if (values.website?.trim()) {
      console.warn("Blocked probable spam submission through honeypot field.");
      setSubmissionState({
        tone: "error",
        message: "Submission failed. Please try again."
      });
      return;
    }

    setSubmissionState(null);
    submitLockRef.current = true;

    const payload = {
      name: values.fullName.trim(),
      phone: values.phoneNumber.trim(),
      email: values.emailAddress.trim(),
      investmentAmount: values.investmentAmount.trim(),
      message: values.message.trim(),
      pageUrl: window.location.href
    };

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      const responseBody = (await response.json().catch(() => null)) as
        | { message?: string; errors?: unknown }
        | null;

      if (!response.ok) {
        console.error("FIG enquiry submission failed", {
          status: response.status,
          responseBody,
          fieldErrors: responseBody?.errors,
          payload
        });

        setSubmissionState({
          tone: "error",
          message: responseBody?.message || "Submission failed. Please try again."
        });
        return;
      }

      reset();
      setSubmissionState({
        tone: "success",
        message:
          responseBody?.message || "Thank you. Our team will contact you shortly."
      });
    } catch (error) {
      console.error("Unable to send FIG enquiry request", error);
      setSubmissionState({
        tone: "error",
        message: "Submission failed. Please try again."
      });
    } finally {
      submitLockRef.current = false;
    }
  });

  return (
    <form className="grid gap-5 pb-24 md:pb-0" onSubmit={onSubmit} noValidate>
      <div className="rounded-[22px] border border-[#D4AF37]/20 bg-[#fffaf0] px-4 py-3 text-sm leading-6 text-slate-600">
        Share the best way to reach you. FIG reviews enquiries and follows up
        through the most suitable route, including call or WhatsApp where useful.
      </div>

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
            autoCapitalize="words"
            aria-invalid={errors.fullName ? "true" : "false"}
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
            inputMode="tel"
            aria-invalid={errors.phoneNumber ? "true" : "false"}
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
            <span
              aria-hidden="true"
              className="ml-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
            >
              (Optional)
            </span>
          </label>
          <input
            id="emailAddress"
            type="email"
            placeholder="you@example.com"
            className="field"
            autoComplete="email"
            inputMode="email"
            aria-invalid={errors.emailAddress ? "true" : "false"}
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
            <span
              aria-hidden="true"
              className="ml-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
            >
              (Optional)
            </span>
          </label>
          <input
            id="investmentAmount"
            type="text"
            list="plan-suggestions"
            placeholder="Example: 2 Lakh"
            className="field"
            aria-invalid={errors.investmentAmount ? "true" : "false"}
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
          <span
            aria-hidden="true"
            className="ml-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
          >
            (Optional)
          </span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell FIG what you want to know, your preferred plan range, or the best time to contact you."
          className="field resize-y"
          aria-invalid={errors.message ? "true" : "false"}
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
          role={submissionState.tone === "success" ? "status" : "alert"}
          aria-live={submissionState.tone === "success" ? "polite" : "assertive"}
        >
          <span className="inline-flex items-center gap-2">
            {submissionState.tone === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : null}
            {submissionState.message}
          </span>
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
