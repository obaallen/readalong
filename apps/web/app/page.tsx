"use client";

import { useTheme } from "../components/ThemeClient";
import { Navbar } from "../components/marketing/Navbar";
import { Hero } from "../components/marketing/Hero";
import { Features } from "../components/marketing/Features";
import { ProductPreview } from "../components/marketing/ProductPreview";
import { HowItWorks } from "../components/marketing/HowItWorks";
import { CTASection } from "../components/marketing/CTASection";
import { Footer } from "../components/marketing/Footer";
import { Reveal } from "../components/marketing/Reveal";

export default function LandingPage() {
  const { theme, toggle } = useTheme();

  return (
    <div>
      <Navbar theme={theme} onThemeToggle={toggle} />
      <Hero />

      <Reveal>
        <section className="mx-auto max-w-[1200px] px-6 py-10">
          <div className="rounded-[2.25rem] border border-border dark:border-border-dark bg-white/60 dark:bg-zinc-950/30 backdrop-blur p-10 text-center shadow-sm">
            <div className="text-sm font-semibold text-content-secondary dark:text-content-secondary-dark">
              Built for focus. Designed for deep reading.
            </div>
            <div className="mt-2 text-xs text-content-secondary dark:text-content-secondary-dark">
              Social proof placeholder (logos coming soon).
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <Features />
      </Reveal>
      <Reveal>
        <ProductPreview />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>

      <Reveal>
        <section id="pricing" className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="rounded-[2.5rem] border border-border dark:border-border-dark bg-white/70 dark:bg-zinc-950/25 backdrop-blur p-10 shadow-sm">
            <div className="text-sm font-semibold text-accent">Pricing</div>
            <div className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
              Simple for now.
            </div>
            <div className="mt-3 text-sm text-content-secondary dark:text-content-secondary-dark leading-relaxed">
              Placeholder section. We’ll keep this clean as the product evolves.
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <CTASection />
      </Reveal>
      <Footer />
    </div>
  );
}
