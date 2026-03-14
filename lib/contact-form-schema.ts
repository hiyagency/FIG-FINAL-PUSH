import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name must be 80 characters or fewer."),
  phoneNumber: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number.")
    .max(20, "Phone number must be 20 characters or fewer.")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number."),
  emailAddress: z
    .string()
    .trim()
    .email("Please enter a valid email address."),
  investmentAmount: z
    .string()
    .trim()
    .min(2, "Please mention the investment amount or plan.")
    .max(60, "Investment amount must be 60 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(10, "Please share a short message for FIG.")
    .max(600, "Message must be 600 characters or fewer."),
  sourcePage: z.string().trim().max(200).optional(),
  website: z.string().max(0).optional()
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
