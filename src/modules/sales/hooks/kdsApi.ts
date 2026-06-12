import { salesClient } from '../../../core/networks/api/client'
import type {
  KdsTeam,
  KdsItem,
  CreateKdsTeamRequest,
  UpdateKdsItemStatusRequest
} from '../types'

export const kdsApi = {
  listTeams: (companyCen: string) =>
    salesClient.get<KdsTeam[]>(`/api/sales/companies/${companyCen}/kds/teams`).then((r: any) => r.data),
  createTeam: (companyCen: string, data: CreateKdsTeamRequest) =>
    salesClient.post<KdsTeam>(`/api/sales/companies/${companyCen}/kds/teams`, data).then((r: any) => r.data),
  listTeamItems: (companyCen: string, teamCen: string) =>
    salesClient.get<KdsItem[]>(`/api/sales/companies/${companyCen}/kds/teams/${teamCen}/items`).then((r: any) => r.data),
  updateItemStatus: (companyCen: string, ticketItemCen: string, data: UpdateKdsItemStatusRequest) =>
    salesClient.patch(`/api/sales/companies/${companyCen}/kds/items/${ticketItemCen}/status`, data).then((r: any) => r.data),
}