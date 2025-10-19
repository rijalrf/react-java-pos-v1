import type { InputHTMLAttributes, ReactNode } from 'react'

import styles from './InputField.module.css'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

const InputField = ({
  label,
  hint,
  error,
  className = '',
  ...props
}: InputFieldProps) => {
  return (
    <label className={`${styles.wrapper} ${className}`}>
      {label && <span className={styles.label}>{label}</span>}
      <input className={styles.input} {...props} />
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  )
}

export default InputField
