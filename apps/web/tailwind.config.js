/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#0d9488",
          hover: "#0f766e",
          muted: "rgba(13, 148, 136, 0.15)",
          "muted-dark": "rgba(45, 212, 191, 0.2)",
        },
        surface: {
          DEFAULT: "#fafafa",
          dark: "#171717",
        },
        content: {
          primary: "#18181b",
          secondary: "#52525b",
          "primary-dark": "#fafafa",
          "secondary-dark": "#a1a1aa",
        },
        border: {
          DEFAULT: "#e4e4e7",
          dark: "#27272a",
        },
      },
      fontFamily: {
        ui: [
          "Plus Jakarta Sans",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Fraunces",
          "Plus Jakarta Sans",
          "Georgia",
          "serif",
        ],
        reading: [
          "Source Serif 4",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
      },
      fontSize: {
        "reader-base": ["1.125rem", { lineHeight: "1.75" }],
      },
      maxWidth: {
        reader: "65ch",
      },
      transitionDuration: {
        150: "150ms",
      },
    },
  },
  plugins: [],
};

module.exports = config;

