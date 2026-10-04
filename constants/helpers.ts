// =============================================
// CUSTOM FUNCTIONS — Modul 1 Requirement
// =============================================

import { ReportStatus, ReportPriority } from "../types";
import { Colors } from "./styles";

// Custom function: Format tanggal ke bahasa Indonesia
export const formatTanggal = (dateString: string): string => {
  const bulan: string[] = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const date = new Date(dateString);
  const hari = date.getDate();
  const namaBulan = bulan[date.getMonth()];
  const tahun = date.getFullYear();
  return `${hari} ${namaBulan} ${tahun}`;
};

// Custom function: Waktu relatif (e.g. "2 hari lalu")
export const waktuRelatif = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMenit = Math.floor(diffMs / (1000 * 60));
  const diffJam = Math.floor(diffMs / (1000 * 60 * 60));
  const diffHari = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMenit < 1) return "Baru saja";
  if (diffMenit < 60) return `${diffMenit} menit lalu`;
  if (diffJam < 24) return `${diffJam} jam lalu`;
  if (diffHari < 30) return `${diffHari} hari lalu`;
  return formatTanggal(dateString);
};

// Custom function: Label status laporan
export const getStatusLabel = (status: ReportStatus): string => {
  const statusMap: Record<ReportStatus, string> = {
    pending: "Menunggu",
    in_progress: "Diproses",
    resolved: "Selesai",
    rejected: "Ditolak",
  };
  return statusMap[status] || status;
};

// Custom function: Warna badge berdasarkan status
export const getStatusColor = (status: ReportStatus): { bg: string; text: string } => {
  const colorMap: Record<ReportStatus, { bg: string; text: string }> = {
    pending: { bg: "#fef3c7", text: "#92400e" },
    in_progress: { bg: "#dbeafe", text: "#1e40af" },
    resolved: { bg: "#dcfce7", text: "#166534" },
    rejected: { bg: "#fee2e2", text: "#991b1b" },
  };
  return colorMap[status] || { bg: "#f1f5f9", text: "#475569" };
};

// Custom function: Warna badge prioritas
export const getPriorityColor = (priority: ReportPriority): { bg: string; text: string } => {
  const colorMap: Record<ReportPriority, { bg: string; text: string }> = {
    rendah: { bg: "#dcfce7", text: "#166534" },
    sedang: { bg: "#fef3c7", text: "#92400e" },
    tinggi: { bg: "#fee2e2", text: "#991b1b" },
  };
  return colorMap[priority] || { bg: "#f1f5f9", text: "#475569" };
};

// Custom function: Icon sesuai kategori
export const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    "Kelistrikan": "flash",
    "Mebel": "chair",          // fallback
    "AC / Pendingin": "snow",
    "Sanitasi": "water",
    "Bangunan": "business",
    "IT / Elektronik": "desktop",
  };
  return iconMap[categoryName] || "help-circle";
};

// Custom function: Generate ID laporan pendek
export const generateReportCode = (id: string): string => {
  const short = id.replace("rpt-", "").toUpperCase().padStart(4, "0");
  return `#RPT-${short}`;
};
export const getDynamicGreeting = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) return "Selamat Pagi 🌅";
  if (currentHour < 15) return "Selamat Siang ☀️";
  if (currentHour < 18) return "Selamat Sore 🌇";
  return "Selamat Malam 🌙";
};
