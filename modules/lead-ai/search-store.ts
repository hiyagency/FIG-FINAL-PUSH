"use client";

import { create } from "zustand";

import type { ParsedSearchIntent } from "@/modules/lead-ai/contracts";

type SearchDraftState = {
  rawPrompt: string;
  parsedIntent: ParsedSearchIntent | null;
  setRawPrompt: (rawPrompt: string) => void;
  setParsedIntent: (parsedIntent: ParsedSearchIntent | null) => void;
  patchParsedIntent: (next: Partial<ParsedSearchIntent>) => void;
  reset: () => void;
};

export const useSearchDraftStore = create<SearchDraftState>((set) => ({
  rawPrompt: "",
  parsedIntent: null,
  setRawPrompt: (rawPrompt) => set({ rawPrompt }),
  setParsedIntent: (parsedIntent) => set({ parsedIntent }),
  patchParsedIntent: (next) =>
    set((state) => ({
      parsedIntent: state.parsedIntent
        ? {
            ...state.parsedIntent,
            ...next
          }
        : null
    })),
  reset: () =>
    set({
      rawPrompt: "",
      parsedIntent: null
    })
}));
