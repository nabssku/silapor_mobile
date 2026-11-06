// =============================================
// HALAMAN DAFTAR SEMUA LAPORAN
// Menerapkan: FlatList, Custom Function, External Style & Dynamic Theme
// MODUL 3: Async Function (async/await), API Call, Loading & Error State
// =============================================

import { View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useReports } from "../../context/ReportContext";

import { Report, ReportStatus } from "../../types";
import {
  filterByStatus,
  getStatusLabel,
  getStatusColor,
  getPriorityColor,
  generateReportCode,
  waktuRelatif,
} from "../../functions";
import { getReportsFromApi } from "../../functions/api";

// Array of Objects: Filter tabs
const filterTabs: { id: number; label: string; value: ReportStatus | "semua" | "aktif" }[] = [
  { id: 0, label: "Semua", value: "semua" },
  { id: 1, label: "Aktif", value: "aktif" },
  { id: 2, label: "Selesai", value: "resolved" },
  { id: 3, label: "Ditolak", value: "rejected" },
];

export default function LaporanScreen() {
  const router = useRouter();
  const { theme, styles } = useTheme();
  // HOOKS: useReports untuk state global, useLocalSearchParams untuk parameter navigasi page
  const { reports, addApiReports } = useReports();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  // STATE: Menyimpan status filter laporan yang sedang aktif
  const [activeFilter, setActiveFilter] = useState<ReportStatus | "semua" | "aktif">("semua");
  // STATE MODUL 3: Status loading dan pesan error saat fetch API
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // MODUL 3: Custom async function untuk mengambil laporan dari External API
  const muatLaporan = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // await: tunggu Promise dari getReportsFromApi selesai dulu
      const dataApi = await getReportsFromApi();
      addApiReports(dataApi);
    } catch (error) {
      // Masuk sini kalau Promise di-reject()
      setErrorMessage(typeof error === "string" ? error : "Gagal memuat laporan dari server");
    } finally {
      // Jalan baik sukses maupun gagal
      setIsLoading(false);
    }
  };

  // useEffect: panggil API sekali saat halaman pertama kali dibuka
  useEffect(() => {
    muatLaporan();
  }, []);

  let filteredReports = filterByStatus(reports, activeFilter);
  // NAVIGASI PAGE: Filter laporan berdasarkan parameter kategori yang dikirim dari halaman kategori
  if (categoryId) {
    filteredReports = filteredReports.filter((r) => r.category?.id === Number(categoryId));
  }

  // Custom function: Render setiap item laporan
  const renderReportItem = ({ item }: { item: Report }) => {
    const statusColor = getStatusColor(item.status);
    const priorityColor = getPriorityColor(item.priority);

    return (
      <Pressable
        onPress={() => router.push(`/detail/${item.id}`)}
        style={[styles.card, { marginHorizontal: 20 }]}
      >
        {/* Baris atas: Kode + badges */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: theme.primary }}>
            {generateReportCode(item.id)}
          </Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <View style={[styles.badge, { backgroundColor: priorityColor.bg }]}>
              <Text style={[styles.badgeText, { color: priorityColor.text }]}>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
              <Text style={[styles.badgeText, { color: statusColor.text }]}>
                {getStatusLabel(item.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Judul & Deskripsi */}
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={[styles.cardDescription, { marginTop: 4 }]} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Info bawah */}
        <View style={{ flexDirection: "row", marginTop: 10, gap: 16 }}>
          {item.category && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="pricetag-outline" size={13} color={theme.textSecondary} />
              <Text style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 4 }}>
                {item.category.name}
              </Text>
            </View>
          )}
          {item.location && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location-outline" size={13} color={theme.textSecondary} />
              <Text style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 4 }}>
                {item.location.name}
              </Text>
            </View>
          )}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="time-outline" size={13} color={theme.textSecondary} />
            <Text style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 4 }}>
              {waktuRelatif(item.createdAt)}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </Pressable>
          <Text style={[styles.headerTitle, { marginLeft: 16, fontSize: 20 }]}>
            Semua Laporan
          </Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {filteredReports.length} laporan ditemukan
        </Text>
      </View>

      {/* Filter Tabs — loop map() pada array of objects */}
      <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}>
        {filterTabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveFilter(tab.value)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: activeFilter === tab.value ? theme.primary : theme.card,
              borderWidth: 1,
              borderColor: activeFilter === tab.value ? theme.primary : theme.border,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: activeFilter === tab.value ? "#ffffff" : theme.textSecondary,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* MODUL 3: Indikator loading saat fetch API berjalan */}
      {isLoading && (
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 8, gap: 8 }}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>
            Memuat laporan dari server...
          </Text>
        </View>
      )}

      {/* MODUL 3: Pesan error + tombol coba lagi kalau fetch gagal */}
      {errorMessage && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginBottom: 8,
            padding: 12,
            borderRadius: 12,
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Text style={{ flex: 1, fontSize: 12, color: theme.textSecondary }}>
            {errorMessage}
          </Text>
          <Pressable onPress={muatLaporan}>
            <Text style={{ fontSize: 12, fontWeight: "600", color: theme.primary }}>
              Coba lagi
            </Text>
          </Pressable>
        </View>
      )}

      {/* FlatList Laporan */}
      <FlatList
        data={filteredReports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Tidak ada laporan dengan status ini
          </Text>
        }
      />
    </View>
  );
}