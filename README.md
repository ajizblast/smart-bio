# HotelKeren - Directory Creator

<p align="center">
  <a href="README.id.md"><strong>Bahasa Indonesia</strong></a>
</p>

---

A link-in-bio application for hotel recommendations built with Firebase. Available in two versions.

---

## Version 1: Vanilla JS (Standalone)

`index.html` — open directly in browser, no build required.

### Usage
1. Open `index.html` in a browser (double-click or drag to browser)
2. Login with Firebase email & password (click "Login" at the bottom)
3. Manage links, hotels, themes, and pages in the admin dashboard
4. See results in the live smartphone preview

---

## Version 2: React + TypeScript (Recommended)

`hotel-keren/` — rebuilt with React, Vite, Zustand, and Tailwind CSS.

### Setup

```bash
cd hotel-keren
npm install
```

### Development

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
```

Output in `dist/`.

### Deploy to Vercel / Netlify

Build folder: `dist`

---

## Features

| Feature | Description |
|---------|-------------|
| Profile | Avatar, name, bio, 6 social media links (IG, TikTok, Threads, FB, YT, WA) |
| Links | Add/edit/delete/reorder links, point to external URL or internal page |
| Hotel Database | CRUD hotels per city with rating, price, image, booking link |
| Custom Pages | Create hotel listing pages (city filter) or free-form text pages |
| Themes | 11 visual themes: solid light/dark, gradients, background images (forest, sea, desert, nebula, sakura) |
| Button Animations | bounce, pulse, wobble, shake, glow — per button |
| Live Preview | Real-time smartphone mockup in admin dashboard |
| Firebase Cloud | Sync data via Firestore with localStorage fallback |
| Data Migration | Upload local to cloud, or pull cloud to local |

---

## Project Structure (React)

```
hotel-keren/
  src/
    components/
      admin/       # AdminWorkspace, LoginModal, ProfileForm, LinkManager, HotelManager, ThemeSelector, etc.
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

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Sign-in method → **Email/Password**
3. Enable **Cloud Firestore**
4. Set Firestore Rules to **test mode** for development:

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

5. Data is stored at: `artifacts/{appId}/public/data/config/state`

### If blocked by AdBlocker

The app automatically falls back to localStorage if Firebase connections are blocked by extensions. Data persists in the browser even offline.

---

## Default Account

Initial data uses example profile "Aisha Claresta" with sample hotels in Jakarta and Bandung. All data can be modified through the admin dashboard.

---

## Editing Default Database

The initial seed data is stored in `src/data/masterDatabase.ts`. To change the default profile, hotels, links, pages, or theme:

1. Open `src/data/masterDatabase.ts`
2. Edit the `MASTER_JSON_DATABASE` object — all fields match the admin dashboard form fields
3. Save the file; the app will use these values on first load or when clicking "Reset to Defaults"

### Fields reference

| Section | Fields |
|---------|--------|
| `profile` | `name`, `bio`, `avatar` (URL), `socials` (`instagram`, `tiktok`, `threads`, `facebook`, `youtube`, `whatsapp`) |
| `theme` | One of: `solid-light`, `solid-dark`, `gradient-sunset`, `gradient-oceanic`, `gradient-cosmic`, `minimalist-border`, `theme-forest`, `theme-sea`, `theme-desert`, `theme-nebula`, `theme-sakura` |
| `links` | Array of `{ id, title, url, icon, animation, active }` |
| `hotels` | Array of `{ id, name, rating, location, price, image, badge, city, bookingUrl }` |
| `pages` | Array of `{ id, title, type, filterCity?, description?, customImg?, customText? }` |

---

## Environment Variables (.env)

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Firebase config (required for cloud sync)

Get these values from [Firebase Console](https://console.firebase.google.com) → Project Settings → General → Your apps → Web app:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `{projectId}.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `{projectId}.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Measurement ID (optional) |
| `VITE_APP_ID` | Custom app namespace (default: `hotel-keren-app-2026`) |

If `.env` is not set, the app falls back to hardcoded development values.

> **Note:** `.env` is in `.gitignore` and will NOT be committed. Always provide `.env.example` as a template.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS 3** (styling)
- **Zustand** (state management)
- **Firebase Auth + Firestore** (backend)
- **Lucide React** (icons)
- **Font Awesome 6** (legacy icons)
