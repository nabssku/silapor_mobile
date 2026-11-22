// =============================================
// HALAMAN DAFTAR SEMUA LAPORAN (Cloud Sync + Pull-to-Refresh + Filter)
// =============================================

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useReports } from "../../../context/ReportContext";

import { Report, ReportStatus } from "../../../types";
import {
  filterByStatus,
  getStatusLabel,
  getStatusColor,
  getPriorityColor,
  generateReportCode,
  waktuRelatif,
} from "../../../functions";

const filterTabs: {
  id: number;
  label: string;
  value: ReportStatus | "semua" | "aktif";
}[] = [
  { id: 0, label: "Semua", value: "semua" },
  { id: 1, label: "Aktif", value: "aktif" },
  { id: 2, label: "Selesai", value: "resolved" },
  { id: 3, label: "Ditolak", value: "rejected" },
];

export default function LaporanScreen() {
  const router = useRouter();
  const { theme, styles } = useTheme();
  const { reports, isLoadingReports, reportsError, refreshReports } =
    useReports();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const [activeFilter, setActiveFilter] = useState<
    ReportStatus | "semua" | "aktif"
  >("semua");

  let filteredReports = filterByStatus(reports, activeFilter);
  if (categoryId) {
    filteredReports = filteredReports.filter(
      (r) => r.category?.id === Number(categoryId)
    );
  }

  const renderReportItem = ({ item }: { item: Report }) => {
    const statusColor = getStatusColor(item.status);
    const priorityColor = getPriorityColor(item.priority);

    return (
      <Pressable
        onPress={() => router.push(`/detail/${item.id}`)}
        style={[styles.card, { marginHorizontal: 20 }]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{ fontSize: 12, fontWeight: "600", color: theme.primary }}
          >
            {generateReportCode(item.id.slice(0, 8))}
          </Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <View
              style={[styles.badge, { backgroundColor: priorityColor.bg }]}
            >
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

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text
          style={[styles.cardDescription, { marginTop: 4 }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={{ flexDirection: "row", marginTop: 10, gap: 16 }}>
          {item.category && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="pricetag-outline"
                size={13}
                color={theme.textSecondary}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: theme.textSecondary,
                  marginLeft: 4,
                }}
              >
                {item.category.name}
              </Text>
            </View>
          )}
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
                  marginLeft: 4,
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
                marginLeft: 4,
              }}
            >
              {waktuRelatif(item.createdAt)}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
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

      {/* Filter Tabs */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        {filterTabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveFilter(tab.value)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                activeFilter === tab.value ? theme.primary : theme.card,
              borderWidth: 1,
              borderColor:
                activeFilter === tab.value ? theme.primary : theme.border,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color:
                  activeFilter === tab.value
                    ? "#ffffff"
                    : theme.textSecondary,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoadingReports && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingBottom: 8,
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
            marginHorizontal: 20,
            marginBottom: 8,
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
        data={filteredReports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingReports}
            onRefresh={refreshReports}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Tidak ada laporan dengan status ini
          </Text>
        }
      />
    </View>
  );
}
