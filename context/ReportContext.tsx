// =============================================
// REPORT CONTEXT & HOOKS — Global State Management
// Menerapkan STATE (useState) dan CUSTOM HOOK (useReports)
// =============================================

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Report } from "../types";
import { dummyReports, dummyCategories, dummyLocations } from "../constants/data";

interface ReportContextType {
  reports: Report[];
  addReport: (data: { title: string; description: string; categoryId: number; locationId: number }) => void;
  findReportById: (id: string) => Report | undefined;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

// State Provider untuk membungkus aplikasi
export const ReportProvider = ({ children }: { children: ReactNode }) => {
  // STATE: Menyimpan daftar laporan secara global
  const [reports, setReports] = useState<Report[]>(dummyReports);

  // Fungsi untuk menambah laporan baru ke state global
  const addReport = (data: {
    title: string;
    description: string;
    categoryId: number;
    locationId: number;
  }) => {
    const category = dummyCategories.find((c) => c.id === data.categoryId) || dummyCategories[0];
    const location = dummyLocations.find((l) => l.id === data.locationId) || dummyLocations[0];

    const newReport: Report = {
      id: `rpt-${Date.now()}`,
      title: data.title,
      description: data.description,
      photoUrl: null,
      completionPhotoUrl: null,
      status: "pending",
      priority: "sedang",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
        id: "u-1",
        name: "Civitas Akademika",
        nimNidn: "202410370110357",
        email: "civitas@umm.ac.id",
        pic: "https://i.pravatar.cc/150?img=1",
        role: "mahasiswa",
        createdAt: new Date().toISOString(),
      },
      technician: null,
      notes: null,
    };

    // Memperbarui state laporan
    setReports((prev) => [newReport, ...prev]);
  };

  // Mencari laporan berdasarkan ID dari state
  const findReportById = (id: string) => {
    return reports.find((r) => r.id === id);
  };

  return (
    <ReportContext.Provider value={{ reports, addReport, findReportById }}>
      {children}
    </ReportContext.Provider>
  );
};

// CUSTOM HOOK: Digunakan komponen untuk mengakses state laporan
export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};
