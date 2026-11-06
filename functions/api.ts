// =============================================
// API SERVICE — Modul 3: Asynchronous & API Call
// Menerapkan: Promise, resolve(), reject(), fetch(), .then(), .catch()
// =============================================

import { ApiResponse, Report } from "../types";

const API_URL = "https://radya.my.id/api/laporan";

// Mengambil daftar laporan dari External API.
// Fungsi ini langsung mengembalikan Promise<Report[]>
export function getReportsFromApi(): Promise<Report[]> {
    return new Promise((resolve, reject) => {
        fetch(API_URL)
            .then((response) => {
                // Kalau server balas error (404, 500, dll), lempar ke .catch()
                if (!response.ok) {
                    throw new Error(`Server error (status ${response.status})`);
                }
                return response.json();
            })
            .then((result: ApiResponse<Report[]>) => {
                // resolve() = operasi berhasil, kirim datanya
                if (result.success) {
                    resolve(result.data);
                    // console.log(result.data)
                } else {
                    // reject() = operasi gagal, kirim pesan errornya
                    reject(result.message);
                    // console.log(result.data)
                }
            })
            .catch((error) => {
                // Gagal total (internet mati, server down, dll)
                reject(error instanceof Error ? error.message : "Gagal mengambil laporan");
            });
    });
}