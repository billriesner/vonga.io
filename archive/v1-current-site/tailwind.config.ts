import type { Config } from "tailwindcss";

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Safelist opacity variants to ensure they're generated
    {
      pattern: /(bg|text|border)-(accent|navy)\/(5|10|15|20|25|30|40|50|60|70|80|90|95)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors with opacity support
        brand: { 
          navy: "#303E55", 
          aqua: "#33BECC", 
          coral: "#F5856E" 
        },
        gray: { 
          100: "#F5F7FA", 
          500: "#9BA6B3", 
          900: "#1B1E25" 
        },
        accent: "#33BECC",
        navy: "#303E55",
        text: "#0A0A0A",
        bg: "#FFFFFF",
        muted: "#E6F7F9",
        
        // Status colors
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        
        // Semantic color mappings
        primary: "#33BECC",
        secondary: "#303E55",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        DEFAULT: "var(--shadow-soft)",
        glow: "0 0 15px rgba(51,190,204,0.45)",
        "glow-coral": "0 0 15px rgba(245,133,110,0.45)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.25,0.1,0.25,1.0)",
      },
      spacing: {
        // 8px grid system
        xs: "var(--spacing-xs)", // 8px
        sm: "var(--spacing-sm)", // 16px
        md: "var(--spacing-md)", // 24px
        lg: "var(--spacing-lg)", // 32px
        xl: "var(--spacing-xl)", // 40px
        "2xl": "var(--spacing-2xl)", // 48px
        "3xl": "var(--spacing-3xl)", // 64px
        "4xl": "var(--spacing-4xl)", // 80px
        "5xl": "var(--spacing-5xl)", // 96px
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config as Config;
