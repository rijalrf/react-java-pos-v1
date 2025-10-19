import type { HTMLAttributes } from 'react'

import styles from './Card.module.css'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean
}

const Card = ({
  className = '',
  elevated = false,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={`${styles.card} ${elevated ? styles.elevated : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
