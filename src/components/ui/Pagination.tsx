import { memo, useMemo } from 'react'

import styles from './Pagination.module.css'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

type PageButton = number | 'ellipsis'

const MAX_VISIBLE = 5

const buildPages = (current: number, total: number): PageButton[] => {
  if (total <= MAX_VISIBLE) {
    return Array.from({ length: total }, (_, index) => index)
  }

  const pages: PageButton[] = []
  const firstPage = 0
  const lastPage = total - 1

  pages.push(firstPage)

  const start = Math.max(current - 1, firstPage + 1)
  const end = Math.min(current + 1, lastPage - 1)

  if (start > firstPage + 1) {
    pages.push('ellipsis')
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  if (end < lastPage - 1) {
    pages.push('ellipsis')
  }

  pages.push(lastPage)

  return pages
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = useMemo(
    () => buildPages(currentPage, totalPages),
    [currentPage, totalPages],
  )

  if (totalPages <= 1) {
    return null
  }

  const handleChange = (page: number) => {
    if (page < 0 || page >= totalPages || page === currentPage) {
      return
    }
    onPageChange(page)
  }

  return (
    <nav className={styles.container} aria-label="Navigasi halaman">
      <button
        type="button"
        className={styles.navButton}
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Sebelumnya
      </button>
      <ul className={styles.pageList}>
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <li key={`ellipsis-${index}`} className={styles.ellipsis}>
                …
              </li>
            )
          }
          const isActive = page === currentPage
          return (
            <li key={page}>
              <button
                type="button"
                className={`${styles.pageButton} ${isActive ? styles.active : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleChange(page)}
              >
                {page + 1}
              </button>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        className={styles.navButton}
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        Selanjutnya
      </button>
    </nav>
  )
}

export default memo(Pagination)
