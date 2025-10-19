import { FiBox, FiLayers, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

import Card from '@/components/ui/Card'
import { formatNumber, formatRupiah } from '@/utils/format'

import styles from './ProductSummaryCards.module.css'

type ProductSummaryCardsProps = {
  totalProduk: number
  totalStok: number
  totalNilai: number
  stokMenipis: number
}

const ProductSummaryCards = ({
  totalProduk,
  totalStok,
  totalNilai,
  stokMenipis,
}: ProductSummaryCardsProps) => {
  return (
    <section className={styles.grid}>
      <Card className={styles.card} elevated>
        <div className={styles.icon} aria-hidden="true">
          <FiBox size={20} />
        </div>
        <div>
          <p className={styles.label}>Total Produk</p>
          <p className={styles.value}>{formatNumber(totalProduk)}</p>
          <p className={styles.caption}>Produk aktif terdaftar</p>
        </div>
      </Card>
      <Card className={styles.card} elevated>
        <div className={styles.icon} aria-hidden="true">
          <FiLayers size={20} />
        </div>
        <div>
          <p className={styles.label}>Total Stok</p>
          <p className={styles.value}>{formatNumber(totalStok)} unit</p>
          <p className={styles.caption}>Akumulasi stok gudang</p>
        </div>
      </Card>
      <Card className={styles.card} elevated>
        <div className={styles.icon} aria-hidden="true">
          <FiTrendingUp size={20} />
        </div>
        <div>
          <p className={styles.label}>Nilai Persediaan</p>
          <p className={styles.value}>{formatRupiah(totalNilai)}</p>
          <p className={styles.caption}>Estimasi nilai jual stok</p>
        </div>
      </Card>
      <Card className={styles.card} elevated>
        <div className={styles.iconWarning} aria-hidden="true">
          <FiTrendingDown size={20} />
        </div>
        <div>
          <p className={styles.label}>Stok Menipis</p>
          <p className={styles.value}>{formatNumber(stokMenipis)} item</p>
          <p className={styles.caption}>Perlu restok segera</p>
        </div>
      </Card>
    </section>
  )
}

export default ProductSummaryCards
