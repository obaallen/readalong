"use client";

import { forwardRef } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={cx(
        "h-11 w-full rounded-2xl border border-border dark:border-border-dark bg-white/80 dark:bg-zinc-950/40 backdrop-blur px-4 text-sm text-content-primary dark:text-content-primary-dark placeholder:text-content-secondary dark:placeholder:text-content-secondary-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
        className
      )}
    />
  );
});

