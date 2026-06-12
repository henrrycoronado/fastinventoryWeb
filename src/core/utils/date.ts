export function formatDate(date: string | Date) {
  const parsedDate = date instanceof Date ? date : new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return ''

  return new Intl.DateTimeFormat('es-BO', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).format(parsedDate)
}