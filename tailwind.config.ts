import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          navy: "#303E55",
          aqua: "#33BECC",
          coral: "#F5856E",
        },
        // Semantic mappings
        primary: "#33BECC", // aqua
        secondary: "#303E55", // navy
        accent: "#33BECC", // aqua
        navy: "#303E55",
        aqua: "#33BECC",
        coral: "#F5856E",
        // Grays
        gray: {
          50: "#F9FAFB",
          100: "#F5F7FA",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#9BA6B3",
          600: "#6B7280",
          700: "#4B5563",
          800: "#374151",
          900: "#1B1E25",
        },
        // Utility
        text: "#0A0A0A",
        bg: "#FFFFFF",
        muted: "#E6F7F9",
        // Status
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Now", "system-ui", "sans-serif"],
      },
      spacing: {
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "32px",
        xl: "40px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "80px",
        "5xl": "96px",
        "6xl": "128px",
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.08)",
        DEFAULT: "0 2px 8px rgba(0,0,0,0.08)",
        glow: "0 0 15px rgba(51,190,204,0.45)",
        "glow-coral": "0 0 15px rgba(245,133,110,0.45)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.25,0.1,0.25,1.0)",
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
