import { FiInfo, FiTrash2 } from 'react-icons/fi'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Order, OrderStatus } from '@/features/orders/types/order'
import { formatNumber, formatRupiah } from '@/utils/format'

import styles from './OrderTable.module.css'

type OrderTableProps = {
  items: Order[]
  loading: boolean
  totalItems: number
  onDelete: (order: Order) => void
  onShowDetail: (order: Order) => void
}

const statusLabel: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Diterima',
  COMPLETED: 'Selesai',
  CANCELED: 'Dibatalkan',
}

const statusTone: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  PENDING: 'default',
  PROCESSING: 'warning',
  SHIPPED: 'warning',
  DELIVERED: 'success',
  COMPLETED: 'success',
  CANCELED: 'danger',
}

const formatTanggal = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const OrderTable = ({
  items,
  loading,
  totalItems,
  onDelete,
  onShowDetail,
}: OrderTableProps) => {
  return (
    <Card elevated className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h3>Daftar Pesanan</h3>
          <p>Kendalikan status transaksi sesuai data API Order backend.</p>
        </div>
        <div className={styles.total}>Total {formatNumber(totalItems)} pesanan</div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Pelanggan</th>
              <th>Alamat</th>
              <th>Tanggal</th>
              <th>Total</th>
              <th>Status</th>
              <th>Item</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  Memuat data pesanan...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  Belum ada data pesanan. Tambahkan pesanan baru melalui aplikasi kasir.
                </td>
              </tr>
            )}
            {!loading &&
              items.map((order) => (
                <tr key={order.id}>
                  <td className={styles.cellStrong}>#{order.id}</td>
                  <td className={styles.cellStrong}>{order.customerName}</td>
                  <td>
                    <span className={styles.address} title={order.customerAddress}>
                      {order.customerAddress}
                    </span>
                  </td>
                  <td>{formatTanggal(order.orderDate)}</td>
                  <td>{formatRupiah(order.totalAmount)}</td>
                  <td>
                    <Badge tone={statusTone[order.orderStatus]}>
                      {statusLabel[order.orderStatus] ?? order.orderStatus}
                    </Badge>
                  </td>
                  <td>{formatNumber(order.items.length)} item</td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        leftIcon={<FiInfo size={16} />}
                        onClick={() => onShowDetail(order)}
                      >
                        Detail
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        leftIcon={<FiTrash2 size={16} />}
                        onClick={() => onDelete(order)}
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

export default OrderTable
