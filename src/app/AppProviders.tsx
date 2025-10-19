import type { ReactNode } from 'react'

import { ConfirmDialogProvider } from '@/components/feedback/ConfirmDialogProvider'
import { ToastProvider } from '@/components/feedback/ToastProvider'

type AppProvidersProps = {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ToastProvider>
      <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
    </ToastProvider>
  )
}
