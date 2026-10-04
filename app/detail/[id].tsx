// =============================================
// HALAMAN DETAIL LAPORAN
// Menerapkan: Custom Function, External Style, Inline Style
// =============================================

import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { globalStyles, Colors } from "../../constants/styles";
import {
  findReport,
  formatTanggal,
  getStatusLabel,
  getStatusColor,
  getPriorityColor,
  generateReportCode,
} from "../../functions";

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const report = findReport(id);

  if (!report) {
    return (
      <View style={[globalStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.textSecondary} />
        <Text style={[globalStyles.emptyText, { marginTop: 16 }]}>Laporan tidak ditemukan</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.primary, fontWeight: "600" }}>← Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const statusColor = getStatusColor(report.status);
  const priorityColor = getPriorityColor(report.priority);

  // Custom function: render info row
  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
      <View style={{ backgroundColor: Colors.primary + "12", borderRadius: 10, padding: 8, marginRight: 12 }}>
        <Ionicons name={icon as any} size={18} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: Colors.textSecondary }}>{label}</Text>
        <Text style={{ fontSize: 14, fontWeight: "500", color: Colors.text, marginTop: 2 }}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={globalStyles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </Pressable>
            <Text style={[globalStyles.headerTitle, { marginLeft: 16, fontSize: 20 }]}>
              Detail Laporan
            </Text>
          </View>
          <Text style={{ color: Colors.primary, fontWeight: "bold", fontSize: 13 }}>
            {generateReportCode(report.id)}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        {/* Status + Priority Badges */}
        <View style={[globalStyles.card, { flexDirection: "row", gap: 10 }]}>
          <View style={[globalStyles.badge, { backgroundColor: statusColor.bg, paddingHorizontal: 14, paddingVertical: 6 }]}>
            <Text style={[globalStyles.badgeText, { color: statusColor.text, fontSize: 13 }]}>
              ● {getStatusLabel(report.status)}
            </Text>
          </View>
          <View style={[globalStyles.badge, { backgroundColor: priorityColor.bg, paddingHorizontal: 14, paddingVertical: 6 }]}>
            <Text style={[globalStyles.badgeText, { color: priorityColor.text, fontSize: 13 }]}>
              Prioritas: {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
            </Text>
          </View>
        </View>

        {/* Judul & Deskripsi */}
        <View style={globalStyles.card}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: Colors.text, marginBottom: 8 }}>
            {report.title}
          </Text>
          <Text style={{ fontSize: 14, color: Colors.textSecondary, lineHeight: 22 }}>
            {report.description}
          </Text>
        </View>

        {/* Info Detail */}
        <View style={globalStyles.card}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: Colors.text, marginBottom: 4 }}>
            Informasi Laporan
          </Text>

          {/* Custom function InfoRow dipanggil berulang */}
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

        {/* Placeholder foto */}
        <View style={globalStyles.card}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: Colors.text, marginBottom: 12 }}>
            Foto Bukti
          </Text>
          <View
            style={{
              height: 180,
              backgroundColor: "#f1f5f9",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: Colors.border,
              borderStyle: "dashed",
            }}
          >
            <Ionicons name="image-outline" size={48} color={Colors.textSecondary} />
            <Text style={{ color: Colors.textSecondary, marginTop: 8, fontSize: 13 }}>
              Belum ada foto yang diunggah
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
