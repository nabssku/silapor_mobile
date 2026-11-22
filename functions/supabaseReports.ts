// =============================================
// SUPABASE REPORTS SERVICE — Modul 4: Cloud PostgreSQL CRUD & RLS
// =============================================

import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { dummyCategories, dummyLocations } from "../constants/data";
import { Report, ReportPriority, ReportStatus, UserRole } from "../types";

export interface ReportRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category_id: number;
  location_id: number;
  status: ReportStatus;
  priority: ReportPriority;
  reporter_name: string | null;
  reporter_nim: string | null;
  reporter_email: string | null;
  reporter_role: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateReportInput {
  title: string;
  description: string;
  categoryId: number;
  locationId: number;
  priority?: ReportPriority;
}

const VALID_ROLES: UserRole[] = ["mahasiswa", "dosen", "admin", "teknisi"];

function resolveUserRole(rawRole: unknown): UserRole {
  if (typeof rawRole === "string" && VALID_ROLES.includes(rawRole as UserRole)) {
    return rawRole as UserRole;
  }
  return "mahasiswa";
}

/**
 * Mengonversi baris tabel PostgreSQL `reports` menjadi objek `Report` aplikasi.
 */
export function mapRowToReport(row: ReportRow): Report {
  const category =
    dummyCategories.find((c) => c.id === row.category_id) || dummyCategories[0];
  const location =
    dummyLocations.find((l) => l.id === row.location_id) || dummyLocations[0];

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    photoUrl: null,
    completionPhotoUrl: null,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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
      id: row.user_id,
      name: row.reporter_name || "Civitas Akademika",
      nimNidn: row.reporter_nim || "-",
      email: row.reporter_email || "",
      pic: "",
      role: resolveUserRole(row.reporter_role),
      createdAt: row.created_at,
    },
    technician: null,
    notes: row.notes,
  };
}

function formatSupabaseError(error: { code?: string; message: string }): string {
  if (error.code === "42P01" || error.message.includes("public.reports")) {
    return "Tabel 'reports' belum dibuat di Supabase. Jalankan file supabase_schema.sql di SQL Editor Supabase.";
  }
  return error.message;
}

export async function fetchUserReportsFromSupabase(): Promise<Report[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(formatSupabaseError(error));
  }

  return ((data as ReportRow[]) ?? []).map(mapRowToReport);
}

export async function insertReportToSupabase(
  input: CreateReportInput,
  user: User
): Promise<Report> {
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Civitas Akademika";
  const nimNidn = (user.user_metadata?.nim_nidn as string | undefined) || "-";
  const role = resolveUserRole(user.user_metadata?.role);

  const { data, error } = await supabase
    .from("reports")
    .insert([
      {
        user_id: user.id,
        title: input.title.trim(),
        description: input.description.trim(),
        category_id: input.categoryId,
        location_id: input.locationId,
        priority: input.priority ?? "sedang",
        status: "pending",
        reporter_name: fullName,
        reporter_nim: nimNidn,
        reporter_email: user.email ?? "",
        reporter_role: role,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    throw new Error(
      error ? formatSupabaseError(error) : "Gagal menyimpan laporan ke cloud"
    );
  }

  return mapRowToReport(data as ReportRow);
}

export async function updateReportStatusInSupabase(
  id: string,
  status: ReportStatus
): Promise<Report> {
  const { data, error } = await supabase
    .from("reports")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(
      error ? formatSupabaseError(error) : "Gagal memperbarui status laporan"
    );
  }

  return mapRowToReport(data as ReportRow);
}

export async function deleteReportFromSupabase(id: string): Promise<void> {
  const { error } = await supabase.from("reports").delete().eq("id", id);
  if (error) {
    throw new Error(formatSupabaseError(error));
  }
}
