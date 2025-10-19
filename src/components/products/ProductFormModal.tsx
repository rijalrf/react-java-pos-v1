import { useEffect, useState } from 'react'
import { FiSave, FiX } from 'react-icons/fi'

import Button from '@/components/ui/Button'
import InputField from '@/components/ui/InputField'
import type {
  CreateProductPayload,
  Product,
} from '@/features/products/types/product'

import styles from './ProductFormModal.module.css'

type ProductFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initialValue?: Product | null
  onClose: () => void
  onSubmit: (payload: CreateProductPayload) => Promise<void> | void
}

type FormState = {
  name: string
  price: string
  stock: string
}

type FormError = Partial<Record<keyof CreateProductPayload, string>>

const kosongkanForm = (): FormState => ({
  name: '',
  price: '',
  stock: '',
})

const ProductFormModal = ({
  open,
  mode,
  initialValue,
  onClose,
  onSubmit,
}: ProductFormModalProps) => {
  const [form, setForm] = useState<FormState>(kosongkanForm)
  const [errors, setErrors] = useState<FormError>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open && initialValue) {
      setForm({
        name: initialValue.name,
        price: String(initialValue.price),
        stock: String(initialValue.stock),
      })
    } else if (open) {
      setForm(kosongkanForm)
    }
  }, [initialValue, open])

  if (!open) {
    return null
  }

  const validate = (): CreateProductPayload | null => {
    const nextErrors: FormError = {}
    const trimmedName = form.name.trim()
    const priceNumber = Number.parseFloat(form.price)
    const stockNumber = Number.parseInt(form.stock, 10)

    if (!trimmedName || trimmedName.length < 3) {
      nextErrors.name = 'Nama minimal 3 karakter.'
    }
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      nextErrors.price = 'Harga harus lebih besar dari 0.'
    }
    if (!Number.isInteger(stockNumber) || stockNumber <= 0) {
      nextErrors.stock = 'Stok harus berupa angka dan lebih besar dari 0.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return null
    }

    return {
      name: trimmedName,
      price: priceNumber,
      stock: stockNumber,
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = validate()
    if (!payload) return
    try {
      setIsSubmitting(true)
      await onSubmit(payload)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const title =
    mode === 'create' ? 'Tambah Produk Baru' : 'Ubah Informasi Produk'
  const description =
    mode === 'create'
      ? 'Pastikan nama produk unik dan sesuai dengan katalog penjualan.'
      : 'Perbarui detail produk sesuai kebutuhan operasional.'

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Tutup formulir produk"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </header>
        <form className={styles.form} onSubmit={handleSubmit}>
          <InputField
            label="Nama Produk"
            placeholder="Contoh: Pulpen Gel Hitam"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            error={errors.name}
          />
          <InputField
            label="Harga (Rupiah)"
            placeholder="Contoh: 25000"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, price: event.target.value }))
            }
            error={errors.price}
          />
          <InputField
            label="Stok"
            placeholder="Contoh: 100"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, stock: event.target.value }))
            }
            error={errors.stock}
          />
          <footer className={styles.footer}>
            <Button type="button" variant="ghost" onClick={onClose}>
              Batalkan
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<FiSave size={16} />}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
