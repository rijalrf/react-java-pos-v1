export const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('id-ID').format(value)
}
