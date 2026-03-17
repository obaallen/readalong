"use client";

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Import or paste content",
      body: "Drop in text, upload a PDF, or bring a web page into focus.",
    },
    {
      n: "02",
      title: "Click anywhere to start",
      body: "Jump to any sentence and begin listening instantly.",
    },
    {
      n: "03",
      title: "Listen and follow along",
      body: "Real-time highlighting and calm auto-scroll keep you oriented.",
    },
  ];

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="max-w-[70ch]">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          How it works
        </h2>
        <p className="mt-4 text-sm sm:text-base text-content-secondary dark:text-content-secondary-dark leading-relaxed">
          A simple flow designed for daily use—no setup, no friction.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((s) => (
          <div
            key={s.n}
            className="rounded-3xl border border-border dark:border-border-dark bg-white/80 dark:bg-zinc-950/35 backdrop-blur p-7 shadow-sm"
          >
            <div className="text-xs font-semibold tracking-wide text-accent">
              {s.n}
            </div>
            <div className="mt-3 font-semibold">{s.title}</div>
            <div className="mt-2 text-sm text-content-secondary dark:text-content-secondary-dark leading-relaxed">
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

