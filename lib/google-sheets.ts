import { google } from "googleapis";
import { z } from "zod";

const googleSheetsEnvSchema = z.object({
  GOOGLE_PROJECT_ID: z.string().min(1),
  GOOGLE_CLIENT_EMAIL: z.string().email(),
  GOOGLE_PRIVATE_KEY: z.string().min(1),
  GOOGLE_SHEET_ID: z.string().min(1),
  GOOGLE_SHEET_NAME: z.string().min(1).default("Leads")
});

export class MissingGoogleSheetsConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingGoogleSheetsConfigError";
  }
}

export type EnquiryRow = {
  timestamp: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  investmentAmount: string;
  message: string;
  sourcePage: string;
  userAgent: string;
};

function getGoogleSheetsConfig() {
  const parsedConfig = googleSheetsEnvSchema.safeParse({
    GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
    GOOGLE_SHEET_NAME: process.env.GOOGLE_SHEET_NAME || "Leads"
  });

  if (!parsedConfig.success) {
    throw new MissingGoogleSheetsConfigError(
      "Google Sheets integration is not configured yet. Please add the required environment variables."
    );
  }

  return parsedConfig.data;
}

export async function appendEnquiryToSheet(enquiry: EnquiryRow) {
  const config = getGoogleSheetsConfig();

  const auth = new google.auth.JWT({
    email: config.GOOGLE_CLIENT_EMAIL,
    key: config.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({
    version: "v4",
    auth
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: `${config.GOOGLE_SHEET_NAME}!A:H`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          enquiry.timestamp,
          enquiry.fullName,
          enquiry.phoneNumber,
          enquiry.emailAddress,
          enquiry.investmentAmount,
          enquiry.message,
          enquiry.sourcePage,
          enquiry.userAgent
        ]
      ]
    }
  });
}
