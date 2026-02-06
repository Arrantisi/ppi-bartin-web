# PPI Bartın Website - Phase 1: Login System

Website Perhimpunan Pelajar Indonesia (PPI) Bartın, Turki

**Status:** 🚧 Phase 1 Development - Login Page (2 minggu)

---

## 🎯 Project Overview

Website sederhana untuk mahasiswa Indonesia di Bartın dengan 3 halaman utama:

- **Home** - Landing page
- **Profile** - Profil mahasiswa
- **Events** - Kelola & daftar event

---

## 📅 Development Timeline

### ✅ Phase 1: Login System (2 Minggu) - **SEKARANG**

**Goal:** Buat sistem login yang berfungsi sempurna

**Fitur:**

- Login dengan Google
- Registrasi user (Nama Lengkap + No Öğrenci)
- Simpan data user ke database
- Session management

### 🔜 Phase 2: Home & Profile (Next)

- Homepage dengan info PPI
- Profile page user

### 🔜 Phase 3: Events (Next)

- Buat event
- Lihat events
- Daftar ke event

---

## 🏗️ Struktur Project (Simple)

```
ppi-bartin-website/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Homepage (sementara kosong)
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx           # ⭐ Login page (FOKUS 2 MINGGU)
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx           # ⭐ Register form (FOKUS 2 MINGGU)
│   │   │
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts    # ⭐ NextAuth config (FOKUS 2 MINGGU)
│   │
│   ├── components/
│   │   └── auth/
│   │       ├── GoogleLoginButton.tsx    # ⭐ Tombol login Google
│   │       └── RegisterForm.tsx         # ⭐ Form registrasi
│   │
│   └── lib/
│       ├── auth.ts                 # ⭐ Auth config
│       └── prisma.ts               # ⭐ Database client
│
├── prisma/
│   └── schema.prisma               # ⭐ Database schema pake apa database??
│
├── .env.local                      # Environment variables
├── package.json
└── README.md
```

**Fokus 2 minggu:** File yang ada tanda ⭐

---

## 🗄️ Database Schema (Simple) pake apa database??

Untuk Phase 1, kita hanya butuh **1 tabel: User**

```prisma
model User {
  id              String    @id @default(cuid())
  name            String              // Nama Lengkap
  email           String    @unique   // Dari Google
  studentNumber   String    @unique   // No Öğrenci
  image           String?             // Foto dari Google

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

---

## 🔐 Login Flow (Yang Akan Dibuat)

```
┌─────────────────┐
│  User buka /    │
│   (Homepage)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Klik "Login"    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  /login page            │
│                         │
│  [Sign in with Google]  │ ◄─── FOKUS 2 MINGGU
└────────┬────────────────┘
         │
         ▼
┌──────────────────┐
│  Google OAuth    │
│  (Pilih akun)    │
└────────┬─────────┘
         │
         ▼
    Sudah pernah
    register?
         │
    ┌────┴────┐
    │         │
   NO        YES
    │         │
    ▼         ▼
┌─────────┐  ┌──────────┐
│/register│  │ Langsung │
│ Form    │  │ ke Home  │
│         │  └──────────┘
│- Nama   │
│- No Öğr │
└────┬────┘
     │
     ▼
 ┌──────────┐
 │ Redirect │
 │ ke Home  │
 └──────────┘
```

---

## 🚀 Setup untuk Phase 1

### Prerequisites

```
✅ Node.js 18+
✅ PostgreSQL database (Supabase gratis) pake apa database??
✅ Google OAuth credentials
```

### Install

```bash
# Clone project
git clone https://github.com/[username]/ppi-bartin-website.git
cd ppi-bartin-website

# Install dependencies
npm install
```

### Environment Variables

Buat file `.env.local`:

```env

# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.ukmongkmzmqydnixoaqc:[YOUR_PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
SHADOW_DATABASE_URL="postgresql://postgres.ukmongkmzmqydnixoaqc:[YOUR_PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

BETTER_AUTH_SECRET=liay7cuaG7p4vjMRyixETVPKpkSuvfjo
BETTER_AUTH_URL=http://localhost:3000 # Base URL of your app

GOOGLE_CLIENT_ID=852644171041-c92jcklrmoo7jmstqehs31586pk7trip.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

```

### Database Setup

jika belum ada npm dan pnpm

```bash
# Check npm di komputer
npm -v

# Check pnpm di komputer
pnpm -v

# Jika belum ada pnpm
npm -g install pnpm
```

```bash
# Generate Prisma Client
pnpm dlx prisma generate

# Push schema ke database
pnpm dlx prisma db push
```

### Run Development

```bash
pnpm dev
```

Buka: [http://localhost:3000](http://localhost:3000)

---

## 📦 Dependencies (Minimal)

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "next-auth": "^5.0.0-beta.3",
    "@prisma/client": "^5.8.0",
    "react-icons": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.1",
    "prisma": "^5.8.0"
  }
}
```

---

## 📋 Checklist Phase 1 (2 Minggu)

### Week 1: Setup & Google OAuth

