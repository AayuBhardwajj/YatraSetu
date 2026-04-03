import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#6C47FF",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#00C853",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#FF6D00",
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#F44336",
          foreground: "#FFFFFF",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          foreground: "#0D0D0D",
        },
        muted: {
          DEFAULT: "#F7F7FA",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#6C47FF",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0D0D0D",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        input: "8px",
        card: "12px",
        sheet: "16px",
        pill: "24px",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
