"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "gradient";
  containerSize?: "narrow" | "wide" | "full";
  noContainer?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = "default", containerSize = "narrow", noContainer = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-obsidian",
      muted: "bg-charcoal/50",
      gradient: "bg-gradient-to-b from-charcoal/50 to-obsidian",
    };

    return (
      <section
        ref={ref}
        className={cn("w-full py-16 sm:py-24 lg:py-32", variants[variant], className)}
        {...props}
      >
        {noContainer ? (
          children
        ) : (
          <Container size={containerSize}>{children}</Container>
        )}
      </section>
    );
  }
);
Section.displayName = "Section";

export { Section };