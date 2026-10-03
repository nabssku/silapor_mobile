// =============================================
// DUMMY DATA — Array of Objects (Modul 1)
// =============================================

import { Report, Category, Location, MenuItem, DashboardStats } from "../types";

// Array of Objects: Kategori Kerusakan
export const dummyCategories: Category[] = [
  { id: 1, name: "Kelistrikan", description: "Lampu, stop kontak, kabel" },
  { id: 2, name: "Mebel", description: "Meja, kursi, lemari" },
  { id: 3, name: "AC / Pendingin", description: "AC, kipas angin" },
  { id: 4, name: "Sanitasi", description: "Toilet, wastafel, pipa" },
  { id: 5, name: "Bangunan", description: "Dinding, lantai, atap, jendela" },
  { id: 6, name: "IT / Elektronik", description: "Proyektor, PC, jaringan" },
];

// Array of Objects: Lokasi Kampus
export const dummyLocations: Location[] = [
  { id: 1, name: "GKB 1", description: "Gedung Kuliah Bersama 1" },
  { id: 2, name: "GKB 2", description: "Gedung Kuliah Bersama 2" },
  { id: 3, name: "GKB 3", description: "Gedung Kuliah Bersama 3" },
  { id: 4, name: "GKB 4", description: "Gedung Kuliah Bersama 4" },
  { id: 5, name: "Lab Informatika", description: "Laboratorium Teknik Informatika" },
  { id: 6, name: "Perpustakaan", description: "Perpustakaan Pusat UMM" },
  { id: 7, name: "Masjid KH. M. Bedjo Dahlan", description: "Masjid Kampus UMM" },
  { id: 8, name: "Dome UMM", description: "Gedung Serbaguna Dome" },
];

// Array of Objects: Laporan Kerusakan (Dummy)
export const dummyReports: Report[] = [
  {
    id: "rpt-001",
    title: "AC Mati Total di Ruang 302",
    description: "AC di ruang 302 GKB 1 sudah mati 3 hari, suhu ruangan sangat panas saat kuliah siang.",
    photoUrl: null,
    status: "pending",
    priority: "tinggi",
    category: { id: 3, name: "AC / Pendingin" },
    location: { id: 1, name: "GKB 1", description: "Gedung Kuliah Bersama 1" },
    createdAt: "2026-10-01T08:30:00Z",
    updatedAt: "2026-10-01T08:30:00Z",
  },
  {
    id: "rpt-002",
    title: "Lampu Koridor Lantai 2 Berkedip",
    description: "Lampu neon di koridor lantai 2 GKB 3 berkedip-kedip, bikin silau dan pusing.",
    photoUrl: null,
    status: "in_progress",
    priority: "sedang",
    category: { id: 1, name: "Kelistrikan" },
    location: { id: 3, name: "GKB 3" },
    technician: {
      id: "tech-001",
      name: "Pak Budi Teknisi",
      nimNidn: "T001",
      email: "budi@umm.ac.id",
      pic: "",
      role: "teknisi",
      createdAt: "2026-01-01T00:00:00Z",
    },
    createdAt: "2026-09-28T10:15:00Z",
    updatedAt: "2026-09-29T09:00:00Z",
  },
  {
    id: "rpt-003",
    title: "Kursi Patah di Ruang 105",
    description: "Ada 3 kursi yang patah kakinya di ruang 105 GKB 2. Berbahaya jika diduduki.",
    photoUrl: null,
    status: "resolved",
    priority: "sedang",
    category: { id: 2, name: "Mebel" },
    location: { id: 2, name: "GKB 2" },
    createdAt: "2026-09-20T14:00:00Z",
    updatedAt: "2026-09-25T16:30:00Z",
  },
  {
    id: "rpt-004",
    title: "Proyektor Error di Lab C",
    description: "Proyektor Lab C Informatika menampilkan warna kekuningan dan sering mati sendiri saat presentasi.",
    photoUrl: null,
    status: "pending",
    priority: "tinggi",
    category: { id: 6, name: "IT / Elektronik" },
    location: { id: 5, name: "Lab Informatika" },
    createdAt: "2026-10-02T07:45:00Z",
    updatedAt: "2026-10-02T07:45:00Z",
  },
  {
    id: "rpt-005",
    title: "Kran Wastafel Bocor Toilet Lt.1",
    description: "Kran wastafel di toilet laki-laki lantai 1 GKB 4 bocor parah, air menggenang di lantai.",
    photoUrl: null,
    status: "in_progress",
    priority: "tinggi",
    category: { id: 4, name: "Sanitasi" },
    location: { id: 4, name: "GKB 4" },
    createdAt: "2026-09-30T11:20:00Z",
    updatedAt: "2026-10-01T08:00:00Z",
  },
  {
    id: "rpt-006",
    title: "Plafon Retak di Ruang 201",
    description: "Ada retakan besar di plafon ruang 201 GKB 1, khawatir akan jatuh.",
    photoUrl: null,
    status: "rejected",
    priority: "rendah",
    notes: "Sudah dicek, retakan hanya di cat, bukan struktural.",
    category: { id: 5, name: "Bangunan" },
    location: { id: 1, name: "GKB 1" },
    createdAt: "2026-09-15T09:00:00Z",
    updatedAt: "2026-09-18T14:00:00Z",
  },
];

// Array of Objects: Menu utama
export const menuItems: MenuItem[] = [
  { id: 1, title: "Buat Laporan", icon: "add-circle", color: "#2563eb", route: "/buat-laporan" },
  { id: 2, title: "Semua Laporan", icon: "list", color: "#8b5cf6", route: "/laporan" },
  { id: 3, title: "Riwayat Saya", icon: "time", color: "#f59e0b", route: "/laporan" },
  { id: 4, title: "Kategori", icon: "grid", color: "#22c55e", route: "/kategori" },
];

// Dashboard Stats
export const dummyStats: DashboardStats = {
  total: dummyReports.length,
  aktif: dummyReports.filter((r) => r.status === "pending" || r.status === "in_progress").length,
  selesai: dummyReports.filter((r) => r.status === "resolved").length,
  ditolak: dummyReports.filter((r) => r.status === "rejected").length,
};
