// =============================================
// HALAMAN BUAT LAPORAN (Form + Cloud Insert + Optimistic UI)
// =============================================

import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useReports } from "../../context/ReportContext";

import { dummyCategories, dummyLocations } from "../../constants/data";
import { Category, Location, ReportPriority } from "../../types";
import { validateLaporanForm } from "../../functions";

const PRIORITIES: { label: string; value: ReportPriority }[] = [
  { label: "Rendah", value: "rendah" },
  { label: "Sedang", value: "sedang" },
  { label: "Tinggi", value: "tinggi" },
];

export default function BuatLaporanScreen() {
  const router = useRouter();
  const { theme, styles } = useTheme();
  const { addReport } = useReports();

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [priority, setPriority] = useState<ReportPriority>("sedang");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigateToIndex = (): void => {
    router.dismissTo("/");
  };

  const showError = (title: string, message: string): void => {
    setErrorMessage(message);
    if (Platform.OS !== "web") {
      Alert.alert(title, message);
    }
  };

  const validateForm = (): boolean => {
    const result = validateLaporanForm(
      judul,
      deskripsi,
      selectedCategory,
      selectedLocation
    );
    if (!result.isValid) {
      showError("Error", result.message || "Data form tidak valid!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;
    setErrorMessage(null);
    if (!validateForm()) return;

    const cleanTitle = judul.trim();
    setIsSubmitting(true);
    const result = await addReport({
      title: cleanTitle,
      description: deskripsi,
      categoryId: selectedCategory!,
      locationId: selectedLocation!,
      priority,
    });
    setIsSubmitting(false);

    if (!result.success) {
      showError(
        "Gagal Mengirim",
        result.error || "Terjadi kesalahan saat menyimpan ke cloud."
      );
      return;
    }

    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && typeof window.alert === "function") {
        window.alert(
          `Laporan "${cleanTitle}" berhasil disimpan ke cloud dan akan segera ditindaklanjuti.`
        );
      }
      navigateToIndex();
      return;
    }

    Alert.alert(
      "Berhasil! ✅",
      `Laporan "${cleanTitle}" berhasil disimpan ke cloud dan akan segera ditindaklanjuti.`,
      [{ text: "OK", onPress: navigateToIndex }],
      { cancelable: false }
    );
  };

  const renderChips = <T extends Category | Location>(
    items: T[],
    selectedId: number | null,
    onSelect: (id: number) => void
  ) => {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            disabled={isSubmitting}
            onPress={() => onSelect(item.id)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                selectedId === item.id ? theme.primary : theme.inputBg,
              borderWidth: 1,
              borderColor:
                selectedId === item.id ? theme.primary : theme.border,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "500",
                color: selectedId === item.id ? "#ffffff" : theme.text,
              }}
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={navigateToIndex}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </Pressable>
          <Text style={[styles.headerTitle, { marginLeft: 16, fontSize: 20 }]}>
            Buat Laporan Baru
          </Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Laporkan kerusakan fasilitas kampus
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {errorMessage && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: theme.dangerBg,
              borderRadius: 12,
              padding: 12,
              marginBottom: 14,
            }}
          >
            <Ionicons name="alert-circle" size={18} color={theme.dangerText} />
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: theme.dangerText,
                fontWeight: "500",
              }}
            >
              {errorMessage}
            </Text>
          </View>
        )}

        {/* Judul */}
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.text,
              marginBottom: 8,
            }}
          >
            Judul Laporan *
          </Text>
          <TextInput
            value={judul}
            onChangeText={setJudul}
            placeholder="Contoh: AC Mati di Ruang 302"
            placeholderTextColor={theme.textMuted}
            editable={!isSubmitting}
            numberOfLines={1}
            style={{
              backgroundColor: theme.inputBg,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              color: theme.text,
            }}
          />
        </View>

        {/* Deskripsi */}
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.text,
              marginBottom: 8,
            }}
          >
            Deskripsi Kerusakan *
          </Text>
          <TextInput
            value={deskripsi}
            onChangeText={setDeskripsi}
            placeholder="Jelaskan kerusakan secara detail..."
            placeholderTextColor={theme.textMuted}
            editable={!isSubmitting}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              backgroundColor: theme.inputBg,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              color: theme.text,
              minHeight: 120,
            }}
          />
        </View>

        {/* Kategori */}
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.text,
              marginBottom: 12,
            }}
          >
            Kategori Kerusakan *
          </Text>
          {renderChips(dummyCategories, selectedCategory, setSelectedCategory)}
        </View>

        {/* Lokasi */}
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.text,
              marginBottom: 12,
            }}
          >
            Lokasi *
          </Text>
          {renderChips(dummyLocations, selectedLocation, setSelectedLocation)}
        </View>

        {/* Prioritas */}
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.text,
              marginBottom: 12,
            }}
          >
            Tingkat Prioritas
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {PRIORITIES.map((item) => {
              const selected = priority === item.value;
              return (
                <Pressable
                  key={item.value}
                  disabled={isSubmitting}
                  onPress={() => setPriority(item.value)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 12,
                    alignItems: "center",
                    backgroundColor: selected ? theme.primary : theme.inputBg,
                    borderWidth: 1,
                    borderColor: selected ? theme.primary : theme.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: selected ? "#ffffff" : theme.text,
                    }}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Upload foto placeholder */}
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.text,
              marginBottom: 12,
            }}
          >
            Foto Bukti (opsional)
          </Text>
          <Pressable
            style={{
              height: 120,
              backgroundColor: theme.inputBg,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: theme.border,
              borderStyle: "dashed",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="camera-outline"
              size={36}
              color={theme.textSecondary}
            />
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 13,
                marginTop: 8,
              }}
            >
              Tap untuk mengambil foto
            </Text>
          </Pressable>
        </View>

        {/* Tombol Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{
            backgroundColor: theme.primary,
            borderRadius: 14,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 8,
            opacity: isSubmitting ? 0.75 : 1,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text
                style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}
              >
                Mengirim Laporan...
              </Text>
            </>
          ) : (
            <Text
              style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}
            >
              Kirim Laporan
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}
