import {
  FiChevronDown,
  FiChevronUp,
  FiMinus,
  FiEdit2,
  FiTrash2,
} from 'react-icons/fi'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { User } from '@/features/users/types/user'
import { formatNumber } from '@/utils/format'

import styles from './UserTable.module.css'

type SortField = 'id' | 'name' | 'email' | 'role'

type UserTableProps = {
  items: User[]
  loading: boolean
  totalItems: number
  sort: { field: SortField; direction: 'asc' | 'desc' }
  onSortChange: (field: SortField) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

const roleLabelMap: Record<User['role'], string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  SALES: 'Sales',
  GUDANG: 'Gudang',
}

const roleToneMap: Record<User['role'], 'default' | 'success' | 'warning' | 'danger'> =
  {
    SUPER_ADMIN: 'warning',
    ADMIN: 'success',
    SALES: 'default',
    GUDANG: 'default',
  }

const sortLabels: Record<SortField, string> = {
  id: 'ID',
  name: 'Nama',
  email: 'Email',
  role: 'Peran',
}

const SortIndicator = ({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) => {
  if (!active) {
    return <FiMinus size={14} aria-hidden="true" />
  }
  return direction === 'asc' ? (
    <FiChevronUp size={14} aria-hidden="true" />
  ) : (
    <FiChevronDown size={14} aria-hidden="true" />
  )
}

const UserTable = ({
  items,
  loading,
  totalItems,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: UserTableProps) => {
  return (
    <Card elevated className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h3>Daftar Pengguna</h3>
          <p>
            Data mengikuti kontrak API User. Gunakan daftar ini untuk memantau akses
            dan peran setiap anggota tim.
          </p>
        </div>
        <div className={styles.total}>
          Total {formatNumber(totalItems)} akun
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {(
                [
                  { field: 'id' as const },
                  { field: 'name' as const },
                  { field: 'email' as const },
                  { field: 'role' as const },
                ]
              ).map((column) => {
                const isActive = sort.field === column.field
                const ariaSort = isActive
                  ? sort.direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
                return (
                  <th key={column.field} aria-sort={ariaSort}>
                    <button
                      type="button"
                      className={`${styles.sortButton} ${isActive ? styles.sortActive : ''}`}
                      onClick={() => onSortChange(column.field)}
                    >
                      {sortLabels[column.field]}
                      <span className={styles.sortIndicator}>
                        <SortIndicator active={isActive} direction={sort.direction} />
                      </span>
                    </button>
                  </th>
                )
              })}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  Memuat data pengguna...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  Belum ada pengguna yang terdaftar. Tambahkan pengguna baru untuk memberikan akses.
                </td>
              </tr>
            )}
            {!loading &&
              items.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>
                    <div className={styles.userName}>{user.name}</div>
                  </td>
                  <td>
                    <div className={styles.userEmail}>{user.email}</div>
                  </td>
                  <td>
                    <Badge tone={roleToneMap[user.role]}>
                      {roleLabelMap[user.role]}
                    </Badge>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        leftIcon={<FiEdit2 size={16} />}
                        onClick={() => onEdit(user)}
                      >
                        Ubah
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        leftIcon={<FiTrash2 size={16} />}
                        onClick={() => onDelete(user)}
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

export default UserTable
