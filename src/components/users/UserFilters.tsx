import { FiRotateCcw, FiUserPlus } from 'react-icons/fi'

import Button from '@/components/ui/Button'
import InputField from '@/components/ui/InputField'

import styles from './UserFilters.module.css'

export type UserFilterState = {
  name: string
}

type UserFiltersProps = {
  filters: UserFilterState
  onChange: (filters: UserFilterState) => void
  onCreate: () => void
}

const UserFilters = ({ filters, onChange, onCreate }: UserFiltersProps) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, name: event.target.value })
  }

  const handleReset = () => {
    onChange({ name: '' })
  }

  return (
    <div className={styles.wrapper}>
      <InputField
        placeholder="Cari nama atau email pengguna"
        value={filters.name}
        onChange={handleNameChange}
        label="Cari Pengguna"
        className={styles.inputField}
      />
      <Button
        type="button"
        variant="secondary"
        leftIcon={<FiRotateCcw />}
        onClick={handleReset}
      >
        Reset Filter
      </Button>
      <Button
        type="button"
        variant="primary"
        leftIcon={<FiUserPlus />}
        onClick={onCreate}
      >
        Tambah Pengguna
      </Button>
    </div>
  )
}

export default UserFilters
