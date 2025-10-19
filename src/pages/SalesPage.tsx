import Card from '@/components/ui/Card'

import styles from './SalesPage.module.css'

const SalesPage = () => {
  return (
    <div className={styles.wrapper}>
      <Card elevated>
        <h2>Ringkasan Penjualan</h2>
        <p>
          Modul penjualan akan menampilkan performa transaksi harian, mingguan,
          dan bulanan. Integrasikan dengan endpoint POS lainnya sesuai kebutuhan
          bisnis Anda.
        </p>
        <ul>
          <li>Monitoring transaksi kasir per shift</li>
          <li>Laporan omzet dan margin kotor</li>
          <li>Dukungan ekspor ke spreadsheet</li>
        </ul>
      </Card>
    </div>
  )
}

export default SalesPage
