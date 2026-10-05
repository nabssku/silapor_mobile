// =============================================
// HALAMAN BUAT LAPORAN (Form)
// Menerapkan: TextInput, Pressable, Custom Function,
//   Inline & External Styles, & Dynamic Theme
// =============================================

import { View, Text, TextInput, ScrollView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

import { dummyCategories, dummyLocations } from "../constants/data";
import { Category, Location } from "../types";
import { validateLaporanForm } from "../functions";

export default function BuatLaporanScreen() {
  const router = useRouter();
  const { theme, styles } = useTheme();

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  // Custom function: validasi form
  const validateForm = (): boolean => {
    const result = validateLaporanForm(judul, deskripsi, selectedCategory, selectedLocation);
    if (!result.isValid) {
      Alert.alert("Error", result.message || "Data form tidak valid!");
      return false;
    }
    return true;
  };

  // Custom function: submit form
  const handleSubmit = (): void => {
    if (!validateForm()) return;

    Alert.alert(
      "Berhasil! ✅",
      `Laporan "${judul}" berhasil dikirim dan akan segera ditindaklanjuti.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  // Custom function: render pilihan chip (reusable)
  const renderChips = <T extends Category | Location>(
    items: T[],
    selectedId: number | null,
    onSelect: (id: number) => void
  ) => {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {/* LOOP MAP pada array of objects */}
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: selectedId === item.id ? theme.primary : theme.inputBg,
              borderWidth: 1,
              borderColor: selectedId === item.id ? theme.primary : theme.border,
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
          <Pressable onPress={() => router.back()}>
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Judul */}
        <View style={styles.card}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text, marginBottom: 8 }}>
            Judul Laporan *
          </Text>
          <TextInput
            value={judul}
            onChangeText={setJudul}
            placeholder="Contoh: AC Mati di Ruang 302"
            placeholderTextColor={theme.textMuted}
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
          <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text, marginBottom: 8 }}>
            Deskripsi Kerusakan *
          </Text>
          <TextInput
            value={deskripsi}
            onChangeText={setDeskripsi}
            placeholder="Jelaskan kerusakan secara detail..."
            placeholderTextColor={theme.textMuted}
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

        {/* Kategori — Loop map() */}
        <View style={styles.card}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text, marginBottom: 12 }}>
            Kategori Kerusakan *
          </Text>
          {renderChips(dummyCategories, selectedCategory, setSelectedCategory)}
        </View>

        {/* Lokasi — Loop map() */}
        <View style={styles.card}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text, marginBottom: 12 }}>
            Lokasi *
          </Text>
          {renderChips(dummyLocations, selectedLocation, setSelectedLocation)}
        </View>

        {/* Upload foto placeholder */}
        <View style={styles.card}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text, marginBottom: 12 }}>
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
            <Ionicons name="camera-outline" size={36} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 8 }}>
              Tap untuk mengambil foto
            </Text>
          </Pressable>
        </View>

        {/* Tombol Submit */}
        <Pressable
          onPress={handleSubmit}
          style={{
            backgroundColor: theme.primary,
            borderRadius: 14,
            padding: 16,
            alignItems: "center",
            marginTop: 8,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
            Kirim Laporan
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
