"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "emerald" | "alert" | "silver" | "outline";
  size?: "sm" | "md" | "lg";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const variants = {
      default: "bg-charcoal text-silver border border-border",
      gold: "bg-gold/10 text-gold border border-gold/30",
      emerald: "bg-emerald/10 text-emerald border border-emerald/30",
      alert: "bg-alert/10 text-alert border border-alert/30",
      silver: "bg-silver/10 text-silver border border-silver/30",
      outline: "bg-transparent text-gold border-2 border-gold",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-sm",
      lg: "px-4 py-1.5 text-base",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full transition-colors",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };