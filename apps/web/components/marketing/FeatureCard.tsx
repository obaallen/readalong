"use client";

import type { ReactNode } from "react";

export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="ra-cardGlow rounded-3xl border border-border dark:border-border-dark bg-white/80 dark:bg-zinc-950/35 backdrop-blur p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-11 w-11 rounded-2xl bg-accent-muted dark:bg-accent-muted-dark grid place-items-center">
        {icon}
      </div>
      <div className="mt-4 font-semibold">{title}</div>
      <div className="mt-2 text-sm text-content-secondary dark:text-content-secondary-dark leading-relaxed">
        {description}
      </div>
    </div>
  );
}

