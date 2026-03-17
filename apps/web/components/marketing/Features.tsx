"use client";

import { MousePointerClick, ScrollText, Sparkles, Zap } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="max-w-[60ch]">
        <div className="text-sm font-semibold text-accent">Built for focus</div>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em]">
          Calm by design. Fast by default.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-content-secondary dark:text-content-secondary-dark leading-relaxed">
          Everything is tuned for listening-first reading: low friction, accurate highlighting, and local playback for speed and privacy.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeatureCard
          icon={<MousePointerClick className="h-5 w-5 text-accent" aria-hidden />}
          title="Click anywhere to start"
          description="Jump to any sentence instantly—no hunting for controls."
        />
        <FeatureCard
          icon={<ScrollText className="h-5 w-5 text-accent" aria-hidden />}
          title="Reads PDFs and web pages"
          description="Bring in documents and articles without breaking flow."
        />
        <FeatureCard
          icon={<Sparkles className="h-5 w-5 text-accent" aria-hidden />}
          title="Real-time highlighting"
          description="Stay oriented with a clear “now reading” marker and subtle preview."
        />
        <FeatureCard
          icon={<Zap className="h-5 w-5 text-accent" aria-hidden />}
          title="Fast, local playback"
          description="Runs in the browser for instant response and privacy."
        />
      </div>
    </section>
  );
}

