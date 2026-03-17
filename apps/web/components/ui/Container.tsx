"use client";

import type { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1200px] px-6">{children}</div>;
}

