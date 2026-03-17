export function formatCurrency(amount: number, currency = 'BOB') {
  return new Intl.NumberFormat('es-BO', { style: 'currency', currency }).format(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('es-BO', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).format(new Date(date))
}