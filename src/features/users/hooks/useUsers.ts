import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useToast } from '@/components/feedback/ToastProvider'
import type { Pagination } from '@/types/pagination'

import {
  userService,
  type UserQuery,
} from '../services/userService'
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '../types/user'

const contohPengguna: User[] = [
  {
    id: 1,
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    role: 'ADMIN',
  },
  {
    id: 2,
    name: 'Doni Setiawan',
    email: 'doni.setiawan@example.com',
    role: 'SALES',
  },
  {
    id: 3,
    name: 'Maya Sari',
    email: 'maya.sari@example.com',
    role: 'SALES',
  },
  {
    id: 4,
    name: 'Rini Mulyani',
    email: 'rini.mulyani@example.com',
    role: 'GUDANG',
  },
  {
    id: 5,
    name: 'Rijal Rifai',
    email: 'rijal@ppu.co.id',
    role: 'SUPER_ADMIN',
  },
]

const defaultPagination: Pagination = {
  currentPage: 0,
  pageSize: contohPengguna.length,
  totalPages: 1,
  count: contohPengguna.length,
}

type SortableField = 'id' | 'name' | 'email' | 'role'

const parseSort = (sortParam?: string): { field: SortableField; direction: 'asc' | 'desc' } => {
  if (!sortParam) {
    return { field: 'id', direction: 'asc' }
  }
  const [rawField, rawDirection] = sortParam.split(',').map((item) => item.trim())
  const field: SortableField =
    rawField === 'name' || rawField === 'email' || rawField === 'role' ? rawField : 'id'
  const direction = rawDirection?.toLowerCase() === 'desc' ? 'desc' : 'asc'
  return { field, direction }
}

const applyFallbackTransform = (userList: User[], query: UserQuery) => {
  const { field, direction } = parseSort(query.sort)
  const filtered = userList.filter((user) => {
    if (!query.name) return true
    const keyword = query.name.toLowerCase()
    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    const valueA = a[field]
    const valueB = b[field]

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return direction === 'asc' ? valueA - valueB : valueB - valueA
    }

    return direction === 'asc'
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA))
  })

  const ukuranHalaman = query.size ?? sorted.length
  const halamanSaatIni = query.page ?? 0
  const mulai = halamanSaatIni * ukuranHalaman
  const selesai = mulai + ukuranHalaman
  const slice = sorted.slice(mulai, selesai)
  const totalPages = ukuranHalaman > 0 ? Math.max(Math.ceil(sorted.length / ukuranHalaman), 1) : 1

  return {
    items: slice,
    pagination: {
      currentPage: Math.min(halamanSaatIni, totalPages - 1),
      pageSize: ukuranHalaman,
      totalPages,
      count: sorted.length,
    } satisfies Pagination,
  }
}

export const useUsers = (query: UserQuery) => {
  const { tampilkanToast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] =
    useState<Pagination>(defaultPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fallbackDitampilkan = useRef(false)

  const muatPengguna = useCallback(async () => {
    setLoading(true)
    try {
      const response = await userService.getUsers(query)
      setUsers(response.data.users)
      setPagination(response.data.pagination)
      setError(null)
      fallbackDitampilkan.current = false
    } catch (err) {
      console.error(err)
      const hasil = applyFallbackTransform(contohPengguna, query)
      setUsers(hasil.items)
      setPagination(hasil.pagination)
      const pesanError =
        err instanceof Error
          ? err.message
          : 'Terjadi kendala saat memuat data pengguna'
      setError(pesanError)
      if (!fallbackDitampilkan.current) {
        tampilkanToast({
          judul: 'Gagal memuat data dari server',
          pesan:
            'Menampilkan data contoh berdasarkan spesifikasi API User hingga backend siap.',
          tipe: 'peringatan',
        })
        fallbackDitampilkan.current = true
      }
    } finally {
      setLoading(false)
    }
  }, [query, tampilkanToast])

  useEffect(() => {
    void muatPengguna()
  }, [muatPengguna])

  const createUser = useCallback(
    async (payload: CreateUserPayload) => {
      try {
        await userService.createUser(payload)
        tampilkanToast({
          judul: 'Pengguna berhasil dibuat',
          pesan: 'Data akun baru siap digunakan.',
          tipe: 'sukses',
        })
        await muatPengguna()
      } catch (err) {
        const pesanError =
          err instanceof Error ? err.message : 'Gagal membuat pengguna'
        tampilkanToast({
          judul: 'Gagal membuat pengguna',
          pesan: pesanError,
          tipe: 'gagal',
        })
        throw err
      }
    },
    [muatPengguna, tampilkanToast],
  )

  const updateUser = useCallback(
    async (id: number, payload: UpdateUserPayload) => {
      try {
        await userService.updateUser(id, payload)
        tampilkanToast({
          judul: 'Perubahan tersimpan',
          pesan: 'Data pengguna telah diperbarui.',
          tipe: 'sukses',
        })
        await muatPengguna()
      } catch (err) {
        const pesanError =
          err instanceof Error ? err.message : 'Gagal memperbarui pengguna'
        tampilkanToast({
          judul: 'Gagal memperbarui pengguna',
          pesan: pesanError,
          tipe: 'gagal',
        })
        throw err
      }
    },
    [muatPengguna, tampilkanToast],
  )

  const deleteUser = useCallback(
    async (id: number) => {
      try {
        await userService.deleteUser(id)
        tampilkanToast({
          judul: 'Pengguna dihapus',
          pesan: 'Akun pengguna berhasil dihapus.',
          tipe: 'informasi',
        })
        await muatPengguna()
      } catch (err) {
        const pesanError =
          err instanceof Error ? err.message : 'Gagal menghapus pengguna'
        tampilkanToast({
          judul: 'Gagal menghapus pengguna',
          pesan: pesanError,
          tipe: 'gagal',
        })
        throw err
      }
    },
    [muatPengguna, tampilkanToast],
  )

  const ringkasan = useMemo(() => {
    const total = users.length
    const hitungPeran = (role: User['role']) =>
      users.filter((item) => item.role === role).length
    return {
      total,
      admin: hitungPeran('ADMIN') + hitungPeran('SUPER_ADMIN'),
      sales: hitungPeran('SALES'),
      gudang: hitungPeran('GUDANG'),
    }
  }, [users])

  return {
    users,
    pagination,
    loading,
    error,
    ringkasan,
    refresh: muatPengguna,
    createUser,
    updateUser,
    deleteUser,
  }
}
