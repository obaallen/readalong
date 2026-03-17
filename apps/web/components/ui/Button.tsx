"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-dark disabled:opacity-50 disabled:pointer-events-none active:translate-y-[0.5px] active:scale-[0.99]";

  const sizes: Record<Size, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-accent text-white dark:text-surface-dark hover:bg-accent-hover shadow-[0_12px_34px_rgba(13,148,136,0.18)] hover:shadow-[0_16px_44px_rgba(13,148,136,0.22)]",
    secondary:
      "border border-border dark:border-border-dark bg-white/80 dark:bg-zinc-950/40 backdrop-blur hover:bg-white dark:hover:bg-zinc-900/60 shadow-sm hover:shadow-md",
    ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-900/60",
  };

  return (
    <button
      {...props}
      className={cx(base, sizes[size], variants[variant], className)}
    />
  );
}

