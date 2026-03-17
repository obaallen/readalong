"use client";

import { FileText } from "lucide-react";

interface SidebarProps {
  onNewDocument: () => void;
}

export function Sidebar({ onNewDocument }: SidebarProps) {
  return (
    <aside
      className="w-52 shrink-0 border-r border-border dark:border-border-dark p-4 flex flex-col bg-surface dark:bg-surface-dark"
      aria-label="Library"
    >
      <h2 className="font-semibold text-xs text-content-secondary dark:text-content-secondary-dark uppercase tracking-wide mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4" aria-hidden />
        Library
      </h2>
      <button
        type="button"
        className="text-left text-sm text-accent hover:text-accent-hover dark:text-accent dark:hover:text-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-dark rounded px-2 py-1.5 -ml-2 transition-colors duration-150"
        onClick={onNewDocument}
      >
        New document
      </button>
    </aside>
  );
}
