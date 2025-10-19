# Catatan AGENT

## Konteks & Konfigurasi (Tetap Konsisten)
- Frontend menggunakan React + TypeScript via Vite, berjalan di port `3100` (lihat `vite.config.ts`).
- Base URL API default untuk komunikasi backend: `http://localhost:5100/api/v1` (`.env.example`). Pastikan `.env` nyata selaras ketika koneksi production.
- Semua teks UI wajib Bahasa Indonesia dengan gaya modern, tipografi utama `Plus Jakarta Sans`, warna primer biru (`--color-primary`).
- Sumber kebenaran untuk kontrak data produk berada pada backend `ApiProductSpec.md`.

## Struktur Folder & Feature
- Fitur produk berada di `src/features/products/` dengan struktur:
  - `hooks/useProducts.ts` – orkestrasi CRUD + fallback ketika API gagal.
  - `services/productService.ts` – pemanggilan API berbasis `apiClient`.
  - `types/product.ts` – definisi tipe response, payload, dan pagination.
- Komponen reusable berada di:
  - `src/components/ui/` (Button, Card, InputField, Badge, Pagination, TopBar utilities bila nanti dipisah).
  - `src/components/feedback/` (ToastProvider untuk notifikasi kanan atas, ConfirmDialogProvider untuk dialog konfirmasi global).
  - `src/components/layout/` dan `src/components/navigation/` untuk kerangka dashboard & sidebar.
- Halaman rute di `src/pages/` mengikuti struktur `/`, `/produk`, `/penjualan`, `/promo`, `/pengaturan`.
- Utilitas umum (format rupiah, angka) tersedia di `src/utils/format.ts`.

## Prinsip Implementasi & Continues Development
- Terapkan prinsip DRY: gunakan komponen & hooks yang ada sebelum membuat baru.
- Untuk notifikasi, selalu panggil `useToast().tampilkanToast`; posisi toast sudah tetap di pojok kanan atas.
- Pemeriksaan aksi destruktif harus melalui `useConfirmDialog().tampilkanKonfirmasi`.
- Ketika menambah fitur baru, simpan service, hooks, dan types dalam folder fitur masing-masing (`src/features/<fitur>/...`).
- Setelah setiap implementasi signifikan, jalankan `npm run build` untuk memastikan tidak ada error TypeScript/Vite.
- Saat sesi baru dimulai, rujuk dokumen ini terlebih dahulu sebelum mengubah struktur atau membuat komponen baru. Periksa keberadaan fungsi/komponen serupa agar tidak duplikasi.
- Gunakan pendekatan reuse lintas fitur: jika ada kebutuhan UI umum, pertimbangkan menempatkannya di `src/components/ui/` dan mendokumentasikannya di sini.

## Catatan Pengembangan
- `useProducts` akan mencoba API nyata terlebih dahulu. Jika backend gagal merespons, data contoh dari spesifikasi akan ditampilkan dan toast peringatan muncul sekali per sesi.
- Pagination daftar produk aktif dengan ukuran halaman tetap `10` item (`ProductsPage.tsx` + `Pagination` komponen). Navigasi halaman menggunakan data `pagination` dari API.
- Layout halaman produk tersusun berurutan: baris 1 judul & deskripsi (`pageHeader`), baris 2 filter + aksi (`ProductFilters` grid), baris 3 ringkasan kartu + tabel (`dataSection`), baris 4 pagination terpusat, baris 5 footer informasi.
- Sidebar memiliki posisi sticky dan scroll internal agar tetap terlihat ketika konten utama digulir.
- Sidebar & topbar sudah mendukung highlight aktif; pertahankan gaya warna linear-gradient pada sidebar.
- Form produk memvalidasi sesuai spesifikasi backend (nama ≥3 karakter, harga dan stok >0).

## Tindak Lanjut
- Dengan API backend telah aktif, validasikan seluruh alur CRUD produk langsung terhadap server dan perkuat penanganan error detail (mis. mapping `errors` field).
- Dokumentasikan perubahan besar berikutnya di sini untuk menjaga konsistensi UI, struktur, kode, dan praktik reuse komponen.
- Evaluasi berkala apakah komponen/utility baru dapat dipromosikan menjadi shared component agar menjaga prinsip DRY dalam pengembangan berkelanjutan.
