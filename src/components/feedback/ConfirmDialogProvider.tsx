import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import styles from './ConfirmDialogProvider.module.css'

type ConfirmDialogOptions = {
  title?: string
  deskripsi: string
  konfirmasiLabel?: string
  batalLabel?: string
}

type ConfirmDialogContextValue = {
  tampilkanKonfirmasi: (options: ConfirmDialogOptions) => Promise<boolean>
}

type ConfirmDialogState =
  | {
      aktif: true
      options: Required<ConfirmDialogOptions>
      resolve: (value: boolean) => void
    }
  | {
      aktif: false
      options: null
      resolve: null
    }

const defaultOptions: Required<ConfirmDialogOptions> = {
  title: 'Konfirmasi',
  deskripsi: 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  konfirmasiLabel: 'Ya, lanjutkan',
  batalLabel: 'Batalkan',
}

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(
  null,
)

export const ConfirmDialogProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [state, setState] = useState<ConfirmDialogState>({
    aktif: false,
    options: null,
    resolve: null,
  })

  const resetState = useCallback(() => {
    setState({
      aktif: false,
      options: null,
      resolve: null,
    })
  }, [])

  const tampilkanKonfirmasi = useCallback(
    (options: ConfirmDialogOptions) => {
      return new Promise<boolean>((resolve) => {
        setState({
          aktif: true,
          options: { ...defaultOptions, ...options },
          resolve,
        })
      })
    },
    [],
  )

  const handleClose = useCallback(
    (hasil: boolean) => {
      if (state.resolve) {
        state.resolve(hasil)
      }
      resetState()
    },
    [resetState, state.resolve],
  )

  const value = useMemo(() => ({ tampilkanKonfirmasi }), [tampilkanKonfirmasi])

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      {state.aktif && state.options && (
        <div className={styles.overlay} role="presentation">
          <div
            className={styles.dialog}
            role="dialog"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
          >
            <h2 id="confirm-dialog-title" className={styles.title}>
              {state.options.title}
            </h2>
            <p id="confirm-dialog-description" className={styles.description}>
              {state.options.deskripsi}
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => handleClose(false)}
              >
                {state.options.batalLabel}
              </button>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={() => handleClose(true)}
              >
                {state.options.konfirmasiLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  )
}

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error(
      'useConfirmDialog harus dipakai di dalam ConfirmDialogProvider',
    )
  }
  return context
}
