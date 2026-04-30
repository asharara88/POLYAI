import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        ink: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d8d8de",
          300: "#b6b6c0",
          400: "#8b8b97",
          500: "#65656f",
          600: "#4a4a53",
          700: "#37373e",
          800: "#23232a",
          900: "#15151a",
          950: "#0c0c10",
        },
        accent: {
          DEFAULT: "#3a8e7a",
          fg: "#0e2a23",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
