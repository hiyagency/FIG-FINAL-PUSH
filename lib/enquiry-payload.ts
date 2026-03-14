import { z } from "zod";

import {
  isValidIndianPhone,
  isValidOptionalEmail
} from "@/lib/contact-form-schema";
import { businessInfo } from "@/lib/site-data";

export const enquiryPayloadSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name must be 80 characters or fewer."),
  phone_number: z
    .string()
    .trim()
    .min(1, "Please enter your phone number.")
    .max(25, "Phone number must be 25 characters or fewer.")
    .refine(isValidIndianPhone, "Please enter a valid Indian phone number."),
  email_address: z
    .string()
    .trim()
    .max(120, "Email address must be 120 characters or fewer.")
    .refine(isValidOptionalEmail, "Please enter a valid email address."),
  investment_amount: z
    .string()
    .trim()
    .max(60, "Investment amount must be 60 characters or fewer."),
  message: z
    .string()
    .trim()
    .max(600, "Message must be 600 characters or fewer."),
  page_url: z
    .string()
    .trim()
    .url("Please enter a valid page URL.")
    .max(400, "Page URL must be 400 characters or fewer.")
});

export type EnquiryPayload = z.infer<typeof enquiryPayloadSchema>;

export const enquiryEndpoint = businessInfo.enquiryEndpoint;
