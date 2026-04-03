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
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#6C47FF",
        background: "#F4F4F8",
        foreground: "#0D0D0D",
        primary: {
          DEFAULT: "#6C47FF",
          light: "#EEF0FF",
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
        text: {
          primary: "#0D0D0D",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
        muted: {
          DEFAULT: "#F4F4F8",
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
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "9999px",
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
        16: "64px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
