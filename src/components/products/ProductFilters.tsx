import { FiFilter, FiPlus } from 'react-icons/fi'

import Button from '@/components/ui/Button'
import InputField from '@/components/ui/InputField'

import styles from './ProductFilters.module.css'

export type ProductFilterState = {
  name: string
  sort: string
}

type ProductFiltersProps = {
  filters: ProductFilterState
  onChange: (filters: ProductFilterState) => void
  onCreate: () => void
}

const ProductFilters = ({ filters, onChange, onCreate }: ProductFiltersProps) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, name: event.target.value })
  }

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sort: event.target.value })
  }

  return (
    <div className={styles.wrapper}>
      <InputField
        placeholder="Cari berdasarkan nama produk"
        value={filters.name}
        onChange={handleNameChange}
        label="Cari Produk"
        className={styles.inputField}
      />
      <label className={styles.sortSelect}>
        <span>Urutkan</span>
        <select value={filters.sort} onChange={handleSortChange}>
          <option value="id,asc">Terbaru</option>
          <option value="name,asc">Nama A-Z</option>
          <option value="name,desc">Nama Z-A</option>
          <option value="price,asc">Harga Terendah</option>
          <option value="price,desc">Harga Tertinggi</option>
        </select>
      </label>
      <Button
        type="button"
        variant="secondary"
        leftIcon={<FiFilter />}
        onClick={() => onChange({ ...filters })}
      >
        Terapkan
      </Button>
      <Button
        type="button"
        variant="primary"
        leftIcon={<FiPlus />}
        onClick={onCreate}
      >
        Tambah Produk
      </Button>
    </div>
  )
}

export default ProductFilters
