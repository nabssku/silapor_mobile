// =============================================
// REPORT CONTEXT & HOOKS — Global State Management + Supabase Cloud Sync
// Menerapkan STATE (useState), CUSTOM HOOK (useReports), & Optimistic UI (Modul 4)
// =============================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Report, ReportPriority, ReportStatus, UserRole } from "../types";
import { dummyCategories, dummyLocations } from "../constants/data";
import { useAuth } from "./AuthContext";
import {
  CreateReportInput,
  deleteReportFromSupabase,
  fetchUserReportsFromSupabase,
  insertReportToSupabase,
  updateReportStatusInSupabase,
} from "../functions/supabaseReports";

interface ActionResult {
  success: boolean;
  error?: string;
}

interface ReportContextType {
  reports: Report[];
  isLoadingReports: boolean;
  reportsError: string | null;
  refreshReports: () => Promise<void>;
  addReport: (data: CreateReportInput) => Promise<ActionResult>;
  updateReportStatus: (id: string, status: ReportStatus) => Promise<ActionResult>;
  deleteReport: (id: string) => Promise<ActionResult>;
  addApiReports: (apiReports: Report[]) => void;
  findReportById: (id: string) => Report | undefined;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const VALID_ROLES: UserRole[] = ["mahasiswa", "dosen", "admin", "teknisi"];

function getSafeRole(rawRole: unknown): UserRole {
  if (typeof rawRole === "string" && VALID_ROLES.includes(rawRole as UserRole)) {
    return rawRole as UserRole;
  }
  return "mahasiswa";
}

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const refreshReports = useCallback(async () => {
    if (!user) {
      setReports([]);
      setReportsError(null);
      return;
    }

    setIsLoadingReports(true);
    setReportsError(null);
    try {
      const cloudReports = await fetchUserReportsFromSupabase();
      setReports(cloudReports);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memuat laporan dari Supabase";
      setReportsError(message);
    } finally {
      setIsLoadingReports(false);
    }
  }, [user]);

  // Sinkronkan ulang data ketika akun aktif berubah (mencegah kebocoran cache antar-user)
  useEffect(() => {
    if (!user) {
      setReports([]);
      setReportsError(null);
      setIsLoadingReports(false);
      return;
    }
    refreshReports();
  }, [user?.id, refreshReports]);

  const addReport = async (data: {
    title: string;
    description: string;
    categoryId: number;
    locationId: number;
    priority?: ReportPriority;
  }): Promise<ActionResult> => {
    if (!user) {
      return { success: false, error: "Sesi pengguna tidak ditemukan." };
    }

    const category =
      dummyCategories.find((c) => c.id === data.categoryId) || dummyCategories[0];
    const location =
      dummyLocations.find((l) => l.id === data.locationId) || dummyLocations[0];
    const tempId = `temp-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const optimisticReport: Report = {
      id: tempId,
      title: data.title.trim(),
      description: data.description.trim(),
      photoUrl: null,
      completionPhotoUrl: null,
      status: "pending",
      priority: data.priority ?? "sedang",
      createdAt: nowIso,
      updatedAt: nowIso,
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
      location: {
        id: location.id,
        name: location.name,
        description: location.description,
      },
      reporter: {
        id: user.id,
        name:
          (user.user_metadata?.full_name as string | undefined) ||
          user.email?.split("@")[0] ||
          "Civitas Akademika",
        nimNidn: (user.user_metadata?.nim_nidn as string | undefined) || "-",
        email: user.email ?? "",
        pic: "",
        role: getSafeRole(user.user_metadata?.role),
        createdAt: nowIso,
      },
      technician: null,
      notes: null,
    };

    // Optimistic UI: tampilkan langsung di daftar sebelum request selesai
    setReports((prev) => [optimisticReport, ...prev]);

    try {
      const savedReport = await insertReportToSupabase(data, user);
      setReports((prev) =>
        prev.map((item) => (item.id === tempId ? savedReport : item))
      );
      return { success: true };
    } catch (error) {
      // Rollback jika insert ke Supabase gagal
      setReports((prev) => prev.filter((item) => item.id !== tempId));
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengirim laporan ke server.",
      };
    }
  };

  const updateReportStatus = async (
    id: string,
    status: ReportStatus
  ): Promise<ActionResult> => {
    const previousReports = reports;

    // Optimistic UI update
    setReports((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item
      )
    );

    try {
      const updated = await updateReportStatusInSupabase(id, status);
      setReports((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return { success: true };
    } catch (error) {
      // Rollback ke state sebelum update
      setReports(previousReports);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui status laporan.",
      };
    }
  };

  const deleteReport = async (id: string): Promise<ActionResult> => {
    const previousReports = reports;

    // Optimistic UI delete
    setReports((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteReportFromSupabase(id);
      return { success: true };
    } catch (error) {
      // Rollback jika penghapusan gagal
      setReports(previousReports);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menghapus laporan dari server.",
      };
    }
  };

  // Kompatibilitas Modul 3: menambah laporan eksternal tanpa duplikasi ID
  const addApiReports = (apiReports: Report[]) => {
    setReports((prev) => {
      const existingIds = new Set(prev.map((r) => r.id));
      const newOnes = apiReports.filter((r) => !existingIds.has(r.id));
      return [...prev, ...newOnes];
    });
  };

  const findReportById = (id: string) => {
    return reports.find((r) => r.id === id);
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        isLoadingReports,
        reportsError,
        refreshReports,
        addReport,
        updateReportStatus,
        deleteReport,
        addApiReports,
        findReportById,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};
