"use client";

import React, { useEffect, useRef, useState } from "react";

export type RevealVariant =
  | "fade-lift"
  | "mask-up"
  | "curtain"
  | "blur-scale"
  | "flip";

interface ScrollRevealProps {
  children: React.ReactNode;
  delayMs?: number;
  variant?: RevealVariant;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  delayMs = 0,
  variant = "blur-scale",
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  const getVariantClasses = () => {
    switch (variant) {
      case "mask-up":
        return isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-[0.98]";
      case "curtain":
        return isVisible
          ? "opacity-100 [clip-path:inset(0%_0%_0%_0%)] translate-y-0"
          : "opacity-0 [clip-path:inset(18%_0%_18%_0%)] translate-y-8";
      case "blur-scale":
        return isVisible
          ? "opacity-100 translate-y-0 scale-100 blur-0"
          : "opacity-0 translate-y-8 scale-[0.95] blur-[6px]";
      case "flip":
        return "reveal-flip";
      case "fade-lift":
      default:
        return isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-7";
    }
  };

  return (
    <div
      ref={ref}
      data-visible={isVisible ? "true" : "false"}
      style={
        {
          transitionDelay: `${delayMs}ms`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          "--reveal-delay": `${delayMs}ms`,
        } as React.CSSProperties
      }
      className={`transition-all duration-[900ms] will-change-transform ${getVariantClasses()} ${className}`}
    >
      {children}
    </div>
  );
}

/* UpliftCard / Tilt3DCard: Gentle elevation on hover/click with soft shadow; NO cursor-following tilt */

export function Tilt3DCard({
  children,
  className = "",
  onClick,
  isUplifted: externalUplifted,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isUplifted?: boolean;
}) {
  const [internalUplifted, setInternalUplifted] = useState(false);
  const isUplifted =
    externalUplifted !== undefined ? externalUplifted : internalUplifted;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (externalUplifted === undefined) {
      setInternalUplifted((prev) => !prev);
    }
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative transition-all duration-300 ease-out will-change-transform ${
        isUplifted
          ? "-translate-y-2 shadow-[0_24px_48px_-12px_rgba(28,22,19,0.18)]"
          : "hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(28,22,19,0.14)] active:-translate-y-1"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export { Tilt3DCard as UpliftCard };
