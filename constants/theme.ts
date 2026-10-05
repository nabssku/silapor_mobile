// ==========================================================================
// SiLapor Mobile — Theme System & Token Definitions
// Menerapkan: Multi-theme (Light & Dark), CSS Variable Bridge, & Typed Palette
// ==========================================================================

export interface ThemeColors {
  // Brand & Primary
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primarySubtle: string;

  // Secondary
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Background & Surface
  background: string;
  surface: string;
  card: string;
  cardSubtle: string;
  inputBg: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Status
  success: string;
  successBg: string;
  successText: string;

  warning: string;
  warningBg: string;
  warningText: string;

  danger: string;
  dangerBg: string;
  dangerText: string;

  info: string;
  infoBg: string;
  infoText: string;

  // Border & Divider
  border: string;
  borderSubtle: string;
  borderFocus: string;
  divider: string;

  // Common
  white: string;
  black: string;
}

// --------------------------------------------------------------------------
// 1. Light Theme (Reflects :root in theme.css)
// --------------------------------------------------------------------------
export const lightTheme: ThemeColors = {
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  primaryLight: "#3b82f6",
  primarySubtle: "rgba(37, 99, 235, 0.12)",

  secondary: "#0f172a",
  secondaryLight: "#1e293b",
  secondaryDark: "#020617",

  background: "#f1f5f9",
  surface: "#ffffff",
  card: "#ffffff",
  cardSubtle: "#f8fafc",
  inputBg: "#f8fafc",

  text: "#0f172a",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",
  textInverse: "#ffffff",

  success: "#22c55e",
  successBg: "#dcfce7",
  successText: "#15803d",

  warning: "#f59e0b",
  warningBg: "#fef3c7",
  warningText: "#b45309",

  danger: "#ef4444",
  dangerBg: "#fee2e2",
  dangerText: "#b91c1c",

  info: "#3b82f6",
  infoBg: "#dbeafe",
  infoText: "#1d4ed8",

  border: "#e2e8f0",
  borderSubtle: "#f1f5f9",
  borderFocus: "#2563eb",
  divider: "#e2e8f0",

  white: "#ffffff",
  black: "#000000",
};

// --------------------------------------------------------------------------
// 2. Dark Theme (Reflects [data-theme="dark"] in theme.css)
// --------------------------------------------------------------------------
export const darkTheme: ThemeColors = {
  primary: "#3b82f6",
  primaryDark: "#2563eb",
  primaryLight: "#60a5fa",
  primarySubtle: "rgba(59, 130, 246, 0.2)",

  secondary: "#0b1120",
  secondaryLight: "#1e293b",
  secondaryDark: "#030712",

  background: "#0f172a",
  surface: "#1e293b",
  card: "#1e293b",
  cardSubtle: "#243248",
  inputBg: "#182234",

  text: "#f8fafc",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  textInverse: "#0f172a",

  success: "#22c55e",
  successBg: "rgba(34, 197, 94, 0.2)",
  successText: "#4ade80",

  warning: "#f59e0b",
  warningBg: "rgba(245, 158, 11, 0.2)",
  warningText: "#fbbf24",

  danger: "#ef4444",
  dangerBg: "rgba(239, 68, 68, 0.2)",
  dangerText: "#f87171",

  info: "#38bdf8",
  infoBg: "rgba(56, 189, 248, 0.2)",
  infoText: "#7dd3fc",

  border: "#334155",
  borderSubtle: "#1e293b",
  borderFocus: "#60a5fa",
  divider: "#334155",

  white: "#ffffff",
  black: "#000000",
};

// --------------------------------------------------------------------------
// 3. Spacing, Radii, and Typography Tokens (matching theme.css)
// --------------------------------------------------------------------------
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
};

export const Radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
};

// Backwards compatibility for existing imports
export const Colors = lightTheme;
export type ThemeMode = "light" | "dark" | "system";
