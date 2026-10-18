// =============================================
// ROOT LAYOUT — Navigasi Page & Global State Providers
// Menerapkan Page Navigation (Expo Router Stack) & State Context
// =============================================

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { ReportProvider } from "../context/ReportContext";
// @ts-ignore
import "../constants/theme.css";

function AppNavigation() {
  const { isDark, theme } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      {/* NAVIGASI PAGE: Stack Navigator dari Expo Router */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    // STATE & HOOKS PROVIDER: Menyediakan Theme dan Global Reports State
    <ThemeProvider>
      <ReportProvider>
        <AppNavigation />
      </ReportProvider>
    </ThemeProvider>
  );
}
