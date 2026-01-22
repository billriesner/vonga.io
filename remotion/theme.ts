// Design tokens from styles/tokens.json
export const theme = {
  colors: {
    brand: {
      navy: "#303E55",
      aqua: "#33BECC",
      coral: "#F5856E",
    },
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
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
    "2xl": 48,
    "3xl": 64,
    "4xl": 80,
    "5xl": 96,
    "6xl": 128,
  },
  borderRadius: {
    default: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
  },
} as const;
