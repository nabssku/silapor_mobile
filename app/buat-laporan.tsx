// =============================================
// HALAMAN BUAT LAPORAN (Form)
// Menerapkan: TextInput, Pressable, Custom Function,
//   Inline & External Styles
// =============================================

import { View, Text, TextInput, ScrollView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

import { globalStyles, Colors } from "../constants/styles";
import { dummyCategories, dummyLocations } from "../constants/data";
import { Category, Location } from "../types";
import { validateLaporanForm } from "../functions";

export default function BuatLaporanScreen() {
  const router = useRouter();

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
              backgroundColor: selectedId === item.id ? Colors.primary : Colors.card,
              borderWidth: selectedId === item.id ? 0 : 1,
              borderColor: Colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "500",
                color: selectedId === item.id ? Colors.white : Colors.text,
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
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={globalStyles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </Pressable>
          <Text style={[globalStyles.headerTitle, { marginLeft: 16, fontSize: 20 }]}>
            Buat Laporan Baru
          </Text>
        </View>
        <Text style={globalStyles.headerSubtitle}>
          Laporkan kerusakan fasilitas kampus
        </Text>
      </View>

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        {/* Judul */}
        <View style={globalStyles.card}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 8 }}>
            Judul Laporan *
          </Text>
          <TextInput
            value={judul}
            onChangeText={setJudul}
            placeholder="Contoh: AC Mati di Ruang 302"
            placeholderTextColor={Colors.textSecondary}
            style={{
              backgroundColor: "#f8fafc",
              borderWidth: 1,
              borderColor: Colors.border,
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              color: Colors.text,
            }}
          />
        </View>

        {/* Deskripsi */}
        <View style={globalStyles.card}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 8 }}>
            Deskripsi Kerusakan *
          </Text>
          <TextInput
            value={deskripsi}
            onChangeText={setDeskripsi}
            placeholder="Jelaskan kerusakan secara detail..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              backgroundColor: "#f8fafc",
              borderWidth: 1,
              borderColor: Colors.border,
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              color: Colors.text,
              minHeight: 120,
            }}
          />
        </View>

        {/* Kategori — Loop map() */}
        <View style={globalStyles.card}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 12 }}>
            Kategori Kerusakan *
          </Text>
          {renderChips(dummyCategories, selectedCategory, setSelectedCategory)}
        </View>

        {/* Lokasi — Loop map() */}
        <View style={globalStyles.card}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 12 }}>
            Lokasi *
          </Text>
          {renderChips(dummyLocations, selectedLocation, setSelectedLocation)}
        </View>

        {/* Upload foto placeholder */}
        <View style={globalStyles.card}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 12 }}>
            Foto Bukti (opsional)
          </Text>
          <Pressable
            style={{
              height: 120,
              backgroundColor: "#f8fafc",
              borderRadius: 12,
              borderWidth: 2,
              borderColor: Colors.border,
              borderStyle: "dashed",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="camera-outline" size={36} color={Colors.textSecondary} />
            <Text style={{ color: Colors.textSecondary, fontSize: 13, marginTop: 8 }}>
              Tap untuk mengambil foto
            </Text>
          </Pressable>
        </View>

        {/* Tombol Submit */}
        <Pressable
          onPress={handleSubmit}
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 14,
            padding: 16,
            alignItems: "center",
            marginTop: 8,
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "bold" }}>
            Kirim Laporan
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
