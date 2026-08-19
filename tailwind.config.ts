import type { Config } from "tailwindcss"

const config: Config = {
  // class strategy with no .dark class ever applied — keeps stray dark: variants
  // in components/ui/* inert instead of following the OS preference
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        spicy: ["var(--font-spicy)", "Cooper Black", "cursive"],
        grand: ["var(--font-grand)", "Baloo", "Verdana", "sans-serif"],
        archblack: ["var(--font-archblack)", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Courier New", "monospace"],
        grotesk: ["var(--font-grotesk)", "Helvetica Neue", "Arial", "sans-serif"],
        oswald: ["var(--font-oswald)", "Impact", "sans-serif"],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        basker: ["var(--font-basker)", "Georgia", "serif"],
        typewriter: ["var(--font-typewriter)", "Courier New", "monospace"],
      },
      colors: {
        paper: {
          DEFAULT: "#F3EAD7",
          2: "#EAE0C8",
          3: "#E0D3B4",
        },
        ink: "#1B1712",
        "press-red": "#C8391F",
        cobalt: "#2242C7",
        mustard: "#E3A81C",
        avocado: "#7A8B2F",
        // reference-panel palette
        "panel-black": "#0E0D0B",
        scan: {
          DEFAULT: "#D9C78F",
          2: "#CDB97C",
          deep: "#B8A265",
        },
        newsprint: "#F6F1E4",
        "wire-blue": "#1D3FBF",
        "panel-pink": "#F2547D",
        "condon-red": "#B3301C",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        clip: "3px 4px 0 0 rgba(27, 23, 18, 0.85)",
        "clip-lg": "6px 8px 0 0 rgba(27, 23, 18, 0.85)",
        "clip-soft": "2px 3px 12px rgba(27, 23, 18, 0.18)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        settle: {
          "0%": {
            opacity: "0",
            transform:
              "translateY(16px) rotate(calc(var(--settle-rot, -1.5deg) * 2)) scale(0.985)",
          },
          "70%": {
            opacity: "1",
            transform:
              "translateY(-2px) rotate(calc(var(--settle-rot, -1.5deg) * 0.6)) scale(1.002)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) rotate(var(--clip-rot, 0deg)) scale(1)",
          },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "stamp-in": {
          "0%": { opacity: "0", transform: "scale(1.6) rotate(var(--stamp-rot, -4deg))" },
          "60%": { opacity: "1", transform: "scale(0.94) rotate(var(--stamp-rot, -4deg))" },
          "100%": { opacity: "1", transform: "scale(1) rotate(var(--stamp-rot, -4deg))" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate(var(--clip-rot, 0deg))" },
          "25%": { transform: "rotate(calc(var(--clip-rot, 0deg) + 0.6deg))" },
          "75%": { transform: "rotate(calc(var(--clip-rot, 0deg) - 0.6deg))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee var(--marquee-duration, 22s) linear infinite",
        settle: "settle 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-up": "fade-up 0.6s ease-out both",
        "stamp-in": "stamp-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        wobble: "wobble 0.4s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
