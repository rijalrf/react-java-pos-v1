import { NavLink, useLocation } from 'react-router-dom'
import {
  FiBarChart2,
  FiBox,
  FiHome,
  FiSettings,
  FiTag,
  FiUsers,
} from 'react-icons/fi'

import styles from './Sidebar.module.css'

const menuItems = [
  { label: 'Ringkasan', icon: FiHome, to: '/' },
  { label: 'Produk', icon: FiBox, to: '/produk' },
  { label: 'Pengguna', icon: FiUsers, to: '/pengguna' },
  { label: 'Penjualan', icon: FiBarChart2, to: '/penjualan' },
  { label: 'Promo', icon: FiTag, to: '/promo' },
  { label: 'Pengaturan', icon: FiSettings, to: '/pengaturan' },
]

const Sidebar = () => {
  const location = useLocation()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>POS</span>
        <div>
          <p className={styles.brandTitle}>Java POS</p>
          <p className={styles.brandSubtitle}>Dashboard Modern</p>
        </div>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to)
          const linkClass = `${styles.link} ${
            isActive ? styles.linkAktif : ''
          }`
          return (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <span
                className={`${styles.indicator} ${
                  isActive ? styles.indicatorAktif : ''
                }`}
              />
              <span
                className={`${styles.content} ${
                  isActive ? styles.contentAktif : ''
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </span>
            </NavLink>
          )
        })}
      </nav>
      <div className={styles.footer}>
        <p className={styles.footerTitle}>Shift Saat Ini</p>
        <p className={styles.footerText}>Kasir: Siti Rahma</p>
        <p className={styles.footerText}>Cabang: Jakarta</p>
      </div>
    </aside>
  )
}

export default Sidebar
