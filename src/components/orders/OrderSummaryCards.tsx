import { FiCheckCircle, FiClock, FiShoppingBag, FiTrendingUp } from 'react-icons/fi'

import Card from '@/components/ui/Card'
import { formatNumber, formatRupiah } from '@/utils/format'

import styles from './OrderSummaryCards.module.css'

type OrderSummaryCardsProps = {
  totalPesanan: number
  totalPendapatan: number
  pending: number
  proses: number
  shipped: number
  delivered: number
  selesai: number
  batal: number
}

const OrderSummaryCards = ({
  totalPesanan,
  totalPendapatan,
  pending,
  proses,
  shipped,
  delivered,
  selesai,
  batal,
}: OrderSummaryCardsProps) => {
  return (
    <section className={styles.grid}>
      <Card className={styles.card} elevated>
        <div className={styles.icon} aria-hidden="true">
          <FiShoppingBag size={20} />
        </div>
        <div>
          <p className={styles.label}>Total Pesanan</p>
          <p className={styles.value}>{formatNumber(totalPesanan)}</p>
          <p className={styles.caption}>Akumulasi seluruh transaksi</p>
        </div>
      </Card>
      <Card className={styles.card} elevated>
        <div className={styles.iconAccent} aria-hidden="true">
          <FiTrendingUp size={20} />
        </div>
        <div>
          <p className={styles.label}>Pendapatan Kotor</p>
          <p className={styles.value}>{formatRupiah(totalPendapatan)}</p>
          <p className={styles.caption}>Sebelum pajak dan diskon</p>
        </div>
      </Card>
      <Card className={styles.card} elevated>
        <div className={styles.iconWarning} aria-hidden="true">
          <FiClock size={20} />
        </div>
        <div>
          <p className={styles.label}>Sedang Diproses</p>
          <p className={styles.value}>
            {formatNumber(pending + proses)} pesanan
          </p>
          <p className={styles.caption}>
            Pending: {formatNumber(pending)} • Proses: {formatNumber(proses)}
          </p>
        </div>
      </Card>
      <Card className={styles.card} elevated>
        <div className={styles.iconSuccess} aria-hidden="true">
          <FiCheckCircle size={20} />
        </div>
        <div>
          <p className={styles.label}>Status Akhir</p>
          <p className={styles.value}>
            {formatNumber(selesai + batal)} pesanan
          </p>
          <p className={styles.caption}>
            Selesai: {formatNumber(selesai)} • Batal: {formatNumber(batal)}
          </p>
        </div>
      </Card>
      <Card className={styles.card} elevated>
        <div className={styles.iconShipping} aria-hidden="true">
          <FiTrendingUp size={20} />
        </div>
        <div>
          <p className={styles.label}>Dalam Pengiriman</p>
          <p className={styles.value}>
            {formatNumber(shipped + delivered)} pesanan
          </p>
          <p className={styles.caption}>
            Dikirim: {formatNumber(shipped)} • Diterima:{' '}
            {formatNumber(delivered)}
          </p>
        </div>
      </Card>
    </section>
  )
}

export default OrderSummaryCards
