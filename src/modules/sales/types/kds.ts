export interface KdsTeam {
  teamCen:      string
  name:         string
  categoryCens: string[]
}

export interface KdsItem {
  ticketItemCen: string
  ticketCen:     string
  productName:   string
  quantity:      number
  status:        string
  orderedAt:     string
  note?:         string | null
}

export interface CreateKdsTeamRequest {
  companyCen:   string
  name:         string
  categoryCens: string[]
}

export interface UpdateKdsItemStatusRequest {
  status: string
}
