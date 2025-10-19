import { FiArrowUpRight, FiCalendar, FiPackage } from 'react-icons/fi'

import Card from '@/components/ui/Card'
import { formatRupiah } from '@/utils/format'

import styles from './DashboardPage.module.css'

const DashboardPage = () => {
  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div>
          <h2>Dashboard Penjualan Modern</h2>
          <p>
            Pantau performa POS, stok produk, serta aktivitas harian tim secara
            terpusat dengan antarmuka bersih dan responsif.
          </p>
        </div>
        <Card className={styles.highlight} elevated>
          <div className={styles.highlightHeader}>
            <span className={styles.badge}>Hari Ini</span>
            <FiArrowUpRight size={18} />
          </div>
          <h3>{formatRupiah(12000000)}</h3>
          <p>Pencapaian omzet sementara sampai pukul 15.00 WIB.</p>
        </Card>
      </section>

      <section className={styles.cards}>
        <Card elevated>
          <div className={styles.cardIcon}>
            <FiCalendar size={22} />
          </div>
          <h3>Shift Berjalan</h3>
          <p>Shift sore - Supervisor: Ari Rahman</p>
          <ul>
            <li>Kasir aktif: 4 orang</li>
            <li>Transaksi berhasil: 87</li>
            <li>Transaksi pending: 3</li>
          </ul>
        </Card>
        <Card elevated>
          <div className={styles.cardIcon}>
            <FiPackage size={22} />
          </div>
          <h3>Monitor Produk</h3>
          <p>
            Integrasi penuh dengan API Product spesifikasi resmi `ApiProductSpec.md`.
          </p>
          <ul>
            <li>End-point utama: <code>GET /api/v1/products</code></li>
            <li>Pencarian berdasarkan nama</li>
            <li>Pagination &amp; sorting tersedia</li>
          </ul>
        </Card>
      </section>
    </div>
  )
}

export default DashboardPage
