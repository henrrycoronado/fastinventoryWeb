export function formatCurrency(amount: number, currency = 'BOB') {
  return new Intl.NumberFormat('es-BO', { style: 'currency', currency }).format(amount)
}