export function formatCurrency(amount: number, currency = 'BOB') {
  return new Intl.NumberFormat('es-BO', { style: 'currency', currency }).format(amount)
}

export function formatDate(date: string | Date) {
  const parsedDate = date instanceof Date ? date : new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return ''

  return new Intl.DateTimeFormat('es-BO', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).format(parsedDate)
}

export function isEmptyField(value: string | number | undefined | null): boolean {
  if (typeof value === 'number') return isNaN(value) || value <= 0
  return !value || value.toString().trim() === ''
}