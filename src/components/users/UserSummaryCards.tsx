import {
  FiShield,
  FiTruck,
  FiUsers,
  FiUserCheck,
} from 'react-icons/fi'

import Card from '@/components/ui/Card'
import { formatNumber } from '@/utils/format'

import styles from './UserSummaryCards.module.css'

type UserSummaryCardsProps = {
  totalPengguna: number
  totalManajemen: number
  totalSales: number
  totalGudang: number
}

const UserSummaryCards = ({
  totalPengguna,
  totalManajemen,
  totalSales,
  totalGudang,
}: UserSummaryCardsProps) => {
  return (
    <section className={styles.grid}>
      <Card className={styles.card} elevated>
        <div className={styles.icon} aria-hidden="true">
          <FiUsers size={20} />
        </div>
        <div>
          <p className={styles.label}>Total Pengguna</p>
          <p className={styles.value}>{formatNumber(totalPengguna)}</p>
          <p className={styles.caption}>Akun aktif di seluruh cabang</p>
        </div>
      </Card>
      <Card className={styles.card} elevated>
        <div className={styles.iconHighlight} aria-hidden="true">
          <FiShield size={20} />
        </div>
        <div>
          <p className={styles.label}>Tim Manajemen</p>
          <p className={styles.value}>{formatNumber(totalManajemen)}</p>
          <p className={styles.caption}>Super admin & admin operasional</p>
        </div>
      </Card>
      <Card className={styles.card} elevated>
        <div className={styles.icon} aria-hidden="true">
          <FiUserCheck size={20} />
        </div>
        <div>
          <p className={styles.label}>Tim Penjualan</p>
          <p className={styles.value}>{formatNumber(totalSales)}</p>
          <p className={styles.caption}>Kasir dan staf frontline</p>
        </div>
      </Card>
      <Card className={styles.card} elevated>
        <div className={styles.iconWarning} aria-hidden="true">
          <FiTruck size={20} />
        </div>
        <div>
          <p className={styles.label}>Tim Gudang</p>
          <p className={styles.value}>{formatNumber(totalGudang)}</p>
          <p className={styles.caption}>Pengelola stok & distribusi</p>
        </div>
      </Card>
    </section>
  )
}

export default UserSummaryCards
