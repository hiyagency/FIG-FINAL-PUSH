import OpenAI from "openai";
import { z } from "zod";

import { env } from "@/lib/env";

let client: OpenAI | null = null;

function getClient() {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  if (!client) {
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  return client;
}

export async function generateStructuredObject<TSchema extends z.ZodTypeAny>(input: {
  schema: TSchema;
  system: string;
  user: string;
}) {
  const ai = getClient();

  if (!ai) {
    return null;
  }

  const completion = await ai.chat.completions.create({
    model: env.OPENAI_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: input.system },
      { role: "user", content: input.user }
    ]
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI provider returned an empty response.");
  }

  return input.schema.parse(JSON.parse(content));
}
