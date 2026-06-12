import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { salesApi } from '../hooks'
import type { KdsTeam } from '../types'

export const useKdsTeams = (params?: { warehouseCen?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<KdsTeam[]>({
    queryKey: ['kds-teams', companyCen, params],
    queryFn:  () => salesApi.kds.listTeams(companyCen!, params),
    enabled:  !!companyCen,
  })
}
