# HotelKeren - Directory Creator

Aplikasi link-in-bio untuk rekomendasi hotel berbasis Firebase. Tersedia dalam dua versi.

---

## Versi 1: Vanilla JS (Standalone)

`index.html` — buka langsung di browser, tidak perlu build.

### Cara pakai
1. Buka `index.html` di browser (double-click atau drag ke browser)
2. Login dengan email & password Firebase (klik "Login" di bawah layar)
3. Kelola tautan, hotel, tema, dan halaman di dashboard admin
4. Lihat hasil di live preview smartphone

---

## Versi 2: React + TypeScript (Recommended)

`hotel-keren/` — aplikasi rebuild dengan React, Vite, Zustand, dan Tailwind CSS.

### Persiapan

```bash
cd hotel-keren
npm install
```

### Development

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

### Build production

```bash
npm run build
```

Hasil build ada di `dist/`.

### Deploy ke Vercel / Netlify

Build folder: `dist`

---

## Fitur

| Fitur | Keterangan |
|-------|------------|
| Profil | Avatar, nama, bio, 6 link sosial media (Instagram, TikTok, Threads, FB, YT, WA) |
| Tautan | Tambah/edit/hapus/urutkan link, arahkan ke URL luar atau halaman internal |
| Database Hotel | CRUD hotel per kota dengan rating, harga, gambar, link booking |
| Halaman Kustom | Buat halaman daftar hotel (filter kota) atau halaman teks bebas |
| Tema | 11 tema visual: solid light/dark, gradient, gambar background (hutan, laut, gurun, nebula, sakura) |
| Animasi Tombol | bounce, pulse, wobble, shake, glow — per tombol |
| Preview Langsung | Mockup smartphone real-time di dashboard admin |
| Firebase Cloud | Sync data via Firestore dengan fallback localStorage |
| Migrasi Data | Upload lokal ke cloud, atau tarik cloud ke lokal |

---

## Struktur Proyek (React)

```
hotel-keren/
  src/
    components/
      admin/       # AdminWorkspace, LoginModal, ProfileForm, LinkManager, HotelManager, ThemeSelector, dll
      public/      # PublicLanding, HotelDirectoryPage, CustomArticlePage
      ui/          # Toast, ConfirmModal, SocialIcons, LinkButton
    data/          # MASTER_JSON_DATABASE (default state)
    hooks/         # useCloudDatabase, useAdminAuth
    services/      # firebase.ts (singleton)
    store/         # Zustand store
    types/         # TypeScript interfaces
    utils/         # themeStyles.ts
```

---

## Firebase Setup

1. Buat project di [Firebase Console](https://console.firebase.google.com)
2. Aktifkan **Authentication** → Sign-in method → **Email/Password**
3. Aktifkan **Cloud Firestore**
4. Atur Rules Firestore ke **test mode** untuk development:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Data disimpan di path: `artifacts/{appId}/public/data/config/state`

### Jika terkendala AdBlocker

Aplikasi otomatis fallback ke localStorage jika koneksi Firebase diblokir ekstensi. Data tetap tersimpan di browser meski offline.

---

## Akun Default

Data awal menggunakan profil contoh "Aisha Claresta" dengan hotel contoh di Jakarta dan Bandung. Semua data dapat diubah melalui dashboard admin.

---

## Mengedit Database Default

Data awal (seed) disimpan di `src/data/masterDatabase.ts`. Untuk mengubah default profil, hotel, link, halaman, atau tema:

1. Buka `src/data/masterDatabase.ts`
2. Edit objek `MASTER_JSON_DATABASE` — semua field sesuai dengan form di dashboard admin
3. Simpan file; data baru akan dipakai saat pertama load atau saat klik "Reset to Defaults"

### Referensi field

| Bagian | Field |
|--------|-------|
| `profile` | `name`, `bio`, `avatar` (URL), `socials` (`instagram`, `tiktok`, `threads`, `facebook`, `youtube`, `whatsapp`) |
| `theme` | Salah satu: `solid-light`, `solid-dark`, `gradient-sunset`, `gradient-oceanic`, `gradient-cosmic`, `minimalist-border`, `theme-forest`, `theme-sea`, `theme-desert`, `theme-nebula`, `theme-sakura` |
| `links` | Array dari `{ id, title, url, icon, animation, active }` |
| `hotels` | Array dari `{ id, name, rating, location, price, image, badge, city, bookingUrl }` |
| `pages` | Array dari `{ id, title, type, filterCity?, description?, customImg?, customText? }` |

---

## Pengisian Environment Variables (.env)

Salin `.env.example` ke `.env` lalu isi nilai Anda:

```bash
cp .env.example .env
```

### Konfigurasi Firebase (wajib untuk cloud sync)

Ambil nilai berikut dari [Firebase Console](https://console.firebase.google.com) → Project Settings → General → Your apps → Web app:

| Variable | Keterangan |
|----------|------------|
| `VITE_FIREBASE_API_KEY` | Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `{projectId}.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ID project Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | `{projectId}.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Measurement ID (opsional) |
| `VITE_APP_ID` | Namespace aplikasi (default: `hotel-keren-app-2026`) |

Jika `.env` tidak diisi, aplikasi akan menggunakan nilai development yang sudah ada di kode.

> **Catatan:** `.env` sudah masuk `.gitignore` sehingga TIDAK akan ter-commit. Selalu sediakan `.env.example` sebagai template.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS 3** (styling)
- **Zustand** (state management)
- **Firebase Auth + Firestore** (backend)
- **Lucide React** (icons)
- **Font Awesome 6** (icons legacy)
