<h1 align="center" >
    SEA Catering - Aplikasi Pesan Antar Makanan Sehat
</h1>

<p align="center">
  Aplikasi web full-stack modern untuk layanan pesan antar makanan sehat yang dapat dikustomisasi, dibangun dengan Next.js, Prisma, NextAuth, dan Tailwind CSS.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Typescript-3178C6?logo=TypeScript&style=for-the-badge&logoColor=white" alt="Typescript">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

---

## Tentang Proyek

**SEA Catering** adalah solusi modern untuk tantangan makan sehat di tengah kesibukan. Aplikasi ini memungkinkan pengguna untuk berlangganan paket makanan sehat yang dapat disesuaikan sepenuhnya, diantar langsung ke lokasi mereka di seluruh Indonesia. Proyek ini dibangun sebagai submission untuk *technical challenge*, mencakup semua aspek pengembangan aplikasi web modern, mulai dari UI/UX, sistem langganan, autentikasi aman, hingga dashboard analitik untuk admin.

## Fitur Utama

Proyek ini mencakup semua fungsionalitas yang diminta dalam 5 level tantangan:

* **Level 1: Homepage Profesional:** Landing page yang menarik dengan informasi bisnis dan layanan utama.
* **Level 2: Interaktivitas Penuh:**
    * Navigasi yang responsif dengan penanda halaman aktif.
    * Tampilan meal plan dengan modal detail yang informatif.
    * Seksi testimoni dengan slider dan form submit yang terhubung ke database.
* **Level 3: Sistem Langganan & Database:**
    * Formulir langganan yang kompleks dengan validasi real-time dan kalkulasi harga otomatis.
    * Integrasi penuh dengan database PostgreSQL menggunakan **Prisma ORM**.
    * Fungsionalitas *seeding* untuk data awal.
* **Level 4: Keamanan Aplikasi (Secure by Design):**
    * Sistem autentikasi (Registrasi, Login, Logout) menggunakan **NextAuth.js**.
    * Password di-hash menggunakan `bcrypt`.
    * Rute halaman dilindungi dengan **Next.js Middleware** (Otorisasi).
    * Role-based access control (User & Admin).
    * Aman dari serangan umum seperti **SQL Injection** (via Prisma) dan **XSS** (via React).
* **Level 5: User & Admin Dashboard:**
    * **User Dashboard:** Pengguna dapat melihat, menjeda, mengaktifkan kembali, dan membatalkan langganan mereka.
    * **Admin Dashboard:** Admin dapat memonitor metrik bisnis kunci (MRR, Langganan Baru, dll), memfilter data berdasarkan rentang tanggal, dan melihat visualisasi data dengan grafik.

## Tech Stack

Daftar teknologi, library, dan tools yang digunakan dalam proyek ini.

| Kategori              | Teknologi                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **Framework Utama** | [Next.js](https://nextjs.org/), [React](https://reactjs.org/)                                  |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/)                                                  |
| **Backend & Akses Data** | [Prisma](https://www.prisma.io/), [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))              |
| **Autentikasi** | [NextAuth.js (Auth.js)](https://authjs.dev/)                                                   |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)                   |
| **Manajemen Form** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)                         |
| **Visualisasi Data** | [Recharts](https://recharts.org/), [React Day Picker](https://react-day-picker.js.org/)         |
| **Deployment** | [Docker](https://www.docker.com/), [Vercel](https://vercel.com/)                                |

## Memulai Proyek (Getting Started)

Ikuti langkah-langkah ini untuk menjalankan proyek secara lokal.

### **Prasyarat**

* [Node.js](https://nodejs.org/) (v18 atau lebih baru)
* `npm` atau package manager lain (`pnpm`, `yarn`)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Opsional, untuk menjalankan via Docker)

### **1. Instalasi Lokal**

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/Faruuuqqq/sea-catering.git
    ```

2.  **Install semua dependensi:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    * Buat file bernama `.env` di folder root proyek.
    * Dapatkan **Connection String** dari proyek Supabase Anda.
    * Generate `AUTH_SECRET` dengan perintah `openssl rand -base64 32`.
    * Isi file `.env` dengan format berikut:
        ```env
        DATABASE_URL="postgres://[db-user].[project-ref]:[db-password]@aws-0-[aws-region].pooler.supabase.com:6543/[db-name]?pgbouncer=true"
        DIRECT_URL="postgres://[db-user].[project-ref]:[db-password]@aws-0-[aws-region].pooler.supabase.com:6543/[db-name]"
        AUTH_SECRET="SECRET_YANG_SUDAH_DI_GENERATE"
        ```

4.  **Setup Database:**
    * Jalankan migrasi untuk membuat semua tabel di database Supabase-mu.
        ```bash
        npm run db:migrate
        ```
    * Isi database dengan data awal (meal plans).
        ```bash
        npm run db:seed
        ```

5.  **Jalankan Development Server:**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### **2. Menjalankan dengan Docker (Opsional)**

1.  Pastikan Docker Desktop sudah berjalan.
2.  **Build Docker image:**
    ```bash
    docker build -t sea-catering-app .
    ```
3.  **Jalankan Docker container:**
    * Pastikan kamu membuat file `.env` seperti pada langkah instalasi lokal.
    * Jalankan perintah ini untuk me-mount file `.env` ke dalam container.
    ```bash
    docker run --env-file .env -p 3000:3000 sea-catering-app
    ```
    Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

## Struktur Folder Proyek

Proyek ini menggunakan arsitektur yang bersih dan *scalable* untuk memisahkan setiap urusan.

```
/src
├── /app/                 # Routing & Halaman
├── /components/          # Komponen React yang bisa dipakai ulang
│   ├── /ui/              # Komponen kecil (Button, Card, dll.)
│   ├── /layout/          # Komponen layout (Navbar, Footer)
│   ├── /auth/            # Form Login & Registrasi
│   ├── /views/           # Komponen besar pembungkus halaman
│   └── /sections/        # Komponen seksi untuk homepage
└── /lib/                 # Logika, Utilitas, & Akses Data
    ├── /actions/         # Semua Server Actions
    └── ...
```

---
Dibuat dengan semangat dan kopi untuk tantangan Compfest! ☕
