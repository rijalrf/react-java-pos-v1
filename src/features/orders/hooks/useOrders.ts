import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useToast } from '@/components/feedback/ToastProvider'
import type { Pagination } from '@/types/pagination'

import { orderService, type OrderQuery } from '../services/orderService'
import type {
  CreateOrderPayload,
  Order,
  OrderStatus,
} from '../types/order'

const contohPesanan: Order[] = [
  {
    id: 14,
    orderNumber: '6e9980f3-84ea-42de-8413-95e55de68f21',
    customerName: 'Doni Setiawan',
    customerEmail: 'doni.setiawan@example.com',
    customerPhone: '081234567891',
    customerAddress: 'Jalan Raya No. 1235',
    orderDate: '2025-10-19',
    totalAmount: 150000,
    orderStatus: 'COMPLETED',
    items: [
      {
        product: {
          id: 15,
          name: 'Pulpen2',
          price: 54300,
          stock: 10,
        },
        quantity: 2,
        price: 1000,
      },
      {
        product: {
          id: 16,
          name: 'Pulpen3',
          price: 54300,
          stock: 10,
        },
        quantity: 1,
        price: 1000,
      },
    ],
  },
  {
    id: 15,
    orderNumber: '07154f6f-1090-4bdb-8d9a-09a9349a580f',
    customerName: 'Wahyu Setiawan',
    customerEmail: 'wahyu.setiawan@example.com',
    customerPhone: '081234567891',
    customerAddress: 'Jalan Raya No. 1235',
    orderDate: '2025-10-19',
    totalAmount: 150000,
    orderStatus: 'PENDING',
    items: [
      {
        product: {
          id: 15,
          name: 'Pulpen2',
          price: 54300,
          stock: 10,
        },
        quantity: 2,
        price: 1000,
      },
      {
        product: {
          id: 16,
          name: 'Pulpen3',
          price: 54300,
          stock: 10,
        },
        quantity: 1,
        price: 1000,
      },
    ],
  },
  {
    id: 16,
    orderNumber: '5fd2a5b8-6c4d-43d0-9b40-1f245fe41234',
    customerName: 'Siti Rahma',
    customerEmail: 'siti.rahma@example.com',
    customerPhone: '081298765432',
    customerAddress: 'Jl. Melati No. 5',
    orderDate: '2025-10-21',
    totalAmount: 295000,
    orderStatus: 'SHIPPED',
    items: [
      {
        product: {
          id: 20,
          name: 'Kertas A4',
          price: 45000,
          stock: 30,
        },
        quantity: 5,
        price: 45000,
      },
    ],
  },
  {
    id: 17,
    orderNumber: '1aa3b5c7-d8e9-41f2-a3b4-c5d6e7f8a9b0',
    customerName: 'Rudi Hartono',
    customerEmail: 'rudi.hartono@example.com',
    customerPhone: '081377766655',
    customerAddress: 'Komplek Harmoni Blok C2',
    orderDate: '2025-10-20',
    totalAmount: 78000,
    orderStatus: 'DELIVERED',
    items: [
      {
        product: {
          id: 25,
          name: 'Pulpen Hitam',
          price: 13000,
          stock: 100,
        },
        quantity: 6,
        price: 13000,
      },
    ],
  },
  {
    id: 18,
    orderNumber: '9c8b7a6d-5e4f-3210-b9a8-76543210fedc',
    customerName: 'Mei Mei',
    customerEmail: 'mei.mei@example.com',
    customerPhone: '081266612345',
    customerAddress: 'Ruko Plaza No. 9',
    orderDate: '2025-10-18',
    totalAmount: 120000,
    orderStatus: 'CANCELED',
    items: [
      {
        product: {
          id: 30,
          name: 'Notes Hardcover',
          price: 40000,
          stock: 15,
        },
        quantity: 3,
        price: 40000,
      },
    ],
  },
]

const defaultPagination: Pagination = {
  currentPage: 0,
  pageSize: 10,
  totalPages: 1,
  count: contohPesanan.length,
}

type SortableField =
  | 'id'
  | 'orderDate'
  | 'totalAmount'
  | 'customerName'
  | 'orderStatus'

const parseSort = (
  sortParam?: string,
): { field: SortableField; direction: 'asc' | 'desc' } => {
  if (!sortParam) {
    return { field: 'orderDate', direction: 'desc' }
  }
  const [rawField, rawDirection] = sortParam.split(',').map((item) => item.trim())
  const normalizedField = rawField === 'status' ? 'orderStatus' : rawField
  const field: SortableField =
    normalizedField === 'orderDate' ||
    normalizedField === 'totalAmount' ||
    normalizedField === 'customerName' ||
    normalizedField === 'orderStatus'
      ? (normalizedField as SortableField)
      : 'id'
  const direction = rawDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc'
  return { field, direction }
}

