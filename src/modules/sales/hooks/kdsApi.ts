import { salesClient } from '../../../core/networks/api/client'
import type { KdsTeam, KdsItem } from '../types'

export const kdsApi = {
  listTeams: (companyCen: string, params?: { warehouseCen?: string }) =>
    salesClient.get<KdsTeam[]>(`/api/sales/companies/${companyCen}/kds/teams`, { params }).then((r: any) => r.data),
  createTeam: (companyCen: string, data: Partial<KdsTeam>) =>
    salesClient.post<KdsTeam>(`/api/sales/companies/${companyCen}/kds/teams`, data).then((r: any) => r.data),
  updateTeam: (companyCen: string, teamCen: string, data: any) =>
    salesClient.put<KdsTeam>(`/api/sales/companies/${companyCen}/kds/teams/${teamCen}`, data).then((r: any) => r.data),
  updateItemStatus: (companyCen: string, ticketItemCen: string, status: string) =>
    salesClient.patch(`/api/sales/companies/${companyCen}/kds/items/${ticketItemCen}/status`, { status }).then((r: any) => r.data),
  listTeamItems: (companyCen: string, teamCen: string) =>
    salesClient.get<KdsItem[]>(`/api/sales/companies/${companyCen}/kds/teams/${teamCen}/items`).then((r: any) => r.data),
}
