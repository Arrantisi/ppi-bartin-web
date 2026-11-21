# Email/Password Auth — Plan

## Overview

Menambahkan autentikasi email & password sebagai opsi login selain Google OAuth. Better Auth sudah terinstall dan email/password tinggal diaktifkan. User bisa login via email + password atau Google — dua metode akun bisa di-link ke user yang sama.

---

## Database Model (Prisma)

**Tidak ada migration baru.** Better Auth sudah menyimpan password di tabel `Account` dengan `providerId: "credential"`. Schema `User`, `Session`, `Account`, `Verification` sudah ada.

Yang perlu dicek: apakah tabel `Account` sudah punya field untuk menyimpan password hash. Better Auth default schema sudah include field ini.

---

## Server Changes

### `lib/auth/server.ts` — Tambah email/password config

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      // TODO: kirim email via SendGrid / Resend
      // void sendEmail({ to: user.email, subject: "Reset password", text: `...${url}` });
    },
    // autoSignIn: true, // default — langsung login setelah signup
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
    },
  },
});
```

> `sendResetPassword` opsional — bisa di-skip dulu kalau belum ada email service. Tanpa ini, fitur lupa password tidak aktif tapi login/signup tetap jalan.

### `lib/env/index.ts` — Tidak ada perubahan

`BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` sudah ada.

---

## Client Components

### Form login — tambah Email/Password

Di halaman login, tambah form:

| Component | File |
|-----------|------|
| Email/Password sign in | `components/buttons.tsx` atau file baru `components/auth/email-password-form.tsx` |

### Perubahan di `components/buttons.tsx`

Tambah komponen baru:

- `EmailPasswordForm` — form dengan input email + password + submit
- Panggil `authClient.signIn.email({ email, password, callbackURL: "/home" })`
- Tampilkan error dari server (email not found, wrong password, dll)
- Link ke halaman sign up (atau toggle form)

Untuk sign up:

- Panggil `authClient.signUp.email({ name, email, password, callbackURL: "/home" })`

### Akun linking

Better Auth secara otomatis bisa link akun Google dan email/password ke user yang sama jika email-nya cocok. Tidak perlu koding manual.

---

## Routes

| URL | Method | Keterangan |
|-----|--------|------------|
| `/api/auth/*` | All | Already handled by Better Auth catch-all |

Tidak perlu route baru. Better Auth sudah handle endpoint:
- `POST /api/auth/email-password/sign-in`
- `POST /api/auth/email-password/sign-up`
- dll.

---

## Hooks

Tidak perlu hooks baru. Better Auth client sudah provide:
- `authClient.signIn.email()`
- `authClient.signUp.email()`
- `authClient.signOut()`
- `authClient.useSession()`

---

## Security

- Password di-hash dengan `scrypt` (default Better Auth) — OWASP recommended
- Better Auth handle rate limiting, CSRF protection secara default
- Tidak ada password yang dikirim ke client — semua via server action / API route
- Google OAuth tetap available sebagai alternatif

## Design Tokens

Form login mengikuti design system yang sudah ada:
- CSS variables tokens (`--primary`, `--muted`, dll.)
- Font Inter
- Spacing 8px grid
- Button variant outline/default

## Testing Checklist

- [ ] Sign up with email + password → sukses, langsung login, redirect ke `/home`
- [ ] Sign in with correct credentials → sukses
- [ ] Sign in with wrong password → error message
- [ ] Sign in with unregistered email → error message
- [ ] Google OAuth still works
- [ ] Sign out → redirect ke halaman login
- [ ] Form validation (empty fields, invalid email, short password)
- [ ] Loading state selama submit
