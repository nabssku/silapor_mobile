// =============================================
// HOME SCREEN — Dashboard SiLapor
// Menerapkan: Custom Function, Loop (map),
//   FlatList, Type, Array of Objects,
//   Inline & External Styles, Komponen Dasar
// =============================================

import { View, Text, ScrollView, Pressable, FlatList, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// External styles (import dari file terpisah)
import { globalStyles, Colors } from "../constants/styles";
// Types & Interfaces
import { Report, MenuItem } from "../types";
// Array of Objects & Dummy Data
import { dummyReports, dummyStats, menuItems } from "../constants/data";
// Custom Functions
import { formatTanggal, waktuRelatif, getStatusLabel, getStatusColor, generateReportCode, getDynamicGreeting } from "../constants/helpers";

// =============================================
// CUSTOM FUNCTION: Render Stat Card
// =============================================
const renderStatCard = (label: string, value: number, color: string) => {
  return (
    // Inline styling (langsung di style prop)
    <View style={[globalStyles.statCard, { backgroundColor: color }]} key={label}>
      <Text style={globalStyles.statNumber}>{value}</Text>
      <Text style={globalStyles.statLabel}>{label}</Text>
    </View>
  );
};

// =============================================
// CUSTOM FUNCTION: Render Menu Button
// =============================================
const renderMenuButton = (item: MenuItem, onPress: (route: string) => void) => {
  return (
    <Pressable
      key={item.id}
      onPress={() => onPress(item.route)}
      // Inline styling
      style={{
        flex: 1,
        backgroundColor: Colors.card,
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
      <View style={{ backgroundColor: item.color + "15", borderRadius: 12, padding: 10, marginBottom: 8 }}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.text, textAlign: "center" }}>
        {item.title}
      </Text>
    </Pressable>
  );
};

// =============================================
// CUSTOM FUNCTION: Render Report Card (untuk FlatList)
// =============================================
const ReportCard = ({ item }: { item: Report }) => {
  const statusColor = getStatusColor(item.status);
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/detail/${item.id}`)}
      // External style + inline style (gabungan)
      style={[globalStyles.card, { flexDirection: "row", alignItems: "flex-start" }]}
    >
      {/* Icon kategori */}
      <View
        style={{
          backgroundColor: Colors.primary + "12",
          borderRadius: 12,
          padding: 10,
          marginRight: 12,
        }}
      >
        <Ionicons name="alert-circle" size={22} color={Colors.primary} />
      </View>

      {/* Info laporan */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 11, color: Colors.textSecondary, fontWeight: "500" }}>
            {generateReportCode(item.id)}
          </Text>
          {/* Badge status — inline styling */}
          <View style={[globalStyles.badge, { backgroundColor: statusColor.bg }]}>
            <Text style={[globalStyles.badgeText, { color: statusColor.text }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        <Text style={globalStyles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={globalStyles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 12 }}>
          {item.location && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
              <Text style={{ fontSize: 12, color: Colors.textSecondary, marginLeft: 3 }}>
                {item.location.name}
              </Text>
            </View>
          )}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
            <Text style={{ fontSize: 12, color: Colors.textSecondary, marginLeft: 3 }}>
              {waktuRelatif(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// =============================================
// CUSTOM FUNCTION: Render Empty Report State
// =============================================
const renderEmptyReport = () => {
  return (
    <View style={{ alignItems: "center", paddingVertical: 40 }}>
      <Ionicons name="document-text-outline" size={48} color={Colors.textSecondary} />
      <Text style={{ marginTop: 12, color: Colors.textSecondary, fontSize: 14 }}>
        Belum ada laporan terbaru.
      </Text>
    </View>
  );
};

// =============================================
// MAIN COMPONENT: Home Screen
// =============================================
export default function HomeScreen() {
  const router = useRouter();

  // Custom function: navigasi
  const navigateTo = (route: string): void => {
    router.push(route as any);
  };

  // Custom function: Konfirmasi Logout
  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari aplikasi SiLapor?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: () => console.log("Logout berhasil ditekan") // Bisa diganti router.replace('/login') nanti
        }
      ]
    );
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView>
        {/* ===== HEADER ===== */}
        <View style={globalStyles.header}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              {/* Menggunakan custom function untuk sapaan berdasarkan waktu */}
              <Text style={{ color: "#94a3b8", fontSize: 14 }}>{getDynamicGreeting()}</Text>
              <Text style={globalStyles.headerTitle}>Nabil Sahsada</Text>
              <Text style={globalStyles.headerSubtitle}>Mahasiswa · 202410370110357</Text>
            </View>

            {/* Avatar dibungkus Pressable agar bisa diklik untuk Logout */}
            <Pressable onPress={handleLogout}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: Colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: Colors.white, fontSize: 18, fontWeight: "bold" }}>NS</Text>
              </View>
            </Pressable>
          </View>

          {/* ===== STATS ROW — loop dengan map() ===== */}
          <View style={globalStyles.statsRow}>
            {[
              { label: "Total", value: dummyStats.total, color: Colors.info },
              { label: "Aktif", value: dummyStats.aktif, color: Colors.warning },
              { label: "Selesai", value: dummyStats.selesai, color: Colors.success },
              { label: "Ditolak", value: dummyStats.ditolak, color: Colors.danger },
            ].map((stat) => renderStatCard(stat.label, stat.value, stat.color))}
          </View>
        </View>

        {/* ===== MENU GRID — loop dengan map() ===== */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={globalStyles.sectionTitle}>Menu</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {menuItems.map((item) => renderMenuButton(item, navigateTo))}
          </View>
        </View>

        {/* ===== LAPORAN TERBARU — FlatList ===== */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={globalStyles.sectionTitle}>Laporan Terbaru</Text>
            <Pressable onPress={() => navigateTo("/laporan")}>
              <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: "600", marginTop: 24 }}>
                Lihat Semua →
              </Text>
            </Pressable>
          </View>

          {/* Menambahkan properti ListEmptyComponent untuk menampilkan desain saat tidak ada data */}
          <FlatList
            data={dummyReports}
            renderItem={({ item }) => <ReportCard item={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyReport}
          />
        </View>

        {/* Footer */}
        <View style={{ alignItems: "center", paddingVertical: 30 }}>
          <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
            SiLapor Mobile v1.0
          </Text>
          <Text style={{ color: Colors.textSecondary, fontSize: 11, marginTop: 2 }}>
            Sistem Pelaporan Fasilitas Kampus UMM
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
