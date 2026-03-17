import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReadAlong",
  description: "Browser-first text-to-speech reading",
};

const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem('ra_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-surface text-content-primary dark:bg-surface-dark dark:text-content-primary-dark">
        {children}
      </body>
    </html>
  );
}
