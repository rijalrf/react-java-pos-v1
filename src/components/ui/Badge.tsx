import type { HTMLAttributes } from 'react'

import styles from './Badge.module.css'

type BadgeTone = 'default' | 'success' | 'warning' | 'danger'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone
}

const Badge = ({ tone = 'default', className = '', ...props }: BadgeProps) => {
  return (
    <span className={`${styles.badge} ${styles[tone]} ${className}`} {...props} />
  )
}

export default Badge