const applyFallbackTransform = (orders: Order[], query: OrderQuery) => {
  const filtered = orders.filter((order) => {
    const namaCocok = query.customerName
      ? order.customerName.toLowerCase().includes(query.customerName.toLowerCase())
      : true
    const statusCocok = query.status ? order.orderStatus === query.status : true
    return namaCocok && statusCocok
  })

  const { field, direction } = parseSort(query.sort)
  const sorted = [...filtered].sort((a, b) => {
    const factor = direction === 'asc' ? 1 : -1
    if (field === 'orderDate') {
      return (
        (new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()) * factor
      )
    }
    if (field === 'totalAmount') {
      return (a.totalAmount - b.totalAmount) * factor
    }
    if (field === 'customerName') {
      return (
        a.customerName.toLowerCase().localeCompare(b.customerName.toLowerCase()) *
        factor
      )
    }
    if (field === 'orderStatus') {
      return (
        a.orderStatus.toLowerCase().localeCompare(b.orderStatus.toLowerCase()) *
        factor
      )
    }
    return (a.id - b.id) * factor
  })

  const pageSize = query.size ?? sorted.length
  const currentPage = query.page ?? 0
  const start = currentPage * pageSize
  const end = start + pageSize
  const slice = sorted.slice(start, end)
  const totalPages =
    pageSize > 0 ? Math.max(Math.ceil(sorted.length / pageSize), 1) : 1

  return {
    items: slice,
    pagination: {
      currentPage: Math.min(currentPage, totalPages - 1),
      pageSize,
      totalPages,
      count: sorted.length,
    } satisfies Pagination,
  }
}

export const useOrders = (query: OrderQuery) => {
  const { tampilkanToast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination>(defaultPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fallbackDitampilkan = useRef(false)

  const muatPesanan = useCallback(async () => {
    setLoading(true)
    try {
      const response = await orderService.getOrders(query)
      const data = response.data.orders.map((order) => ({
        ...order,
        items: order.items ?? [],
      }))
      setOrders(data)
      setPagination(response.data.pagination)
      setError(null)
      fallbackDitampilkan.current = false
    } catch (err) {
      console.error(err)
      const hasil = applyFallbackTransform(contohPesanan, query)
      setOrders(hasil.items)
      setPagination(hasil.pagination)
      const pesanError =
        err instanceof Error
          ? err.message
          : 'Terjadi kendala saat memuat data pesanan'
      setError(pesanError)
      if (!fallbackDitampilkan.current) {
        tampilkanToast({
          judul: 'Gagal memuat data dari server',
          pesan:
            'Menampilkan data contoh berdasarkan spesifikasi API Order hingga backend siap.',
          tipe: 'peringatan',
        })
        fallbackDitampilkan.current = true
      }
    } finally {
      setLoading(false)
    }
  }, [query, tampilkanToast])

  useEffect(() => {
    void muatPesanan()
  }, [muatPesanan])

  const createOrder = useCallback(
    async (payload: CreateOrderPayload) => {
      try {
        await orderService.createOrder(payload)
        tampilkanToast({
          judul: 'Pesanan berhasil dibuat',
          pesan: 'Pesanan baru telah ditambahkan ke daftar.',
          tipe: 'sukses',
        })
        await muatPesanan()
      } catch (err) {
        const pesanError =
          err instanceof Error ? err.message : 'Gagal membuat pesanan'
        tampilkanToast({
          judul: 'Gagal membuat pesanan',
          pesan: pesanError,
          tipe: 'gagal',
        })
        throw err
      }
    },
    [muatPesanan, tampilkanToast],
  )

  const updateOrderStatus = useCallback(
    async (id: number, nextStatus: OrderStatus) => {
      try {
        await orderService.updateOrderStatus(id, { orderStatus: nextStatus })
        tampilkanToast({
          judul: 'Status diperbarui',
          pesan: 'Status pesanan telah diperbarui.',
          tipe: 'sukses',
        })
        await muatPesanan()
      } catch (err) {
        const pesanError =
          err instanceof Error ? err.message : 'Gagal memperbarui status pesanan'
        tampilkanToast({
          judul: 'Gagal memperbarui status',
          pesan: pesanError,
          tipe: 'gagal',
        })
        throw err
      }
    },
    [muatPesanan, tampilkanToast],
  )

  const deleteOrder = useCallback(
    async (id: number) => {
      try {
        await orderService.deleteOrder(id)
        tampilkanToast({
          judul: 'Pesanan dihapus',
          pesan: 'Data pesanan berhasil dihapus.',
          tipe: 'informasi',
        })
        await muatPesanan()
      } catch (err) {
        const pesanError =
          err instanceof Error ? err.message : 'Gagal menghapus pesanan'
        tampilkanToast({
          judul: 'Gagal menghapus pesanan',
          pesan: pesanError,
          tipe: 'gagal',
        })
        throw err
      }
    },
    [muatPesanan, tampilkanToast],
  )

  const ringkasan = useMemo(() => {
    const total = orders.length
    const totalPendapatan = orders.reduce(
      (akumulasi, order) => akumulasi + order.totalAmount,
      0,
    )
    const pending = orders.filter((order) => order.orderStatus === 'PENDING').length
    const proses = orders.filter((order) => order.orderStatus === 'PROCESSING').length
    const shipped = orders.filter((order) => order.orderStatus === 'SHIPPED').length
    const delivered = orders.filter((order) => order.orderStatus === 'DELIVERED').length
    const selesai = orders.filter((order) => order.orderStatus === 'COMPLETED').length
    const batal = orders.filter((order) => order.orderStatus === 'CANCELED').length
    return {
      total,
      totalPendapatan,
      pending,
      proses,
      shipped,
      delivered,
      selesai,
      batal,
    }
  }, [orders])

  return {
    orders,
    pagination,
    loading,
    error,
    ringkasan,
    refresh: muatPesanan,
    createOrder,
    updateOrderStatus,
    deleteOrder,
  }
}
