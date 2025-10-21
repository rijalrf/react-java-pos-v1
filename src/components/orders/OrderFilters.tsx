import { FiFilter, FiRefreshCw, FiRotateCcw } from 'react-icons/fi'

import Button from '@/components/ui/Button'
import InputField from '@/components/ui/InputField'
import type { OrderStatus } from '@/features/orders/types/order'

import styles from './OrderFilters.module.css'

export type OrderFilterState = {
  customerName: string
  status: '' | OrderStatus
  sort: string
}

type OrderFiltersProps = {
  filters: OrderFilterState
  onChange: (filters: OrderFilterState) => void
  onReset: () => void
  onRefresh: () => void
}

const statusOptions: Array<{ value: '' | OrderStatus; label: string }> = [
  { value: '', label: 'Semua status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Diproses' },
  { value: 'SHIPPED', label: 'Dikirim' },
  { value: 'DELIVERED', label: 'Diterima' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELED', label: 'Dibatalkan' },
]

const OrderFilters = ({ filters, onChange, onReset, onRefresh }: OrderFiltersProps) => {
  const handleCustomerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, customerName: event.target.value })
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, status: event.target.value as '' | OrderStatus })
  }

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sort: event.target.value })
  }

  return (
    <div className={styles.wrapper}>
      <InputField
        placeholder="Cari nama pelanggan"
        value={filters.customerName}
        onChange={handleCustomerNameChange}
        label="Nama Pelanggan"
        className={styles.inputField}
      />

      <label className={styles.selectField}>
        <span>Status Pesanan</span>
        <select value={filters.status} onChange={handleStatusChange}>
          {statusOptions.map((option) => (
            <option key={option.value || 'ALL'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.selectField}>
        <span>Urutkan</span>
        <select value={filters.sort} onChange={handleSortChange}>
          <option value="orderDate,desc">Tanggal terbaru</option>
          <option value="orderDate,asc">Tanggal terlama</option>
          <option value="totalAmount,desc">Nominal tertinggi</option>
          <option value="totalAmount,asc">Nominal terendah</option>
          <option value="customerName,asc">Nama A-Z</option>
          <option value="customerName,desc">Nama Z-A</option>
        </select>
      </label>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          leftIcon={<FiRotateCcw size={16} />}
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          type="button"
          variant="ghost"
          leftIcon={<FiRefreshCw size={16} />}
          onClick={onRefresh}
        >
          Muat Ulang
        </Button>
        <Button
          type="button"
          variant="primary"
          leftIcon={<FiFilter size={16} />}
          onClick={() => onChange({ ...filters })}
        >
          Terapkan
        </Button>
      </div>
    </div>
  )
}

export default OrderFilters
