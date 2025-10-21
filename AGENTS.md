# Catatan AGENT

## Konteks & Konfigurasi (Tetap Konsisten)
- Frontend menggunakan React + TypeScript via Vite, berjalan di port `3100` (lihat `vite.config.ts`).
- Base URL API default untuk komunikasi backend: `http://localhost:5100/api/v1` (`.env.example`). Pastikan `.env` nyata selaras ketika koneksi production.
- Semua teks UI wajib Bahasa Indonesia dengan gaya modern, tipografi utama `Plus Jakarta Sans`, warna primer biru (`--color-primary`).
- Sumber kebenaran untuk kontrak data produk berada pada backend `ApiProductSpec.md`; kontrak data pengguna berada pada `ApiUserSpec.md`.

## Struktur Folder & Feature
- Fitur produk berada di `src/features/products/` dengan struktur:
  - `hooks/useProducts.ts` – orkestrasi CRUD + fallback ketika API gagal.
  - `services/productService.ts` – pemanggilan API berbasis `apiClient`.
  - `types/product.ts` – definisi tipe response, payload, dan pagination.
- Fitur pengguna berada di `src/features/users/` dengan struktur:
  - `hooks/useUsers.ts` – mengelola CRUD, fallback data dari spesifikasi, serta ringkasan peran.
  - `services/userService.ts` – wrapper API `/users` dengan dukungan query `name`, `page`, `size`, `sort`.
  - `types/user.ts` – tipe response, payload, dan enumerasi role (ADMIN, SUPER_ADMIN, SALES, GUDANG).
- Komponen reusable berada di:
  - `src/components/ui/` (Button, Card, InputField, Badge, Pagination, TopBar utilities bila nanti dipisah).
  - `src/components/feedback/` (ToastProvider untuk notifikasi kanan atas, ConfirmDialogProvider untuk dialog konfirmasi global).
  - `src/components/layout/` dan `src/components/navigation/` untuk kerangka dashboard & sidebar.
- Halaman rute di `src/pages/` mengikuti struktur `/`, `/produk`, `/pengguna`, `/penjualan`, `/promo`, `/pengaturan`.
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
- `useUsers` menerapkan pola sama: panggil API, fallback ke data spesifikasi (dengan filter & sorting lokal), serta memunculkan toast peringatan sekali per sesi.
- Pagination daftar produk aktif dengan ukuran halaman tetap `10` item (`ProductsPage.tsx` + `Pagination` komponen). Navigasi halaman menggunakan data `pagination` dari API.
- Pagination daftar pengguna mengikuti `useUsers`, ukuran halaman tetap `10`, mendukung query `name` dan `sort` (kolom tabel dapat diklik).
- Modul pesanan (`SalesPage`) menampilkan ringkasan, tabel, dan modal detail berbasis `orderStatus`. Tabel hanya memuat kolom utama (ID, nama, alamat, tanggal, total, status, jumlah item) dengan aksi sejajar. Detail lengkap (termasuk email, nomor HP, kode pesanan, dan aksi perubahan status bertahap) tersedia di modal dan menampilkan item dalam bentuk tabel.
- Layout halaman produk tersusun berurutan: baris 1 judul & deskripsi (`pageHeader`), baris 2 filter + aksi (`ProductFilters` grid), baris 3 ringkasan kartu + tabel (`dataSection`), baris 4 pagination terpusat, baris 5 footer informasi.
- Sidebar memiliki posisi sticky dan scroll internal agar tetap terlihat ketika konten utama digulir.
- Sidebar & topbar sudah mendukung highlight aktif; pertahankan gaya warna linear-gradient pada sidebar.
- Form produk memvalidasi sesuai spesifikasi backend (nama ≥3 karakter, harga dan stok >0).

## Tindak Lanjut
- Dengan API backend telah aktif, validasikan seluruh alur CRUD produk langsung terhadap server dan perkuat penanganan error detail (mis. mapping `errors` field).
- Sinkronkan dan uji transisi `orderStatus` baru (PENDING → PROCESSING → SHIPPED → DELIVERED → COMPLETED) terhadap backend agar tombol bertahap di modal pesanan tetap valid. Pastikan payload menggunakan field `orderStatus`.
- Dokumentasikan perubahan besar berikutnya di sini untuk menjaga konsistensi UI, struktur, kode, dan praktik reuse komponen. Tambahkan catatan ketika fitur baru dipromosikan ke shared component.
- Evaluasi berkala apakah komponen/utility baru dapat dipromosikan menjadi shared component agar menjaga prinsip DRY dalam pengembangan berkelanjutan.
- Setiap kali sesi baru menghadirkan perubahan fitur atau kebutuhan konteks tambahan, segera perbarui dokumen ini agar permintaan berikutnya memiliki referensi terkini.
