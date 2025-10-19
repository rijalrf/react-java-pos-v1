import { FiBell, FiChevronDown, FiSearch } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'

import styles from './TopBar.module.css'

const judulHalaman: Record<string, string> = {
  '/': 'Ringkasan Harian',
  '/produk': 'Manajemen Produk',
  '/penjualan': 'Ringkasan Penjualan',
  '/promo': 'Kelola Promo',
  '/pengaturan': 'Pengaturan Sistem',
}

const TopBar = () => {
  const location = useLocation()
  const title = judulHalaman[location.pathname] ?? 'Dashboard'

  return (
    <header className={styles.topbar}>
      <div>
        <p className={styles.subtitle}>Selamat datang kembali 👋</p>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <FiSearch size={18} />
          <input
            type="search"
            placeholder="Cari produk, transaksi, atau pelanggan"
            aria-label="Pencarian dashboard"
          />
        </div>
        <button className={styles.iconButton} type="button" aria-label="Notifikasi">
          <FiBell size={18} />
        </button>
        <button className={styles.profile} type="button">
          <div className={styles.avatar}>AR</div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Ari Rahman</span>
            <span className={styles.profileRole}>Supervisor</span>
          </div>
          <FiChevronDown size={16} />
        </button>
      </div>
    </header>
  )
}

export default TopBar
