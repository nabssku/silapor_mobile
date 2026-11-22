// =============================================
// HALAMAN DETAIL LAPORAN (Cloud Update Status & Delete + Optimistic UI)
// =============================================

import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useReports } from "../../../context/ReportContext";

import {
  formatTanggal,
  getStatusLabel,
  getStatusColor,
  getPriorityColor,
  generateReportCode,
} from "../../../functions";

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, styles } = useTheme();
  const { findReportById, updateReportStatus, deleteReport } = useReports();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const report = id ? findReportById(id) : undefined;

  if (!report) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={theme.textSecondary}
        />
        <Text style={[styles.emptyText, { marginTop: 16 }]}>
          Laporan tidak ditemukan
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: theme.primary, fontWeight: "600" }}>
            ← Kembali
          </Text>
        </Pressable>
      </View>
    );
  }

  const statusColor = getStatusColor(report.status);
  const priorityColor = getPriorityColor(report.priority);
  const isResolved = report.status === "resolved";
  const isTemp = report.id.startsWith("temp-");

  const handleToggleResolve = async () => {
    if (isUpdating || isDeleting || isTemp) return;
    setIsUpdating(true);
    const nextStatus = isResolved ? "pending" : "resolved";
    const result = await updateReportStatus(report.id, nextStatus);
    setIsUpdating(false);

    if (!result.success) {
      Alert.alert(
        "Gagal Memperbarui",
        result.error || "Tidak dapat memperbarui status laporan."
      );
    }
  };

  const executeDelete = async () => {
    if (isDeleting || isUpdating || isTemp) return;
    setIsDeleting(true);
    const result = await deleteReport(report.id);
    setIsDeleting(false);

    if (!result.success) {
      const errMsg = result.error || "Tidak dapat menghapus laporan.";
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.alert(errMsg);
      } else {
        Alert.alert("Gagal Menghapus", errMsg);
      }
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleDeletePress = () => {
    if (Platform.OS === "web") {
      executeDelete();
      return;
    }
    Alert.alert(
      "Hapus Laporan",
      `Yakin ingin menghapus "${report.title}"?`,
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: executeDelete },
      ]
    );
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value: string;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
    >
      <View
        style={{
          backgroundColor: theme.primarySubtle,
          borderRadius: 10,
          padding: 8,
          marginRight: 12,
        }}
      >
        <Ionicons name={icon as any} size={18} color={theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: theme.textSecondary }}>
          {label}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: theme.text,
            marginTop: 2,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <Text style={[styles.headerTitle, { marginLeft: 16, fontSize: 20 }]}>
              Detail Laporan
            </Text>
          </View>
          <Text
            style={{ color: theme.primaryLight, fontWeight: "bold", fontSize: 12 }}
          >
            {generateReportCode(report.id.slice(0, 8))}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status + Priority Badges */}
        <View style={[styles.card, { flexDirection: "row", gap: 10 }]}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: statusColor.bg,
                paddingHorizontal: 14,
                paddingVertical: 6,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: statusColor.text, fontSize: 13 },
              ]}
            >
              ● {getStatusLabel(report.status)}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: priorityColor.bg,
                paddingHorizontal: 14,
                paddingVertical: 6,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: priorityColor.text, fontSize: 13 },
              ]}
            >
              Prioritas:{" "}
              {report.priority.charAt(0).toUpperCase() +
                report.priority.slice(1)}
            </Text>
          </View>
        </View>

        {/* Judul & Deskripsi */}
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: theme.text,
              marginBottom: 8,
            }}
          >
            {report.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: theme.textSecondary,
              lineHeight: 22,
            }}
          >
            {report.description}
          </Text>
        </View>

        {/* Info Detail */}
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: theme.text,
              marginBottom: 4,
            }}
          >
            Informasi Laporan
          </Text>

          {report.reporter && (
            <InfoRow
              icon="person-circle-outline"
              label="Pelapor"
              value={`${report.reporter.name} (${report.reporter.nimNidn})`}
            />
          )}
          <InfoRow
            icon="pricetag-outline"
            label="Kategori"
            value={report.category?.name || "-"}
          />
          <InfoRow
            icon="location-outline"
            label="Lokasi"
            value={report.location?.name || "-"}
          />
          <InfoRow
            icon="calendar-outline"
            label="Tanggal Laporan"
            value={formatTanggal(report.createdAt)}
          />
          <InfoRow
            icon="refresh-outline"
            label="Terakhir Diperbarui"
            value={formatTanggal(report.updatedAt)}
          />
          {report.technician && (
            <InfoRow
              icon="person-outline"
              label="Teknisi Ditugaskan"
              value={report.technician.name}
            />
          )}
          {report.notes && (
            <InfoRow
              icon="chatbubble-outline"
              label="Catatan"
              value={report.notes}
            />
          )}
        </View>

        {/* Aksi Cloud (Optimistic Update & Delete) */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
          <Pressable
            onPress={handleToggleResolve}
            disabled={isUpdating || isDeleting || isTemp}
            style={{
              flex: 1,
              backgroundColor: isResolved ? theme.warning : theme.success,
              borderRadius: 12,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              opacity: isUpdating || isTemp ? 0.7 : 1,
            }}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons
                name={isResolved ? "refresh" : "checkmark-done"}
                size={18}
                color="#ffffff"
              />
            )}
            <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: 13 }}>
              {isResolved ? "Buka Kembali" : "Tandai Selesai"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDeletePress}
            disabled={isDeleting || isUpdating || isTemp}
            style={{
              backgroundColor: theme.danger,
              borderRadius: 12,
              paddingHorizontal: 18,
              paddingVertical: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              opacity: isDeleting || isTemp ? 0.7 : 1,
            }}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons name="trash-outline" size={18} color="#ffffff" />
            )}
            <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: 13 }}>
              Hapus
            </Text>
          </Pressable>
        </View>

        {/* Placeholder foto */}
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: theme.text,
              marginBottom: 12,
            }}
          >
            Foto Bukti
          </Text>
          <View
            style={{
              height: 160,
              backgroundColor: theme.inputBg,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: theme.border,
              borderStyle: "dashed",
            }}
          >
            <Ionicons
              name="image-outline"
              size={48}
              color={theme.textSecondary}
            />
            <Text
              style={{
                color: theme.textSecondary,
                marginTop: 8,
                fontSize: 13,
              }}
            >
              Belum ada foto yang diunggah
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
