import { useEffect, useMemo, useState } from 'react'
import { FiSave, FiX } from 'react-icons/fi'

import Button from '@/components/ui/Button'
import InputField from '@/components/ui/InputField'
import type {
  User,
  UserRole,
} from '@/features/users/types/user'

import styles from './UserFormModal.module.css'

type SubmitPayload = {
  name: string
  email: string
  role: UserRole
  password?: string
}

type UserFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initialValue?: User | null
  onClose: () => void
  onSubmit: (
    payload: SubmitPayload,
    mode: 'create' | 'edit',
  ) => Promise<void> | void
}

type FormState = {
  name: string
  email: string
  role: UserRole
  password: string
}

type FormError = Partial<Record<keyof SubmitPayload, string>>

const kosongkanForm = (): FormState => ({
  name: '',
  email: '',
  role: 'SALES',
  password: '',
})

const isApiErrorWithPayload = (
  error: unknown,
): error is Error & {
  payload?: {
    message?: string
    errors?: Record<string, string>
  }
} => {
  return (
    error instanceof Error &&
    typeof (error as { payload?: unknown }).payload === 'object'
  )
}

const UserFormModal = ({
  open,
  mode,
  initialValue,
  onClose,
  onSubmit,
}: UserFormModalProps) => {
  const [form, setForm] = useState<FormState>(kosongkanForm)
  const [errors, setErrors] = useState<FormError>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open && initialValue) {
      setForm({
        name: initialValue.name,
        email: initialValue.email,
        role: initialValue.role,
        password: '',
      })
    } else if (open) {
      setForm(kosongkanForm)
    }
    if (open) {
      setErrors({})
      setSubmitError(null)
    }
  }, [initialValue, open])

  const roleOptions = useMemo<Array<{ value: UserRole; label: string }>>(
    () => [
      { value: 'SUPER_ADMIN', label: 'Super Admin' },
      { value: 'ADMIN', label: 'Admin' },
      { value: 'SALES', label: 'Sales' },
      { value: 'GUDANG', label: 'Gudang' },
    ],
    [],
  )

  if (!open) {
    return null
  }

  const validate = (): SubmitPayload | null => {
    const nextErrors: FormError = {}
    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim()
    const trimmedPassword = form.password.trim()

    if (!trimmedName || trimmedName.length < 3) {
      nextErrors.name = 'Nama minimal 3 karakter.'
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
      nextErrors.email = 'Email harus valid.'
    }
    if (!form.role) {
      nextErrors.role = 'Peran wajib dipilih.'
    }

    if (mode === 'create') {
      if (!trimmedPassword || trimmedPassword.length < 8) {
        nextErrors.password = 'Kata sandi minimal 8 karakter.'
      }
    } else if (trimmedPassword && trimmedPassword.length < 8) {
      nextErrors.password = 'Jika diisi, kata sandi minimal 8 karakter.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return null
    }

    const payload: SubmitPayload = {
      name: trimmedName,
      email: trimmedEmail,
      role: form.role,
    }
    if (mode === 'create' || trimmedPassword) {
      payload.password = trimmedPassword
    }
    return payload
  }

  const mapServerErrors = (payload?: {
    message?: string
    errors?: Record<string, string>
  }) => {
    if (!payload) {
      return
    }
    if (payload.errors) {
      const fieldErrors: FormError = {}
      Object.entries(payload.errors).forEach(([field, message]) => {
        if (field === 'name' || field === 'email' || field === 'role' || field === 'password') {
          fieldErrors[field] = message
        }
      })
      setErrors((prev) => ({ ...prev, ...fieldErrors }))
    }
    if (payload.message) {
      setSubmitError(payload.message)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    const payload = validate()
    if (!payload) return
    try {
      setIsSubmitting(true)
      await onSubmit(payload, mode)
      onClose()
    } catch (err) {
      if (isApiErrorWithPayload(err)) {
        mapServerErrors(err.payload)
      } else if (err instanceof Error) {
        setSubmitError(err.message)
      } else {
        setSubmitError('Terjadi kesalahan tak terduga.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const title =
    mode === 'create' ? 'Tambah Pengguna Baru' : 'Ubah Informasi Pengguna'
  const description =
    mode === 'create'
      ? 'Daftarkan pengguna dengan peran yang sesuai untuk mengakses sistem POS.'
      : 'Perbarui rerincian akun sesuai kebutuhan dan kebijakan keamanan.'

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
            aria-label="Tutup formulir pengguna"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </header>
        <form className={styles.form} onSubmit={handleSubmit}>
          {submitError && <div className={styles.serverError}>{submitError}</div>}
          <InputField
            label="Nama Lengkap"
            placeholder="Contoh: Siti Rahma"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            error={errors.name}
          />
          <InputField
            label="Email"
            placeholder="Contoh: siti.rahma@javapos.id"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            error={errors.email}
          />
          <label className={styles.selectField}>
            <span>Peran</span>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  role: event.target.value as UserRole,
                }))
              }
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.role && <span className={styles.selectError}>{errors.role}</span>}
          </label>
          <InputField
            label="Kata Sandi"
            placeholder={mode === 'create' ? 'Minimal 8 karakter' : 'Kosongkan jika tidak diubah'}
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            error={errors.password}
            hint={
              mode === 'create'
                ? 'Wajib diisi dengan kombinasi aman.'
                : 'Opsional. Kosongkan jika kata sandi tetap.'
            }
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

export default UserFormModal
