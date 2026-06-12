import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { salesApi } from '../hooks'
import toast from 'react-hot-toast'
import type { 
  KdsTeam, 
  KdsItem, 
  UpdateKdsItemStatusRequest 
} from '../types'

export const useKdsTeams = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<KdsTeam[]>({
    queryKey: ['kds-teams', companyCen],
    queryFn:  () => salesApi.kds.listTeams(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useCreateKdsTeam = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: (data: { name: string; categoryCens: string[] }) =>
      salesApi.kds.createTeam(companyCen!, { ...data, companyCen: companyCen! }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kds-teams', companyCen] })
      toast.success('Equipo KDS creado')
    },
  })
}

export const useKdsTeamItems = (teamCen: string | undefined) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<KdsItem[]>({
    queryKey: ['kds-team-items', companyCen, teamCen],
    queryFn:  () => salesApi.kds.listTeamItems(companyCen!, teamCen!),
    enabled:  !!companyCen && !!teamCen,
    refetchInterval: 15000, // Auto-refresh for KDS
  })
}

export const useUpdateKdsItemStatus = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: ({ ticketItemCen, data }: { ticketItemCen: string; data: UpdateKdsItemStatusRequest }) =>
      salesApi.kds.updateItemStatus(companyCen!, ticketItemCen, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kds-team-items'] })
      qc.invalidateQueries({ queryKey: ['kds-status', companyCen] })
      toast.success('Estado actualizado')
    },
  })
}
