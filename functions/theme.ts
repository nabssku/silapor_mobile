// =============================================
// THEME HELPER FUNCTIONS
// =============================================
import { lightTheme, darkTheme, ThemeColors, ThemeMode } from "../constants/theme";

/**
 * Mendapatkan objek ThemeColors berdasarkan mode yang dipilih
 */
export const getThemeColors = (mode: ThemeMode, systemIsDark: boolean = false): ThemeColors => {
  if (mode === "dark") return darkTheme;
  if (mode === "light") return lightTheme;
  return systemIsDark ? darkTheme : lightTheme;
};

/**
 * Mengubah hex color ke RGBA dengan transparansi tertentu
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
