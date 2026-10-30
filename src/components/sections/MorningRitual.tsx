"use client";
import React, { useEffect, useRef, useState } from "react";
import { Leaf, ShoppingBag, Zap, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    time: "8:00 PM",
    title: "Dispatch From Farms",
    subtitle: "Harvest 12 hours Before ",
    desc: "Hand-plucked by farmers at the coolest hour before dawn. Zero cold storage, 100% natural dew.",
    icon: Leaf,
  },
  {
    time: "4:00 AM",
    title: "Reaches at Hub",
    subtitle: "Cleaned & Sorted",
    desc: "Sorted flower-by-flower and packed in breathable pouches at our Thane dispatch hub.",
    icon: ShoppingBag,
  },
  {
    time: "6:00 AM",
    title: "Silent Dispatch",
    subtitle: "Riders On Route",
    desc: "Doorstep delivery riders leave across Thane pincodes without a single doorbell ring to preserve your family's morning peace.",
    icon: Zap,
  },
  {
    time: "8:00 AM",
    title: "Your Doorstep",
    subtitle: "Hung For Aarti",
    desc: "Fresh, fragrant sacred blooms ready on your door handle before your morning home mandir puja starts.",
    icon: MapPin,
  },
];

export function MorningRitual() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Wheel interception: scroll horizontally through slides while over the section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let isThrottled = false;

    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

      // Scroll Down / Next
      if (delta > 20) {
        if (activeIdx < SLIDES.length - 1) {
          e.preventDefault();
          if (!isThrottled) {
            isThrottled = true;
            setActiveIdx((prev) => Math.min(prev + 1, SLIDES.length - 1));
            setTimeout(() => {
              isThrottled = false;
            }, 450);
          }
        }
        // If already at last slide, allow normal vertical scroll down the page
      } else if (delta < -20) {
        // Scroll Up / Prev
        if (activeIdx > 0) {
          e.preventDefault();
          if (!isThrottled) {
            isThrottled = true;
            setActiveIdx((prev) => Math.max(prev - 1, 0));
            setTimeout(() => {
              isThrottled = false;
            }, 450);
          }
        }
        // If already at first slide, allow normal vertical scroll up the page
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [activeIdx]);

  const handlePrev = () => {
    setActiveIdx((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setActiveIdx((prev) => Math.min(prev + 1, SLIDES.length - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX < -40 && activeIdx < SLIDES.length - 1) {
      setActiveIdx((prev) => prev + 1);
    } else if (deltaX > 40 && activeIdx > 0) {
      setActiveIdx((prev) => prev - 1);
    }
    setTouchStartX(null);
  };

  return (
    <section
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full bg-[#071C15] grain py-10 sm:py-14 border-y border-emerald-900/40 text-white select-none"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row with Badge & Navigation Controls */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-black/40 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-300 backdrop-blur-md">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              <span>Farm-To-Mandir Journey</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium text-emerald-200/60 uppercase tracking-wider">
              Scroll Or Tap To Scrub
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-100/70">
              Stage <strong className="text-amber-300">{activeIdx + 1}</strong> of {SLIDES.length}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeIdx === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white hover:text-[#071C15] transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Previous Milestone"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={activeIdx === SLIDES.length - 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white hover:text-[#071C15] transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Next Milestone"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Horizontal Slider Stage */}
        <div className="relative overflow-hidden py-8 sm:py-10">
          <div
            className="flex will-change-transform"
            style={{
              transform: `translate3d(-${activeIdx * 100}%, 0, 0)`,
              transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {SLIDES.map((s, i) => {
              const IconComp = s.icon;
              return (
                <div
                  key={i}
                  className="w-full shrink-0 flex flex-col items-center justify-center text-center px-4"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-amber-300 border border-white/15 shadow-xl backdrop-blur-md">
                    <IconComp className="h-7 w-7" />
                  </div>

                  <div className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-amber-200 tracking-tight leading-none mb-2">
                    {s.time}
                  </div>

                  <h3 className="font-serif text-2xl sm:text-4xl text-white font-bold">
                    {s.title}
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#E8502B]">
                    {s.subtitle}
                  </p>

                  <p className="mt-3 text-xs sm:text-base text-emerald-100/80 max-w-lg leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Bottom Timeline Markers */}
        <div className="pt-4 pb-2">
          <div className="max-w-2xl mx-auto relative px-4">
            {/* Background connecting track */}
            <div className="absolute top-4 left-6 right-6 h-1 bg-white/15 rounded-full" />

            {/* Active connecting progress bar */}
            <div
              className="absolute top-4 left-6 h-1 bg-gradient-to-r from-[#E8502B] via-amber-300 to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `calc(${(activeIdx / (SLIDES.length - 1)) * 100}% - 12px)`,
              }}
            />

            {/* 4 Interactive Milestone Buttons */}
            <div className="relative flex items-center justify-between z-10">
              {SLIDES.map((s, i) => {
                const isPassed = i <= activeIdx;
                const isCurrent = i === activeIdx;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className="group flex flex-col items-center cursor-pointer transition focus:outline-none"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isCurrent
                          ? "bg-amber-300 border-amber-300 text-stone-900 scale-110 shadow-[0_0_16px_rgba(252,211,77,0.8)] font-bold text-xs"
                          : isPassed
                          ? "bg-emerald-600 border-emerald-400 text-white text-xs font-semibold"
                          : "bg-[#071C15] border-white/30 text-white/50 text-xs group-hover:border-white/70"
                      }`}
                    >
                      {i + 1}
                    </div>

                    <span
                      className={`mt-2 text-[11px] sm:text-xs font-bold transition-colors ${
                        isCurrent
                          ? "text-amber-300"
                          : isPassed
                          ? "text-white"
                          : "text-white/40 group-hover:text-white/70"
                      }`}
                    >
                      {s.time}
                    </span>

                    <span className="hidden sm:block text-[10px] text-emerald-200/60 truncate max-w-[80px]">
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
