import { useMemo, useState } from 'react'

import { useConfirmDialog } from '@/components/feedback/ConfirmDialogProvider'
import ProductFilters, {
  type ProductFilterState,
} from '@/components/products/ProductFilters'
import ProductFormModal from '@/components/products/ProductFormModal'
import ProductSummaryCards from '@/components/products/ProductSummaryCards'
import ProductTable from '@/components/products/ProductTable'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { useProducts } from '@/features/products/hooks/useProducts'

import styles from './ProductsPage.module.css'

const ProductsPage = () => {
  const [filters, setFilters] = useState<ProductFilterState>({
    name: '',
    sort: 'id,asc',
  })
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 10
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const query = useMemo(
    () => ({
      name: filters.name || undefined,
      sort: filters.sort || undefined,
      page,
      size: PAGE_SIZE,
    }),
    [filters.name, filters.sort, page],
  )
  const {
    produk,
    ringkasan,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    pagination,
  } = useProducts(query)

  const selectedProduct = useMemo(
    () => produk.find((item) => item.id === selectedProductId) ?? null,
    [produk, selectedProductId],
  )

  const { tampilkanKonfirmasi } = useConfirmDialog()

  const handleAddProduct = () => {
    setFormMode('create')
    setSelectedProductId(null)
  }

  const handleEditProduct = (productId: number) => {
    setSelectedProductId(productId)
    setFormMode('edit')
  }

  const handleDeleteProduct = async (productId: number) => {
    const produkTarget = produk.find((item) => item.id === productId)
    if (!produkTarget) return
    const konfirmasi = await tampilkanKonfirmasi({
      title: 'Hapus Produk',
      deskripsi: `Anda akan menghapus ${produkTarget.name}. Tindakan ini tidak dapat dibatalkan.`,
      konfirmasiLabel: 'Ya, hapus',
      batalLabel: 'Batalkan',
    })
    if (konfirmasi) {
      await deleteProduct(productId)
    }
  }

  const handleSubmitForm = async (payload: {
    name: string
    price: number
    stock: number
  }) => {
    if (formMode === 'edit' && selectedProduct) {
      await updateProduct(selectedProduct.id, payload)
    } else {
      await createProduct(payload)
      setPage(0)
    }
  }

  const handleFiltersChange = (nextFilters: ProductFilterState) => {
    setFilters(nextFilters)
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
          <h2>Manajemen Produk</h2>
          <p>
            Kelola persediaan, harga, dan stok produk berdasarkan spesifikasi API
            backend POS. Sesuaikan data secara real-time untuk mendukung operasional kasir.
          </p>
        </div>
      </header>

      <ProductSummaryCards
        totalProduk={pagination.count}
        totalStok={ringkasan.totalStok}
        totalNilai={ringkasan.totalNilai}
        stokMenipis={ringkasan.stokMenipis}
      />

      <ProductFilters
        filters={filters}
        onChange={handleFiltersChange}
        onCreate={handleAddProduct}
      />

      <div className={styles.dataSection}>
        {error && (
          <Card className={styles.alert}>
            <strong>Mode contoh:</strong> {error}. Sistem menampilkan data sesuai
            sampel dari spesifikasi API Product sampai backend siap.
          </Card>
        )}

        <ProductTable
          items={produk}
          loading={loading}
          totalItems={pagination.count}
          onEdit={(product) => handleEditProduct(product.id)}
          onDelete={(product) => void handleDeleteProduct(product.id)}
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
        © {new Date().getFullYear()} Java POS. Dashboard produk modern berbasis React.
      </footer>

      <ProductFormModal
        open={formMode !== null}
        mode={formMode ?? 'create'}
        initialValue={selectedProduct}
        onClose={() => setFormMode(null)}
        onSubmit={handleSubmitForm}
      />
    </div>
  )
}

export default ProductsPage
