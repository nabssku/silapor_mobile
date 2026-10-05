// =============================================
// HALAMAN KATEGORI
// Menerapkan: FlatList, Custom Function,
//   External & Inline Style, Array of Objects & Dynamic Theme
// =============================================

import { View, Text, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";

import { dummyCategories } from "../constants/data";
import { Category } from "../types";
import {
  countReportsByCategory,
  categoryColors,
  getCategoryIcon,
} from "../functions";

export default function KategoriScreen() {
  const router = useRouter();
  const { theme, styles } = useTheme();

  // Custom function: render item kategori
  const renderCategory = ({
    item,
    index,
  }: {
    item: Category;
    index: number;
  }) => {
    const color = categoryColors[index % categoryColors.length];
    const count = countReportsByCategory(item.id);

    return (
      <Pressable
        style={[
          styles.card,
          { flexDirection: "row", alignItems: "center", marginHorizontal: 20 },
        ]}
        onPress={() => {
          console.log(`Kategori Dipilih: ${item.name}`);
        }}
      >
        {/* Icon — inline styling */}
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            backgroundColor: color + "18",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 14,
          }}
        >
          <Ionicons
            name={getCategoryIcon(item.name) as any}
            size={24}
            color={color}
          />
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>

        {/* Count badge */}
        <View
          style={{
            backgroundColor: color + "18",
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text style={{ color: color, fontWeight: "bold", fontSize: 13 }}>
            {count}
          </Text>
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
          <Text
            style={[styles.headerTitle, { marginLeft: 16, fontSize: 20 }]}
          >
            Kategori Kerusakan
          </Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {dummyCategories.length} kategori tersedia
        </Text>
      </View>

      {/* FlatList kategori */}
      <FlatList
        data={dummyCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
