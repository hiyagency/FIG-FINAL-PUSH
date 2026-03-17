"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type PageTransitionContextValue = {
  jumpTo: (targetId: string, label?: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [transitionLabel, setTransitionLabel] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const timeouts = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeouts.current = [];
  }, []);

  const jumpTo = useCallback(
    (targetId: string, label = "Turning the page") => {
      const target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      if (reduceMotion) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#${targetId}`);
        return;
      }

      clearTimers();
      setTransitionLabel(label);

      timeouts.current.push(
        window.setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.replaceState(null, "", `#${targetId}`);
        }, 170)
      );

      timeouts.current.push(
        window.setTimeout(() => {
          setTransitionLabel(null);
        }, 760)
      );
    },
    [clearTimers, reduceMotion]
  );

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <PageTransitionContext.Provider value={{ jumpTo }}>
      {children}

      <AnimatePresence>
        {transitionLabel ? (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,248,244,0.8),rgba(252,241,236,0.92),rgba(244,229,231,0.94))] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <motion.div
              className="relative flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-px w-20 bg-[linear-gradient(90deg,transparent,rgba(148,92,108,0.45),transparent)]" />
              <div className="rounded-full border border-[rgba(148,92,108,0.14)] bg-white/78 px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[rgba(98,58,73,0.82)] shadow-[0_20px_44px_-28px_rgba(43,31,41,0.3)]">
                {transitionLabel}
              </div>
              <div className="h-px w-20 bg-[linear-gradient(90deg,transparent,rgba(148,92,108,0.45),transparent)]" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error("usePageTransition must be used within PageTransitionProvider.");
  }

  return context;
}
