// =============================================
// ROOT LAYOUT — Navigasi Page, AuthProvider & Route Protection Guard (Modul 4)
// Menerapkan: AuthContext, useSegments() Route Guard, & Anti-Flicker Loading Shield
// =============================================

import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ReportProvider } from "../context/ReportContext";
// @ts-ignore
import "../constants/theme.css";

function AppNavigation() {
  const { isDark, theme } = useTheme();
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const inAuthGroup = segments[0] === "(auth)";
  const isNavReady = Boolean(rootNavigationState?.key);
  const needsRedirect =
    isNavReady &&
    !isLoading &&
    ((!session && !inAuthGroup) || (Boolean(session) && inAuthGroup));

  useEffect(() => {
    // RULE 1: Tahan navigasi jika Auth masih loading atau navigator belum siap
    if (isLoading || !isNavReady) return;

    // RULE 2: Belum login & mencoba masuk area aplikasi -> arahkan ke login
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    // RULE 3: Sudah login & masih berada di halaman auth -> arahkan ke aplikasi
    if (session && inAuthGroup) {
      router.replace("/(app)" as any);
    }
  }, [session, isLoading, inAuthGroup, isNavReady, router]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(auth)" />
      </Stack>

      {/* Anti-flicker shield saat pengecekan token SecureStore atau proses redirect */}
      {(isLoading || !isNavReady || needsRedirect) && (
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: theme.background,
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
            Memverifikasi sesi SiLapor...
          </Text>
        </View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ReportProvider>
          <AppNavigation />
        </ReportProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
