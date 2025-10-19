import Card from '@/components/ui/Card'

import styles from './PromoPage.module.css'

const PromoPage = () => {
  return (
    <div className={styles.wrapper}>
      <Card elevated>
        <h2>Kelola Promo</h2>
        <p>
          Rencanakan diskon dan bundling produk berdasarkan performa stok. Data
          produk diambil dari endpoint resmi <code>/api/v1/products</code> sesuai
          spesifikasi backend.
        </p>
        <p>
          Modul ini siap dikembangkan lebih lanjut dengan fitur jadwal promo,
          segmentasi pelanggan, dan sinkronisasi kanal omnichannel.
        </p>
      </Card>
    </div>
  )
}

export default PromoPage
