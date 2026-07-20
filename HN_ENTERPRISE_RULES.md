# HN Enterprise - Project Rules & Business Logic 💕

Dokumen ini mengandungi semua tetapan rasmi, logik perniagaan, dan spesifikasi projek **HN Enterprise Boutique & Inventory System**:

---

## 🔑 1. Admin Authentication & Keselamatan
- **Password Admin**: `Angel6038@` (Borang log masuk hanya memerlukan Kata Laluan, tiada ID).
- **Lokasi Login**: Ikon kunci kecil (`🔒`) tersembunyi di bahagian footer sebelah teks hak cipta.
- **Tajuk Modal Login**: `ADMIN SAHAJA!`.

## 📲 2. Maklumat Pemilik & Hubungi
- **Pemilik / Contact**: Ika (`0146434889`)
- **Pautan WhatsApp**: `https://wa.me/60146434889`
- **Hak Cipta Footer**: `HN Enterprise all right reserved 2026 💕`

## 🧭 3. Struktur Navigasi Admin (3 Seksyen Teras)
1. **Overview**: Dashboard amaran stok & senarai pesanan pelanggan yang memerlukan pengesahan admin (`Sahkan Pembelian ✅` / `Batal ❌`).
2. **Pengurusan Stok**: Kemasukan/Suntingan stok produk, muat naik gambar (*Single Upload Button*), kategori tulis manual, pilihan saiz berbilang (`S, M, L, XL, XXL, FREE SIZE`), variasi warna dipisahkan koma (`HITAM, MERAH, COKLAT`), dan harga diskaun (RM).
3. **Kewangan**: Rekod lengkap Jualan & Pembelian Stok (*Stock In*), tapisan jenis transaksi, dan pemadaman rekod transaksi.

## 🛍️ 4. Logik Pesanan & Stok
- **Pesanan Pelanggan (Storefront)**: Bermula dengan status `PENDING_APPROVAL` dan pesanan dihantar terus ke WhatsApp Ika (`0146434889`).
- **Pengesahan Admin**: Apabila admin menekan `Sahkan Pembelian ✅`, barulah stok ditolak dan jualan direkod dalam Kewangan.
- **Pemulihan Stok Automatik**: Pembatalan pesanan atau pemadaman transaksi jualan menolak/menambah kembali stok secara automatik ke dalam inventori.
- **Kunci LocalStorage**: `hne_stock_products_v1` & `hne_stock_transactions_v1`.
