import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import styles from './ToastProvider.module.css'

export type ToastTipe = 'informasi' | 'sukses' | 'peringatan' | 'gagal'

type ToastItem = {
  id: string
  judul: string
  pesan?: string
  tipe: ToastTipe
}

type ToastOptions = {
  judul: string
  pesan?: string
  tipe?: ToastTipe
  durasi?: number
}

type ToastContextValue = {
  tampilkanToast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DEFAULT_DURATION = 4200

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const hapusToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const tampilkanToast = useCallback(
    ({ judul, pesan, tipe = 'informasi', durasi = DEFAULT_DURATION }: ToastOptions) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, judul, pesan, tipe }])
      const timeout = setTimeout(() => hapusToast(id), durasi)
      timers.current.set(id, timeout)
    },
    [hapusToast],
  )

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer))
      timers.current.clear()
    }
  }, [])

  const value = useMemo(() => ({ tampilkanToast }), [tampilkanToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.container} role="region" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.tipe]}`}
          >
            <div>
              <p className={styles.title}>{toast.judul}</p>
              {toast.pesan && <p className={styles.message}>{toast.pesan}</p>}
            </div>
            <button
              type="button"
              aria-label="Tutup notifikasi"
              className={styles.closeButton}
              onClick={() => hapusToast(toast.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast harus dipakai di dalam ToastProvider')
  }
  return context
}
