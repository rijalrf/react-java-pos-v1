import { useMemo, useState } from 'react'

import { useConfirmDialog } from '@/components/feedback/ConfirmDialogProvider'
import UserFilters, {
  type UserFilterState,
} from '@/components/users/UserFilters'
import UserFormModal from '@/components/users/UserFormModal'
import UserSummaryCards from '@/components/users/UserSummaryCards'
import UserTable from '@/components/users/UserTable'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { useUsers } from '@/features/users/hooks/useUsers'
import type { UserRole } from '@/features/users/types/user'

import styles from './UsersPage.module.css'

type FormSubmitPayload = {
  name: string
  email: string
  role: UserRole
  password?: string
}

const UsersPage = () => {
  const [filters, setFilters] = useState<UserFilterState>({
    name: '',
  })
  const [sortConfig, setSortConfig] = useState<{ field: 'id' | 'name' | 'email' | 'role'; direction: 'asc' | 'desc' }>(
    { field: 'id', direction: 'asc' },
  )
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 10
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  const query = useMemo(
    () => ({
      name: filters.name || undefined,
      sort: `${sortConfig.field},${sortConfig.direction}`,
      page,
      size: PAGE_SIZE,
    }),
    [filters.name, sortConfig.field, sortConfig.direction, page],
  )

  const {
    users,
    pagination,
    loading,
    error,
    ringkasan,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers(query)

  const selectedUser = useMemo(
    () => users.find((item) => item.id === selectedUserId) ?? null,
    [users, selectedUserId],
  )

  const { tampilkanKonfirmasi } = useConfirmDialog()

  const handleAddUser = () => {
    setFormMode('create')
    setSelectedUserId(null)
  }

  const handleEditUser = (userId: number) => {
    setFormMode('edit')
    setSelectedUserId(userId)
  }

  const handleDeleteUser = async (userId: number) => {
    const targetUser = users.find((item) => item.id === userId)
    if (!targetUser) return
    const konfirmasi = await tampilkanKonfirmasi({
      title: 'Hapus Pengguna',
      deskripsi: `Anda akan menghapus ${targetUser.name} (${targetUser.email}). Tindakan ini tidak dapat dibatalkan.`,
      konfirmasiLabel: 'Ya, hapus',
      batalLabel: 'Batalkan',
    })
    if (konfirmasi) {
      await deleteUser(userId)
    }
  }

  const handleSubmitForm = async (
    payload: FormSubmitPayload,
    modeSubmit: 'create' | 'edit',
  ) => {
    if (modeSubmit === 'create') {
      await createUser({
        name: payload.name,
        email: payload.email,
        role: payload.role,
        password: payload.password ?? '',
      })
      setPage(0)
      return
    }

    if (modeSubmit === 'edit' && selectedUser) {
      await updateUser(selectedUser.id, {
        name: payload.name,
        email: payload.email,
        role: payload.role,
        ...(payload.password ? { password: payload.password } : {}),
      })
    }
  }

  const handleFiltersChange = (nextFilters: UserFilterState) => {
    setFilters(nextFilters)
    setPage(0)
  }

  const handleSortChange = (field: 'id' | 'name' | 'email' | 'role') => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { field, direction: 'asc' }
    })
    setPage(0)
  }

  const totalPages = Math.max(pagination.totalPages, 1)

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0 || nextPage >= totalPages) return
    setPage(nextPage)
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.pageHeader}>
        <div>
          <h2>Manajemen Pengguna</h2>
          <p>
            Kelola akses akun tim POS sesuai spesifikasi API User. Pastikan peran dan
            kredensial selalu terbarui agar operasional tetap aman.
          </p>
        </div>
      </header>

      <UserSummaryCards
        totalPengguna={ringkasan.total}
        totalManajemen={ringkasan.admin}
        totalSales={ringkasan.sales}
        totalGudang={ringkasan.gudang}
      />

      <UserFilters filters={filters} onChange={handleFiltersChange} onCreate={handleAddUser} />

      <div className={styles.dataSection}>
        {error && (
          <Card className={styles.alert}>
            <strong>Mode contoh:</strong> {error}. Sistem menampilkan data sesuai sampel
            dari spesifikasi API User sampai backend siap.
          </Card>
        )}

        <UserTable
          items={users}
          loading={loading}
          totalItems={pagination.count}
          sort={sortConfig}
          onSortChange={handleSortChange}
          onEdit={(user) => handleEditUser(user.id)}
          onDelete={(user) => void handleDeleteUser(user.id)}
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
        © {new Date().getFullYear()} Java POS. Dashboard pengguna modern berbasis React.
      </footer>

      <UserFormModal
        open={formMode !== null}
        mode={formMode ?? 'create'}
        initialValue={selectedUser}
        onClose={() => {
          setFormMode(null)
          setSelectedUserId(null)
        }}
        onSubmit={handleSubmitForm}
      />
    </div>
  )
}

export default UsersPage
