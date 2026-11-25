-- Role BENDAHARA dipakai oleh penulis transaksi keuangan.
-- ADMIN tetap diizinkan sebagai superuser di level aplikasi.
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'BENDAHARA';
