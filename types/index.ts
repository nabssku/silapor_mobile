// =============================================
// TYPE & INTERFACE — Modul 1 Requirement
// =============================================

// Union type untuk status laporan
export type ReportStatus = "pending" | "in_progress" | "resolved" | "rejected";

// Union type untuk prioritas
export type ReportPriority = "rendah" | "sedang" | "tinggi";

// Union type untuk role user
export type UserRole = "mahasiswa" | "dosen" | "admin" | "teknisi";

// Interface User
export interface User {
  readonly id: string;
  name: string;
  nimNidn: string;
  email: string;
  noTelp?: string | null;
  pic: string;
  role: UserRole;
  createdAt: string;
}

// Interface Category
export interface Category {
  readonly id: number;
  name: string;
  description?: string | null;
}

// Interface Location
export interface Location {
  readonly id: number;
  name: string;
  description?: string | null;
}

// Interface Report (main data)
export interface Report {
  readonly id: string;
  title: string;
  description: string;
  photoUrl?: string | null;
  completionPhotoUrl?: string | null;
  status: ReportStatus;
  priority: ReportPriority;
  reporter?: User;
  technician?: User | null;
  category?: Category;
  location?: Location;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Interface Feedback
export interface Feedback {
  readonly id: number;
  reportId: string;
  userId: string;
  comment: string;
  rating: number; // 1-5
  createdAt: string;
}

// Interface untuk Dashboard Stats
export interface DashboardStats {
  total: number;
  aktif: number;
  selesai: number;
  ditolak: number;
}

// Interface untuk menu item di home
export interface MenuItem {
  readonly id: number;
  title: string;
  icon: string;
  color: string;
  route: string;
}
