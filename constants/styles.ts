// =============================================
// EXTERNAL STYLING — Theme & Global Styles
// Menerapkan: CSS Token Integration & Multi-Theme
// =============================================
import { StyleSheet } from "react-native";
import { Colors, ThemeColors, lightTheme, darkTheme, Spacing, Radii, Shadows } from "./theme";

// Re-export theme tokens for easy access
export { Colors, ThemeColors, lightTheme, darkTheme, Spacing, Radii, Shadows };

// Factory function untuk membuat dynamic styles berbasis tema (Light / Dark)
export const createGlobalStyles = (theme: ThemeColors = lightTheme) => {
  return StyleSheet.create({
    // Layout
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    safeArea: {
      flex: 1,
      backgroundColor: theme.secondary,
    },
    scrollContent: {
      padding: Spacing.xl,
      paddingBottom: 40,
    },

    // Header
    header: {
      backgroundColor: theme.secondary,
      paddingTop: 50,
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing["2xl"],
      borderBottomLeftRadius: Radii["2xl"],
      borderBottomRightRadius: Radii["2xl"],
    },
    headerTitle: {
      color: theme.white,
      fontSize: 24,
      fontWeight: "bold",
    },
    headerSubtitle: {
      color: theme.textMuted,
      fontSize: 14,
      marginTop: Spacing.xs,
    },

    // Card
    card: {
      backgroundColor: theme.card,
      borderRadius: Radii.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderColor: theme.border,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    cardDescription: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },

    // Stats
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: Spacing.lg,
      gap: 10,
    },
    statCard: {
      flex: 1,
      borderRadius: 14,
      padding: 14,
      alignItems: "center",
    },
    statNumber: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.white,
    },
    statLabel: {
      fontSize: 11,
      color: "rgba(255,255,255,0.8)",
      marginTop: Spacing.xs,
      textAlign: "center",
    },

    // Badge
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: Radii.full,
      alignSelf: "flex-start",
    },
    badgeText: {
      fontSize: 11,
      fontWeight: "600",
    },

    // Section
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginTop: Spacing["2xl"],
      marginBottom: Spacing.md,
    },

    // Empty state
    emptyText: {
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: 40,
    },
  });
};

// External styles reusable (default light theme)
export const globalStyles = createGlobalStyles(lightTheme);
