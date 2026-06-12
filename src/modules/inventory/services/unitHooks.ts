import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { inventoryApi } from '../hooks'
import type { Unit } from '../types'

export const useUnits = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<Unit[]>({
    queryKey: ['units', companyCen],
    queryFn:  () => inventoryApi.units.list(companyCen!),
    enabled:  !!companyCen,
  })
}
