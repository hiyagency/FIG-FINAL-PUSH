"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon, Play, X } from "lucide-react";

import type { GalleryItem } from "@/lib/kittu-gallery";
import { cn } from "@/lib/utils";

const layoutPattern = [
  "md:col-span-5 md:row-span-2",
  "md:col-span-7 md:row-span-2",
  "md:col-span-4 md:row-span-1",
  "md:col-span-4 md:row-span-1",
  "md:col-span-4 md:row-span-1",
  "md:col-span-6 md:row-span-2",
  "md:col-span-3 md:row-span-1",
  "md:col-span-3 md:row-span-1"
] as const;

function getWrappedIndex(index: number, length: number) {
  if (length === 0) {
    return 0;
  }

  if (index < 0) {
    return length - 1;
  }

  if (index >= length) {
    return 0;
  }

  return index;
}

export function MemoryGalleryClient({ items }: { items: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [modalDirection, setModalDirection] = useState(1);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredDirection, setFeaturedDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const currentIndex = activeIndex ?? 0;

  const activeItem = useMemo(
    () => (activeIndex === null ? null : items[activeIndex]),
    [activeIndex, items]
  );

  const featuredItem = items[featuredIndex];

  const openModal = (index: number) => {
    setFeaturedIndex(index);
    setModalDirection(index >= currentIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const closeModal = () => {
    setActiveIndex(null);
  };

  const setFeatured = (nextIndex: number, direction: number) => {
    setFeaturedDirection(direction);
    setFeaturedIndex(getWrappedIndex(nextIndex, items.length));
  };

  const goFeaturedPrevious = () => {
    setFeatured(featuredIndex - 1, -1);
  };

  const goFeaturedNext = () => {
    setFeatured(featuredIndex + 1, 1);
  };

  const setModal = (nextIndex: number, direction: number) => {
    const wrapped = getWrappedIndex(nextIndex, items.length);
    setModalDirection(direction);
    setFeaturedIndex(wrapped);
    setActiveIndex(wrapped);
  };

  const goPrevious = () => {
    if (activeIndex === null) {
      return;
    }

    setModal(activeIndex - 1, -1);
  };

  const goNext = () => {
    if (activeIndex === null) {
      return;
    }

    setModal(activeIndex + 1, 1);
  };

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (activeIndex === null) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
    }

    if (event.key === "ArrowLeft") {
      goPrevious();
    }

    if (event.key === "ArrowRight") {
      goNext();
    }
  });

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (reduceMotion || items.length < 2 || activeIndex !== null) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setFeaturedDirection(1);
      setFeaturedIndex((current) => getWrappedIndex(current + 1, items.length));
    }, 4200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeIndex, items.length, reduceMotion]);

  if (!items.length) {
    return (
      <div className="soft-panel-strong rounded-[32px] p-6 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[rgba(98,58,73,0.84)] shadow-[0_18px_44px_-28px_rgba(43,31,41,0.42)]">
          <ImageIcon className="h-5 w-5" />
        </div>
        <p className="mt-5 text-lg font-semibold text-[rgb(var(--foreground))]">
          Add photos to <span className="font-mono text-[0.95em]">public/kittu</span>
        </p>
        <p className="section-copy mx-auto mt-3 max-w-xl text-[rgba(74,56,65,0.76)]">
          Once the images are there, this gallery will pick them up automatically and
          render them in the layout without any extra code changes.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5 sm:space-y-6">
        <div className="soft-panel-strong overflow-hidden p-3 sm:p-4">
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <button
              type="button"
              onClick={() => openModal(featuredIndex)}
              className="group relative overflow-hidden rounded-[28px] bg-[rgba(37,27,33,0.95)] text-left"
            >
              <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3">
                <div className="rounded-full border border-white/14 bg-[rgba(255,255,255,0.12)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82 backdrop-blur">
                  Featured memory
                </div>
                <div className="rounded-full border border-white/14 bg-[rgba(255,255,255,0.12)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72 backdrop-blur">
                  {String(featuredIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </div>
              </div>

              <div className="relative h-[23rem] w-full sm:h-[31rem]">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={featuredItem.src}
                    custom={featuredDirection}
                    className="absolute inset-0"
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, x: featuredDirection * 22, scale: 1.015 }
                    }
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={
                      reduceMotion
                        ? undefined
                        : { opacity: 0, x: featuredDirection * -22, scale: 0.99 }
                    }
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={featuredItem.src}
                      alt={featuredItem.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,13,0.08),rgba(15,10,13,0.58))]" />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/68">
                  Tap to open
                </p>
                <p className="mt-2 max-w-xl text-lg leading-7 text-white/94 sm:text-[1.35rem]">
                  {featuredItem.alt.replace(", a photo memory for Kittu", "")}
                </p>
              </div>
            </button>

            <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-white/70 bg-white/75 p-5 sm:p-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(148,92,108,0.16)] bg-[rgba(255,250,247,0.9)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(98,58,73,0.78)]">
                  <Play className="h-3.5 w-3.5" />
                  Memory flow
                </div>
                <h3 className="mt-4 text-3xl font-semibold leading-[1.02] text-[rgb(var(--foreground))]">
                  One photo to the next, softly.
                </h3>
                <p className="section-copy mt-4 text-[rgba(74,56,65,0.78)]">
                  The featured frame now drifts through the memories on its own and
                  opens into a full-screen view when you want to stay with one a little
                  longer.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goFeaturedPrevious}
                    className="secondary-button !h-11 !w-11 !rounded-full !p-0"
                    aria-label="Previous featured memory"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goFeaturedNext}
                    className="secondary-button !h-11 !w-11 !rounded-full !p-0"
                    aria-label="Next featured memory"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {items.map((item, index) => (
                    <button
                      key={item.src}
                      type="button"
                      onClick={() => setFeatured(index, index >= featuredIndex ? 1 : -1)}
                      className={cn(
                        "relative aspect-[0.9] overflow-hidden rounded-[16px] border transition duration-300",
                        index === featuredIndex
                          ? "border-[rgba(148,92,108,0.55)] shadow-[0_14px_30px_-18px_rgba(98,58,73,0.65)]"
                          : "border-white/75 opacity-75 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid auto-cols-[82vw] grid-flow-col gap-4 overflow-x-auto pb-3 pr-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] md:auto-cols-auto md:grid-flow-row md:grid-cols-12 md:auto-rows-[170px] md:overflow-visible md:pb-0 md:pr-0 lg:auto-rows-[190px] [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => openModal(index)}
              className={cn(
                "group relative w-[82vw] snap-start overflow-hidden rounded-[28px] border border-white/70 bg-white/75 text-left shadow-[0_24px_72px_-38px_rgba(43,31,41,0.42)] transition duration-300 hover:-translate-y-0.5 active:scale-[0.99] md:w-auto",
                "min-h-[25rem] md:min-h-0",
                layoutPattern[index % layoutPattern.length]
              )}
            >
              <div className="relative h-full w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 82vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-500 will-change-transform group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,16,21,0.03),rgba(23,16,21,0.55))]" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                  Memory {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/92 sm:text-base">
                  {item.alt.replace(", a photo memory for Kittu", "")}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            className="fixed inset-0 z-50 bg-[rgba(24,17,21,0.75)] px-4 py-5 backdrop-blur-md sm:px-6 sm:py-8"
            aria-modal="true"
            role="dialog"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={closeModal}
          >
            <motion.div
              className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center"
              initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="soft-panel-strong relative overflow-hidden rounded-[30px] p-3 sm:p-4">
                <div className="flex items-center justify-between gap-4 pb-3 sm:pb-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(148,92,108,0.7)]">
                      Memory {String(currentIndex + 1).padStart(2, "0")} of{" "}
                      {String(items.length).padStart(2, "0")}
                    </p>
                    <p className="mt-1 truncate text-sm text-[rgba(63,45,52,0.82)] sm:text-base">
                      {activeItem.alt.replace(", a photo memory for Kittu", "")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="secondary-button !h-11 !w-11 !rounded-full !p-0"
                    aria-label="Close memory preview"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative overflow-hidden rounded-[24px] bg-[rgba(37,27,33,0.9)]">
                  <div className="relative h-[60vh] w-full sm:h-[72vh]">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.div
                        key={activeItem.src}
                        custom={modalDirection}
                        className="absolute inset-0"
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, x: modalDirection * 28, scale: 1.01 }
                        }
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={
                          reduceMotion
                            ? undefined
                            : { opacity: 0, x: modalDirection * -28, scale: 0.99 }
                        }
                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Image
                          src={activeItem.src}
                          alt={activeItem.alt}
                          fill
                          sizes="100vw"
                          className="object-contain"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {items.length > 1 ? (
                  <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-3 sm:flex">
                    <button
                      type="button"
                      onClick={goPrevious}
                      className="pointer-events-auto secondary-button !h-12 !w-12 !rounded-full !bg-white/92 !p-0"
                      aria-label="Previous memory"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="pointer-events-auto secondary-button !h-12 !w-12 !rounded-full !bg-white/92 !p-0"
                      aria-label="Next memory"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}

                {items.length > 1 ? (
                  <div className="mt-3 flex items-center justify-center gap-3 sm:hidden">
                    <button
                      type="button"
                      onClick={goPrevious}
                      className="secondary-button"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <button type="button" onClick={goNext} className="secondary-button">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
