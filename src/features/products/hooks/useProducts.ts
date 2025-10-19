import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useToast } from '@/components/feedback/ToastProvider'

import type {
  CreateProductPayload,
  Pagination,
  Product,
} from '../types/product'
import { productService, type ProdukQuery } from '../services/productService'

const contohProduk: Product[] = [
  {
    id: 1,
    name: 'Product A',
    price: 19999,
    stock: 100,
  },
  {
    id: 2,
    name: 'Product B',
    price: 25500,
    stock: 50,
  },
]

const defaultPagination: Pagination = {
  currentPage: 0,
  pageSize: 10,
  totalPages: 1,
  count: contohProduk.length,
}

export const useProducts = (query: ProdukQuery) => {
  const { tampilkanToast } = useToast()
  const [produk, setProduk] = useState<Product[]>([])
  const [pagination, setPagination] = useState<Pagination>(defaultPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fallbackDitampilkan = useRef(false)

  const muatProduk = useCallback(async () => {
    setLoading(true)
    try {
      const response = await productService.getProducts(query)
      setProduk(response.data.products)
      setPagination(response.data.pagination)
      setError(null)
      fallbackDitampilkan.current = false
    } catch (err) {
      console.error(err)
      setProduk(contohProduk)
      setPagination(defaultPagination)
      const pesanError =
        err instanceof Error
          ? err.message
          : 'Terjadi kendala saat memuat data produk'
      setError(pesanError)
      if (!fallbackDitampilkan.current) {
        tampilkanToast({
          judul: 'Gagal memuat data dari server',
          pesan:
            'Menampilkan data contoh berdasarkan spesifikasi hingga server siap.',
          tipe: 'peringatan',
        })
        fallbackDitampilkan.current = true
      }
    } finally {
      setLoading(false)
    }
  }, [query, tampilkanToast])

  useEffect(() => {
    void muatProduk()
  }, [muatProduk])

  const createProduct = useCallback(
    async (payload: CreateProductPayload) => {
      try {
        await productService.createProduct(payload)
        tampilkanToast({
          judul: 'Produk berhasil dibuat',
          pesan: 'Data produk baru telah ditambahkan.',
          tipe: 'sukses',
        })
        await muatProduk()
      } catch (err) {
        const pesanError =
          err instanceof Error ? err.message : 'Gagal membuat produk'
        tampilkanToast({
          judul: 'Gagal membuat produk',
          pesan: pesanError,
          tipe: 'gagal',
        })
        throw err
      }
    },
    [muatProduk, tampilkanToast],
  )

  const updateProduct = useCallback(
    async (id: number, payload: CreateProductPayload) => {
      try {
        await productService.updateProduct(id, payload)
        tampilkanToast({
          judul: 'Perubahan tersimpan',
          pesan: 'Data produk telah diperbarui.',
          tipe: 'sukses',
        })
        await muatProduk()
      } catch (err) {
        const pesanError =
          err instanceof Error ? err.message : 'Gagal memperbarui produk'
        tampilkanToast({
          judul: 'Gagal memperbarui produk',
          pesan: pesanError,
          tipe: 'gagal',
        })
        throw err
      }
    },
    [muatProduk, tampilkanToast],
  )

  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        await productService.deleteProduct(id)
        tampilkanToast({
          judul: 'Produk dihapus',
          pesan: 'Data produk berhasil dihapus.',
          tipe: 'informasi',
        })
        await muatProduk()
      } catch (err) {
        const pesanError =
          err instanceof Error ? err.message : 'Gagal menghapus produk'
        tampilkanToast({
          judul: 'Gagal menghapus produk',
          pesan: pesanError,
          tipe: 'gagal',
        })
        throw err
      }
    },
    [muatProduk, tampilkanToast],
  )

  const ringkasan = useMemo(() => {
    const totalStok = produk.reduce((total, item) => total + item.stock, 0)
    const totalNilai = produk.reduce(
      (total, item) => total + item.price * item.stock,
      0,
    )
    const stokMenipis = produk.filter((item) => item.stock < 20).length
    return { totalStok, totalNilai, stokMenipis }
  }, [produk])

  return {
    produk,
    pagination,
    loading,
    error,
    ringkasan,
    refresh: muatProduk,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
