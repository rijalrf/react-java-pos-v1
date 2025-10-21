import { useMemo, useState } from 'react'

import { useConfirmDialog } from '@/components/feedback/ConfirmDialogProvider'
import OrderFilters, {
  type OrderFilterState,
} from '@/components/orders/OrderFilters'
import OrderItemsModal from '@/components/orders/OrderItemsModal'
import OrderSummaryCards from '@/components/orders/OrderSummaryCards'
import OrderTable from '@/components/orders/OrderTable'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { useOrders } from '@/features/orders/hooks/useOrders'
import type { Order } from '@/features/orders/types/order'

import styles from './SalesPage.module.css'

const PAGE_SIZE = 10

const initialFilters: OrderFilterState = {
  customerName: '',
  status: '',
  sort: 'orderDate,desc',
}

const SalesPage = () => {
  const [filters, setFilters] = useState<OrderFilterState>(initialFilters)
  const [page, setPage] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [itemsModalOpen, setItemsModalOpen] = useState(false)

  const query = useMemo(
    () => ({
      customerName: filters.customerName || undefined,
      status: filters.status || undefined,
      sort: filters.sort || undefined,
      page,
      size: PAGE_SIZE,
    }),
    [filters.customerName, filters.status, filters.sort, page],
  )

  const {
    orders,
    pagination,
    loading,
    error,
    ringkasan,
    updateOrderStatus,
    deleteOrder,
    refresh,
  } = useOrders(query)

  const { tampilkanKonfirmasi } = useConfirmDialog()

  const handleResetFilters = () => {
    setFilters({ ...initialFilters })
    setPage(0)
  }

  const handleFiltersChange = (nextFilters: OrderFilterState) => {
    setFilters(nextFilters)
    setPage(0)
  }

  const handleDeleteOrder = async (order: Order) => {
    const konfirmasi = await tampilkanKonfirmasi({
      title: 'Hapus Pesanan',
      deskripsi: `Anda akan menghapus pesanan #${order.id} atas nama ${order.customerName}. Tindakan ini tidak dapat dibatalkan.`,
      konfirmasiLabel: 'Ya, hapus',
      batalLabel: 'Batalkan',
    })
    if (konfirmasi) {
      await deleteOrder(order.id)
    }
  }

  const totalPages = Math.max(pagination.totalPages, 1)

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0 || nextPage >= totalPages) return
    setPage(nextPage)
  }

  const handleShowDetail = (order: Order) => {
    setSelectedOrder(order)
    setItemsModalOpen(true)
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.pageHeader}>
        <div>
          <h2>Manajemen Pesanan</h2>
          <p>
            Pantau dan kelola pesanan kasir secara real-time sesuai kontrak API Order.
            Sesuaikan status transaksi agar operasional tetap sinkron dengan backend.
          </p>
        </div>
      </header>

      <OrderSummaryCards
        totalPesanan={ringkasan.total}
        totalPendapatan={ringkasan.totalPendapatan}
        pending={ringkasan.pending}
        proses={ringkasan.proses}
        shipped={ringkasan.shipped}
        delivered={ringkasan.delivered}
        selesai={ringkasan.selesai}
        batal={ringkasan.batal}
      />

      <OrderFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
        onRefresh={() => void refresh()}
      />

      <div className={styles.dataSection}>
        {error && (
          <Card className={styles.alert}>
            <strong>Mode contoh:</strong> {error}. Sistem menampilkan data sesuai sampel
            dari spesifikasi API Order sampai backend siap.
          </Card>
        )}

        <OrderTable
          items={orders}
          loading={loading}
          totalItems={pagination.count}
          onDelete={(order) => void handleDeleteOrder(order)}
          onShowDetail={handleShowDetail}
        />
      </div>

      <div className={styles.paginationRow}>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <footer className={styles.pageFooter}>
        © {new Date().getFullYear()} Java POS. Dashboard pesanan modern berbasis React.
      </footer>

      <OrderItemsModal
        open={itemsModalOpen}
        order={selectedOrder}
        onClose={() => {
          setItemsModalOpen(false)
          setSelectedOrder(null)
        }}
        onUpdateStatus={async (orderId, status) => {
          await updateOrderStatus(orderId, status)
          setSelectedOrder((prev) =>
            prev && prev.id === orderId ? { ...prev, orderStatus: status } : prev,
          )
        }}
      />
    </div>
  )
}

export default SalesPage
