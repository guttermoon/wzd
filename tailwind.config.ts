import type { Config } from "tailwindcss"

/**
 * Colours are CSS variables defined in app/globals.css so that light and
 * dark are one set of tokens rather than two sets of classes.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-text": "var(--accent-text)",
        rule: "var(--rule)",
        blood: "var(--blood)",
        "blood-text": "var(--blood-text)",
        edge: "var(--border)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Black", "Impact", "sans-serif"],
        body: ["var(--font-body)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      maxWidth: {
        page: "72rem",
      },
      borderRadius: {
        none: "0",
      },
    },
  },
  plugins: [],
}

export default config
