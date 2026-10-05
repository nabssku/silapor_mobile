// =============================================
// HOME SCREEN — Dashboard SiLapor
// Menerapkan: Custom Function, Loop (map),
//   FlatList, Type, Array of Objects,
//   Inline & External Styles, Komponen Dasar & Dynamic Theme
// =============================================

import { View, Text, ScrollView, Pressable, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";

// Types & Interfaces
import { Report, MenuItem } from "../types";
import { ThemeColors } from "../constants/theme";
// Array of Objects & Dummy Data
import { dummyReports, dummyStats, menuItems } from "../constants/data";
// Custom Functions
import {
  formatTanggal,
  waktuRelatif,
  getStatusLabel,
  getStatusColor,
  generateReportCode,
} from "../functions";

// =============================================
// CUSTOM FUNCTION: Render Stat Card
// =============================================
const renderStatCard = (label: string, value: number, color: string, styles: any) => {
  return (
    // Inline styling (langsung di style prop)
    <View
      style={[styles.statCard, { backgroundColor: color }]}
      key={label}
    >
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

// ============================================
// Custom Fungsi buat welcomeTime
// ex : Selamat Pagi, Siang, Sore, Malam
// ============================================
const welcomeTime = (nama: string, styles: any, theme: ThemeColors) => {
  const greet = () => {
    const now = new Date().getHours();
    if (now >= 4 && now < 11) {
      return "Pagi";
    }
    if (now >= 11 && now < 15) {
      return "Siang";
    }
    if (now >= 15 && now < 18) {
      return "Sore";
    } else {
      return "Malam";
    }
  };

  return (
    <View>
      <Text style={{ color: theme.textMuted, fontSize: 14 }}>
        Halo, Selamat {greet()}
      </Text>
      <Text style={styles.headerTitle}>{nama}</Text>
      <Text style={styles.headerSubtitle}>
        Mahasiswa · 202410370110357
      </Text>
    </View>
  );
};

// =============================================
// CUSTOM FUNCTION: Render Menu Button
// =============================================
const renderMenuButton = (item: MenuItem, onPress: (route: string) => void, theme: ThemeColors) => {
  return (
    <Pressable
      key={item.id}
      onPress={() => onPress(item.route)}
      // Inline styling + Theme Card
      style={{
        flex: 1,
        backgroundColor: theme.card,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          backgroundColor: item.color + "20",
          borderRadius: 12,
          padding: 10,
          marginBottom: 8,
        }}
      >
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: theme.text,
          textAlign: "center",
        }}
      >
        {item.title}
      </Text>
    </Pressable>
  );
};

// =============================================
// CUSTOM FUNCTION: Render Report Card (untuk FlatList)
// =============================================
const ReportCard = ({ item }: { item: Report }) => {
  const router = useRouter();
  const { theme, styles } = useTheme();
  const statusColor = getStatusColor(item.status);

  return (
    <Pressable
      onPress={() => router.push(`/detail/${item.id}`)}
      // External style + inline style (gabungan)
      style={[
        styles.card,
        { flexDirection: "row", alignItems: "flex-start" },
      ]}
    >
      {/* Icon kategori */}
      <View
        style={{
          backgroundColor: theme.primarySubtle,
          borderRadius: 12,
          padding: 10,
          marginRight: 12,
        }}
      >
        <Ionicons name="alert-circle" size={22} color={theme.primary} />
      </View>

      {/* Info laporan */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: theme.textSecondary,
              fontWeight: "500",
            }}
          >
            {generateReportCode(item.id)}
          </Text>
          {/* Badge status — inline styling */}
          <View
            style={[styles.badge, { backgroundColor: statusColor.bg }]}
          >
            <Text style={[styles.badgeText, { color: statusColor.text }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            gap: 12,
          }}
        >
          {item.location && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="location-outline"
                size={13}
                color={theme.textSecondary}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: theme.textSecondary,
                  marginLeft: 3,
                }}
              >
                {item.location.name}
              </Text>
            </View>
          )}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="time-outline"
              size={13}
              color={theme.textSecondary}
            />
            <Text
              style={{
                fontSize: 12,
                color: theme.textSecondary,
                marginLeft: 3,
              }}
            >
              {waktuRelatif(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// =============================================
// MAIN COMPONENT: Home Screen
// =============================================
export default function HomeScreen() {
  const router = useRouter();
  const { theme, styles, isDark, toggleTheme } = useTheme();

  // Custom function: navigasi
  const navigateTo = (route: string): void => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {welcomeTime("Nabil", styles, theme)}

            {/* Header Right: Theme Switcher Button + Avatar */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Pressable
                onPress={toggleTheme}
                accessibilityLabel="Ganti tema terang / gelap"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.2)",
                  borderWidth: 1,
                  borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.3)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={isDark ? "sunny" : "moon"}
                  size={20}
                  color="#ffffff"
                />
              </Pressable>

              {/* Avatar — inline styling */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: theme.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  NS
                </Text>
              </View>
            </View>
          </View>

          {/* ===== STATS ROW — loop dengan map ===== */}
          <View style={styles.statsRow}>
            {[
              { label: "Total", value: dummyStats.total, color: theme.info },
              {
                label: "Aktif",
                value: dummyStats.aktif,
                color: theme.warning,
              },
              {
                label: "Selesai",
                value: dummyStats.selesai,
                color: theme.success,
              },
              {
                label: "Ditolak",
                value: dummyStats.ditolak,
                color: theme.danger,
              },
            ].map((stat) => renderStatCard(stat.label, stat.value, stat.color, styles))}
          </View>
        </View>

        {/* ===== MENU GRID — loop dengan map() ===== */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {menuItems.map((item) => renderMenuButton(item, navigateTo, theme))}
          </View>
        </View>

        {/* ===== LAPORAN TERBARU — FlatList ===== */}
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.sectionTitle}>Laporan Terbaru</Text>
            <Pressable onPress={() => navigateTo("/laporan")}>
              <Text
                style={{
                  color: theme.primary,
                  fontSize: 13,
                  fontWeight: "600",
                  marginTop: 24,
                }}
              >
                Lihat Semua →
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={dummyReports}
            renderItem={({ item }) => <ReportCard item={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Footer */}
        <View style={{ alignItems: "center", paddingVertical: 30 }}>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
            SiLapor Mobile v1.0
          </Text>
          <Text
            style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}
          >
            Sistem Pelaporan Fasilitas Kampus UMM
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
