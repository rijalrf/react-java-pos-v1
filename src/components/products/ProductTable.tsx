import { FiEdit2, FiTrash2 } from 'react-icons/fi'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Product } from '@/features/products/types/product'
import { formatNumber, formatRupiah } from '@/utils/format'

import styles from './ProductTable.module.css'

type ProductTableProps = {
  items: Product[]
  loading: boolean
  totalItems: number
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

const ProductTable = ({
  items,
  loading,
  totalItems,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  const getBadgeTone = (stock: number) => {
    if (stock <= 0) return 'danger'
    if (stock < 20) return 'warning'
    return 'success'
  }

  return (
    <Card elevated className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h3>Ringkasan Produk</h3>
          <p>Data mengikuti struktur API resmi produk point of sale.</p>
        </div>
        <div className={styles.total}>Total {formatNumber(totalItems)} produk</div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Produk</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  Memuat data produk...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  Belum ada data produk. Tambahkan produk baru untuk mulai
                  berjualan.
                </td>
              </tr>
            )}
            {!loading &&
              items.map((product) => (
                <tr key={product.id}>
                  <td>#{product.id}</td>
                  <td>
                    <div className={styles.productName}>{product.name}</div>
                  </td>
                  <td>{formatRupiah(product.price)}</td>
                  <td>{formatNumber(product.stock)} unit</td>
                  <td>
                    <Badge tone={getBadgeTone(product.stock)}>
                      {product.stock <= 0
                        ? 'Habis'
                        : product.stock < 20
                          ? 'Menipis'
                          : 'Aman'}
                    </Badge>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        leftIcon={<FiEdit2 size={16} />}
                        onClick={() => onEdit(product)}
                      >
                        Ubah
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        leftIcon={<FiTrash2 size={16} />}
                        onClick={() => onDelete(product)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default ProductTable
