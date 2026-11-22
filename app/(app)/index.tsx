// =============================================
// HOME SCREEN — Dashboard SiLapor (Protected Route)
// Menerapkan: Auth Profile Dinamis, Sign Out, Cloud Reports Sync,
//   Pull-to-Refresh, Loop (map), FlatList, & Dynamic Theme
// =============================================

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useReports } from "../../context/ReportContext";
import { useAuth } from "../../context/AuthContext";

// Types & Interfaces
import { Report } from "../../types";
import { ThemeColors } from "../../constants/theme";
import { menuItems } from "../../constants/data";
import {
  waktuRelatif,
  getStatusLabel,
  getStatusColor,
  generateReportCode,
} from "../../functions";

const renderStatCard = (
  label: string,
  value: number,
  color: string,
  styles: any
) => {
  return (
    <View
      style={[styles.statCard, { backgroundColor: color }]}
      key={label}
    >
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const getGreeting = (): string => {
  const now = new Date().getHours();
  if (now >= 4 && now < 11) return "Pagi";
  if (now >= 11 && now < 15) return "Siang";
  if (now >= 15 && now < 18) return "Sore";
  return "Malam";
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const formatRoleLabel = (rawRole: unknown): string => {
  if (typeof rawRole !== "string" || !rawRole.trim()) return "Mahasiswa";
  return rawRole.charAt(0).toUpperCase() + rawRole.slice(1);
};

const welcomeTime = (
  nama: string,
  roleLabel: string,
  nimNidn: string,
  styles: any,
  theme: ThemeColors
) => {
  return (
    <View style={{ flex: 1, paddingRight: 10 }}>
      <Text style={{ color: theme.textMuted, fontSize: 14 }}>
        Halo, Selamat {getGreeting()}
      </Text>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {nama}
      </Text>
      <Text style={styles.headerSubtitle} numberOfLines={1}>
        {roleLabel} · {nimNidn}
      </Text>
    </View>
  );
};

const ReportCard = ({ item }: { item: Report }) => {
  const router = useRouter();
  const { theme, styles } = useTheme();
  const statusColor = getStatusColor(item.status);

  return (
    <Pressable
      onPress={() => router.push(`/detail/${item.id}`)}
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

export default function HomeScreen() {
  const router = useRouter();
  const { theme, styles, isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const {
    reports,
    isLoadingReports,
    reportsError,
    refreshReports,
  } = useReports();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Pengguna";
  const roleLabel = formatRoleLabel(user?.user_metadata?.role);
  const nimNidn =
    (user?.user_metadata?.nim_nidn as string | undefined) ||
    user?.email ||
    "-";
  const initials = getInitials(displayName);

  const performSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } catch {
      Alert.alert("Gagal Keluar", "Tidak dapat mengakhiri sesi saat ini.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSignOutPress = () => {
    if (Platform.OS === "web") {
      performSignOut();
      return;
    }
    Alert.alert("Keluar dari SiLapor", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: performSignOut },
    ]);
  };

  // STATE: Menghitung statistik secara dinamis dari state laporan
  const aktifCount = reports.filter(
    (r) => r.status === "pending" || r.status === "in_progress"
  ).length;
  const selesaiCount = reports.filter((r) => r.status === "resolved").length;
  const ditolakCount = reports.filter((r) => r.status === "rejected").length;

  const navigateTo = (route: string): void => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingReports}
            onRefresh={refreshReports}
            tintColor={theme.primary}
          />
        }
      >
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {welcomeTime(displayName, roleLabel, nimNidn, styles, theme)}

            {/* Header Right: Theme Switcher + Sign Out + Avatar */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Pressable
                onPress={toggleTheme}
                accessibilityLabel="Ganti tema terang / gelap"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(255, 255, 255, 0.2)",
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(255, 255, 255, 0.3)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={isDark ? "sunny" : "moon"}
                  size={18}
                  color="#ffffff"
                />
              </Pressable>

              <Pressable
                onPress={handleSignOutPress}
                disabled={isSigningOut}
                accessibilityLabel="Keluar akun"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(239, 68, 68, 0.25)",
                  borderWidth: 1,
                  borderColor: "rgba(239, 68, 68, 0.45)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSigningOut ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="log-out-outline" size={18} color="#ffffff" />
                )}
              </Pressable>

              {/* Avatar */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
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
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {initials}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== STATS ROW ===== */}
          <View style={styles.statsRow}>
            {[
              {
                label: "Aktif",
                value: aktifCount,
                color: theme.warning,
              },
              {
                label: "Selesai",
                value: selesaiCount,
                color: theme.success,
              },
              {
                label: "Ditolak",
                value: ditolakCount,
                color: theme.danger,
              },
            ].map((stat) =>
              renderStatCard(stat.label, stat.value, stat.color, styles)
            )}
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
            <Text style={styles.sectionTitle}>Laporan Saya</Text>
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

          {isLoadingReports && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 8,
                gap: 8,
              }}
            >
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                Menyinkronkan laporan dari Supabase...
              </Text>
            </View>
          )}

          {reportsError && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 8,
                padding: 12,
                borderRadius: 12,
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
                gap: 10,
              }}
            >
              <Text style={{ flex: 1, fontSize: 12, color: theme.dangerText }}>
                {reportsError}
              </Text>
              <Pressable onPress={refreshReports}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: theme.primary,
                  }}
                >
                  Coba lagi
                </Text>
              </Pressable>
            </View>
          )}

          <FlatList
            data={reports.slice(0, 5)}
            renderItem={({ item }) => <ReportCard item={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !isLoadingReports ? (
                <View style={[styles.card, { alignItems: "center", paddingVertical: 24 }]}>
                  <Ionicons
                    name="document-text-outline"
                    size={36}
                    color={theme.textSecondary}
                  />
                  <Text
                    style={{
                      color: theme.text,
                      fontWeight: "600",
                      marginTop: 10,
                      fontSize: 14,
                    }}
                  >
                    Belum ada laporan
                  </Text>
                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontSize: 12,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    Buat laporan baru untuk akun ini dan simpan langsung ke Supabase.
                  </Text>
                </View>
              ) : null
            }
          />
        </View>

        {/* Footer */}
        <View style={{ alignItems: "center", paddingVertical: 30 }}>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
            SiLapor Mobile v1.0 · Akun Terverifikasi
          </Text>
          <Text
            style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}
          >
            {user?.email || "Sistem Pelaporan Fasilitas Kampus UMM"}
          </Text>

        </View>
      </ScrollView>

      {/* ===== MENU BAR — Sticky Bottom ===== */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 65,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderColor: theme.border,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => navigateTo(item.route)}
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Ionicons name={item.icon as any} size={22} color={item.color} />
            <Text
              style={{
                fontSize: 10,
                color: theme.text,
                marginTop: 2,
                fontWeight: "600",
              }}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
