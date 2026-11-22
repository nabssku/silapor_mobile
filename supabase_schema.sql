-- =============================================
-- SKEMA DATABASE & ROW LEVEL SECURITY (RLS) - SILAPOR
-- Jalankan di Supabase Dashboard -> SQL Editor -> New query -> Run
-- =============================================

-- 1. Buat tabel reports
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  location_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  priority TEXT NOT NULL DEFAULT 'sedang' CHECK (priority IN ('rendah', 'sedang', 'tinggi')),
  reporter_name TEXT,
  reporter_nim TEXT,
  reporter_email TEXT,
  reporter_role TEXT DEFAULT 'mahasiswa',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 3. Isolasi akses CRUD berdasarkan auth.uid() dari token JWT pengguna
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reports" ON public.reports;
CREATE POLICY "Users can insert own reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reports" ON public.reports;
CREATE POLICY "Users can update own reports"
  ON public.reports FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reports" ON public.reports;
CREATE POLICY "Users can delete own reports"
  ON public.reports FOR DELETE
  USING (auth.uid() = user_id);