- [ ] **Day 1-2: Setup Project**
  - [ ] Install Next.js
  - [ ] Install dependencies
  - [ ] Setup Tailwind CSS
  - [ ] Setup folder structure

- [ ] **Day 3-4: Database Setup** pake apa database??
  - [ ] Buat akun Supabase
  - [ ] Setup Prisma
  - [ ] Buat User schema
  - [ ] Test connection

- [ ] **Day 5-7: Google OAuth**
  - [ ] Buat Google OAuth credentials
  - [ ] Setup NextAuth.js
  - [ ] Buat login page
  - [ ] Buat Google login button
  - [ ] Test login flow

### Week 2: Registration & Polish

- [ ] **Day 8-10: Registration Form**
  - [ ] Buat register page
  - [ ] Form: Nama Lengkap
  - [ ] Form: No Öğrenci (validation)
  - [ ] Connect form ke database
  - [ ] Test save data

- [ ] **Day 11-12: Logic & Validation**
  - [ ] Check: user baru atau lama?
  - [ ] Redirect logic (baru → register, lama → home)
  - [ ] Validasi No Öğrenci (8 digit, unique)
  - [ ] Error handling

- [ ] **Day 13-14: Testing & Polish**
  - [ ] Test full flow
  - [ ] Fix bugs
  - [ ] Improve UI/UX
  - [ ] Add loading states
  - [ ] Deploy ke Vercel (optional)

---

## 🎨 UI Pages (Phase 1)

### 1. Login Page (`/login`)

**Simple & clean:**

```
┌─────────────────────────────────┐
│                                 │
│      [Logo PPI Bartın]          │
│                                 │
│   Portal Mahasiswa Indonesia    │
│        di Bartın, Turki         │
│                                 │
│   ┌─────────────────────────┐   │
│   │  [G] Sign in with Google│   │
│   └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### 2. Register Page (`/register`)

**Form sederhana:**

```
┌─────────────────────────────────┐
│                                 │
│   Selamat datang, [Nama]! 👋    │
│                                 │
│   Lengkapi data untuk lanjut:   │
│                                 │
│   Nama Lengkap                  │
│   ┌─────────────────────────┐   │
│   │ [Input nama]            │   │
│   └─────────────────────────┘   │
│                                 │
│   No Öğrenci (NIM)              │
│   ┌─────────────────────────┐   │
│   │ [Contoh: 12345678]      │   │
│   └─────────────────────────┘   │
│                                 │
│   ┌─────────────────────────┐   │
│   │   Complete Registration │   │
│   └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## 🔧 Setup Google OAuth (Step-by-Step)

### 1. Google Cloud Console

1. Buka: [https://console.cloud.google.com](https://console.cloud.google.com)
2. Buat project baru: "PPI Bartin Website"
3. Enable "Google+ API"

### 2. Buat OAuth Credentials

1. Sidebar → "APIs & Services" → "Credentials"
2. "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   ```
5. **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Copy **Client ID** & **Client Secret**
7. Paste ke `.env.local`

### 3. Test

```bash
pnpm dev
# Buka http://localhost:3000/login
# Klik "Sign in with Google"
# Harus redirect ke Google login
```

---

## 🎓 Resources untuk Belajar

### NextAuth.js

- Docs: https://next-auth.js.org/
- Google Provider: https://next-auth.js.org/providers/google

### Prisma

- Docs: https://www.prisma.io/docs
- Getting Started: https://www.prisma.io/docs/getting-started

### Supabase (Database)

- https://supabase.com/
- Free tier cukup untuk project ini

---

## 💡 Tips Development

### 1. Kerja Step-by-Step

Jangan skip steps, ikuti checklist di atas satu per satu.

### 2. Test Sering

Setiap selesai 1 fitur, langsung test. Jangan tunggu semuanya selesai.

### 3. Commit Sering

```bash
git add .
git commit -m "Add Google OAuth login"
git push
```

### 4. Pakai Prisma Studio pake apa database??

Untuk lihat data di database:

```bash
pnpm dlx prisma studio
```

### 5. Debug dengan Console

Tambahkan `console.log()` untuk debug:

```typescript
console.log("User data:", user);
```

## 🎯 Success Criteria (2 Minggu)

Phase 1 dianggap selesai jika:

✅ User bisa login dengan Google  
✅ User baru diredirect ke form registrasi  
✅ User bisa input Nama & No Öğrenci  
✅ Data tersimpan ke database  
✅ User lama langsung masuk (skip registrasi)  
✅ Tidak ada error/bug critical  
✅ UI clean dan user-friendly

---

## 🚀 Next Steps (Setelah Phase 1)

- **Phase 2 (2 minggu):** Home page & Profile page
- **Phase 3 (2 minggu):** Event page (buat & lihat event)
- **Phase 4 (2 minggu):** Event registration (daftar ke event)

---

Let's build this together! 🚀
Focus 2 minggu ini: Login & Registration yang sempurna!
Setelah fase 1 selesai, kita lanjut ke Home Page & Profile (fase 2).

Good luck! 💪
