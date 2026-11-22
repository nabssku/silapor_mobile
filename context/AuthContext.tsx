// =============================================
// AUTH CONTEXT & HOOKS — Modul 4: Global Auth State & Real-time Session
// Menerapkan: Rehidrasi Sesi SecureStore & onAuthStateChange()
// =============================================

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { UserRole } from "../types";

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  nimNidn: string;
  role?: UserRole;
}

interface AuthActionResult {
  error: string | null;
  needsEmailConfirmation?: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signUp: (params: SignUpParams) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Penyedia status autentikasi global yang memulihkan sesi dari penyimpanan terenkripsi
 * saat aplikasi dimulai dan mendengarkan perubahan sesi Supabase secara real-time.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Gagal memulihkan sesi:", error.message);
        }
        if (isMounted) {
          setSession(data.session ?? null);
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.warn("Kesalahan saat memeriksa sesi:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthActionResult> => {
    const cleanEmail = email.trim();
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    return { error: error ? error.message : null };
  };

  const signUp = async ({
    email,
    password,
    fullName,
    nimNidn,
    role = "mahasiswa",
  }: SignUpParams): Promise<AuthActionResult> => {
    const cleanEmail = email.trim();
    const cleanName = fullName.trim();
    const cleanNim = nimNidn.trim();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          nim_nidn: cleanNim,
          role,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {
      error: null,
      needsEmailConfirmation: !data.session,
    };
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("Gagal keluar dari sesi:", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};
