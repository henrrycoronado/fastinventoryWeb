export function isEmptyField(value: string | number | undefined | null): boolean {
  if (typeof value === 'number') return isNaN(value) || value <= 0
  return !value || value.toString().trim() === ''
}
