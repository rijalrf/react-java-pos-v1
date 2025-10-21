import { useState, type ReactNode } from 'react'
import { FiX } from 'react-icons/fi'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { Order, OrderStatus } from '@/features/orders/types/order'
import { formatNumber, formatRupiah } from '@/utils/format'

import styles from './OrderItemsModal.module.css'

type OrderItemsModalProps = {
  open: boolean
  order: Order | null
  onClose: () => void
  onUpdateStatus: (orderId: number, status: OrderStatus) => Promise<void> | void
}

const getOrderCode = (orderNumber: string) => {
  const trimmed = orderNumber.trim()
  if (trimmed.length <= 4) {
    return trimmed.toUpperCase()
  }
  return trimmed.slice(trimmed.length - 4).toUpperCase()
}

const statusLabel: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Diterima',
  COMPLETED: 'Selesai',
  CANCELED: 'Dibatalkan',
}

const statusTone: Record<OrderStatus, 'default' | 'warning' | 'success' | 'danger'> = {
  PENDING: 'default',
  PROCESSING: 'warning',
  SHIPPED: 'warning',
  DELIVERED: 'success',
  COMPLETED: 'success',
  CANCELED: 'danger',
}

const statusActions: Record<OrderStatus, Array<{ label: string; status: OrderStatus }>> = {
  PENDING: [
    { label: 'Mulai Proses', status: 'PROCESSING' },
    { label: 'Batalkan Pesanan', status: 'CANCELED' },
  ],
  PROCESSING: [{ label: 'Tandai Dikirim', status: 'SHIPPED' }],
  SHIPPED: [{ label: 'Tandai Diterima', status: 'DELIVERED' }],
  DELIVERED: [{ label: 'Selesaikan Pesanan', status: 'COMPLETED' }],
  COMPLETED: [],
  CANCELED: [],
}

const formatTanggal = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const OrderItemsModal = ({
  open,
  order,
  onClose,
  onUpdateStatus,
}: OrderItemsModalProps) => {
  if (!open || !order) {
    return null
  }

  const [statusLoading, setStatusLoading] = useState<OrderStatus | null>(null)

  const availableActions = statusActions[order.orderStatus] ?? []

  const detailRows: Array<{ label: string; value: ReactNode }> = [
    { label: 'Kode Pesanan', value: order.orderNumber },
    { label: 'Nama Pelanggan', value: order.customerName },
    { label: 'Email', value: order.customerEmail },
    { label: 'Nomor HP', value: order.customerPhone },
    { label: 'Alamat', value: order.customerAddress },
    { label: 'Tanggal Pesanan', value: formatTanggal(order.orderDate) },
    {
      label: 'Total Pesanan',
      value: formatRupiah(order.totalAmount),
    },
    {
      label: 'Status',
      value: (
        <Badge tone={statusTone[order.orderStatus]}>
          {statusLabel[order.orderStatus]}
        </Badge>
      ),
    },
  ]

  const handleStatusAction = async (nextStatus: OrderStatus) => {
    try {
      setStatusLoading(nextStatus)
      await onUpdateStatus(order.id, nextStatus)
    } finally {
      setStatusLoading(null)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <div>
            <h2>Detail Item Pesanan</h2>
            <p>
              Pesanan #{order.id} • Kode {getOrderCode(order.orderNumber)}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Tutup detail item"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </header>

        <section className={styles.detailsSection}>
          <div className={styles.detailGrid}>
            {detailRows.map((row) => (
              <div key={row.label} className={styles.detailItem}>
                <span className={styles.detailLabel}>{row.label}</span>
                <span className={styles.detailValue}>{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.itemsSection}>
          {order.items.length === 0 ? (
            <div className={styles.emptyState}>Pesanan ini belum memiliki item.</div>
          ) : (
            <div className={styles.itemsTableWrapper}>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Qty</th>
                    <th>Harga</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={`${item.product.id}-${item.product.name}`}>
                      <td className={styles.productCell}>
                        <span className={styles.productName}>{item.product.name}</span>
                        <span className={styles.productMeta}>ID #{item.product.id}</span>
                      </td>
                      <td>{formatNumber(item.quantity)}</td>
                      <td>{formatRupiah(item.price)}</td>
                      <td>{formatRupiah(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerActions}>
            {availableActions.length > 0 ? (
              availableActions.map((action) => (
                <Button
                  key={action.status}
                  type="button"
                  variant="primary"
                  disabled={statusLoading === action.status}
                  onClick={() => void handleStatusAction(action.status)}
                >
                  {statusLoading === action.status ? 'Memproses...' : action.label}
                </Button>
              ))
            ) : (
              <p className={styles.statusNote}>Tidak ada tindakan lanjutan untuk status ini.</p>
            )}
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            Tutup
          </Button>
        </footer>
      </div>
    </div>
  )
}

export default OrderItemsModal
