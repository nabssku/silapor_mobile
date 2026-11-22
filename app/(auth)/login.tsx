// =============================================
// HALAMAN LOGIN & REGISTRASI — Modul 4: Supabase Auth Flow & Form UX
// Menerapkan: signInWithPassword, signUp + metadata, .trim(),
//   keyboardType, autoCapitalize="none", Loading State & Error Handling
// =============================================

import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: "Mahasiswa", value: "mahasiswa" },
  { label: "Dosen", value: "dosen" },
  { label: "Teknisi", value: "teknisi" },
];

export default function LoginScreen() {
  const { theme, styles, isDark, toggleTheme } = useTheme();
  const { signIn, signUp } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState("");
  const [nimNidn, setNimNidn] = useState("");
  const [role, setRole] = useState<UserRole>("mahasiswa");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const resetFeedback = () => {
    setErrorMessage(null);
    setInfoMessage(null);
  };

  const toggleMode = () => {
    resetFeedback();
    setIsRegistering((prev) => !prev);
  };

  const handleAuth = async () => {
    if (isSubmitting) return;
    resetFeedback();

    const cleanEmail = email.trim();
    const cleanName = fullName.trim();
    const cleanNim = nimNidn.trim();

    if (!cleanEmail || !password) {
      setErrorMessage("Email dan kata sandi wajib diisi.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setErrorMessage("Format alamat email tidak valid.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    if (isRegistering && (!cleanName || !cleanNim)) {
      setErrorMessage("Nama lengkap dan NIM/NIDN wajib diisi saat mendaftar.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegistering) {
        const result = await signUp({
          email: cleanEmail,
          password,
          fullName: cleanName,
          nimNidn: cleanNim,
          role,
        });

        if (result.error) {
          setErrorMessage(result.error);
          return;
        }

        if (result.needsEmailConfirmation) {
          setInfoMessage(
            "Pendaftaran berhasil! Silakan cek kotak masuk email Anda untuk konfirmasi sebelum masuk."
          );
          setIsRegistering(false);
        } else {
          setInfoMessage("Akun berhasil dibuat! Mengalihkan ke SiLapor...");
        }
      } else {
        const result = await signIn(cleanEmail, password);
        if (result.error) {
          setErrorMessage(result.error);
        }
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat proses autentikasi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: theme.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="shield-checkmark" size={24} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>SiLapor UMM</Text>
              <Text style={styles.headerSubtitle}>
                {isRegistering
                  ? "Registrasi Akun Pelapor"
                  : "Masuk ke Portal Pelaporan"}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={toggleTheme}
            accessibilityLabel="Ganti tema terang / gelap"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.16)",
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.25)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={18}
              color="#ffffff"
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.text,
              marginBottom: 4,
            }}
          >
            {isRegistering ? "Daftar Akun Baru" : "Masuk Akun"}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: theme.textSecondary,
              marginBottom: 18,
            }}
          >
            {isRegistering
              ? "Lengkapi identitas civitas akademika Anda untuk mulai melapor."
              : "Gunakan email dan kata sandi yang terdaftar di SiLapor."}
          </Text>

          {errorMessage && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: theme.dangerBg,
                borderRadius: 12,
                padding: 12,
                marginBottom: 14,
              }}
            >
              <Ionicons name="alert-circle" size={18} color={theme.dangerText} />
              <Text
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: theme.dangerText,
                  fontWeight: "500",
                }}
              >
                {errorMessage}
              </Text>
            </View>
          )}

          {infoMessage && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: theme.successBg,
                borderRadius: 12,
                padding: 12,
                marginBottom: 14,
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={theme.successText}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: theme.successText,
                  fontWeight: "500",
                }}
              >
                {infoMessage}
              </Text>
            </View>
          )}

          {isRegistering && (
            <>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: 6,
                }}
              >
                Nama Lengkap *
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Contoh: Nabil Sahsada"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="words"
                editable={!isSubmitting}
                style={{
                  backgroundColor: theme.inputBg,
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 12,
                  padding: 13,
                  fontSize: 14,
                  color: theme.text,
                  marginBottom: 14,
                }}
              />

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: 6,
                }}
              >
                NIM / NIDN *
              </Text>
              <TextInput
                value={nimNidn}
                onChangeText={setNimNidn}
                placeholder="Contoh: 202410370110357"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
                style={{
                  backgroundColor: theme.inputBg,
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 12,
                  padding: 13,
                  fontSize: 14,
                  color: theme.text,
                  marginBottom: 14,
                }}
              />

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: 8,
                }}
              >
                Peran *
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {ROLE_OPTIONS.map((option) => {
                  const isSelected = role === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      disabled={isSubmitting}
                      onPress={() => setRole(option.value)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: isSelected
                          ? theme.primary
                          : theme.inputBg,
                        borderWidth: 1,
                        borderColor: isSelected ? theme.primary : theme.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: isSelected ? "#ffffff" : theme.text,
                        }}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: theme.text,
              marginBottom: 6,
            }}
          >
            Email *
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="nama@umm.ac.id"
            placeholderTextColor={theme.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
            style={{
              backgroundColor: theme.inputBg,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 12,
              padding: 13,
              fontSize: 14,
              color: theme.text,
              marginBottom: 14,
            }}
          />

          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: theme.text,
              marginBottom: 6,
            }}
          >
            Kata Sandi *
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.inputBg,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 12,
              paddingHorizontal: 13,
              marginBottom: 20,
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Minimal 6 karakter"
              placeholderTextColor={theme.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
              style={{
                flex: 1,
                paddingVertical: 13,
                fontSize: 14,
                color: theme.text,
              }}
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={8}
              disabled={isSubmitting}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={handleAuth}
            disabled={isSubmitting}
            style={{
              backgroundColor: theme.primary,
              borderRadius: 14,
              padding: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text
                  style={{ color: "#ffffff", fontSize: 15, fontWeight: "bold" }}
                >
                  {isRegistering ? "Mendaftarkan..." : "Memverifikasi..."}
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name={isRegistering ? "person-add" : "log-in"}
                  size={18}
                  color="#ffffff"
                />
                <Text
                  style={{ color: "#ffffff", fontSize: 15, fontWeight: "bold" }}
                >
                  {isRegistering ? "Daftar Sekarang" : "Masuk ke SiLapor"}
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={toggleMode}
            disabled={isSubmitting}
            style={{ marginTop: 16, alignItems: "center", paddingVertical: 6 }}
          >
            <Text style={{ fontSize: 13, color: theme.textSecondary }}>
              {isRegistering
                ? "Sudah punya akun? "
                : "Belum punya akun? "}
              <Text style={{ color: theme.primary, fontWeight: "700" }}>
                {isRegistering ? "Masuk di sini" : "Daftar di sini"}
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
