// =============================================
// CUSTOM FUNCTIONS — KATEGORI
// Fungsi-fungsi khusus untuk modul/halaman kategori
// =============================================

import { dummyReports } from "../constants/data";
import { Report } from "../types";

// Palette warna untuk kategori
export const categoryColors: string[] = [
  "#f59e0b", "#ef4444", "#3b82f6", "#06b6d4", "#8b5cf6", "#22c55e",
];

// Custom function: Mendapatkan warna kategori berdasarkan index
export const getCategoryColor = (index: number): string => {
  return categoryColors[index % categoryColors.length];
};

// Custom function: Hitung jumlah laporan per kategori
export const countReportsByCategory = (
  categoryId: number,
  reports: Report[] = dummyReports
): number => {
  return reports.filter((r) => r.category?.id === categoryId).length;
};

// Custom function: Icon sesuai kategori
export const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    "Kelistrikan": "flash",
    "Mebel": "chair",
    "AC / Pendingin": "snow",
    "Sanitasi": "water",
    "Bangunan": "business",
    "IT / Elektronik": "desktop",
  };
  return iconMap[categoryName] || "help-circle";
};
