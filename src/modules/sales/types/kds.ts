export interface KdsTeam {
  teamCen:      string
  name:         string
  categoryCens: string[]
}

export interface KdsItem {
  ticketItemCen: string
  ticketCen:     string
  productCen:    string
  productName:   string
  quantity:      number
  status:        string
  note?:         string
  resendCount:   number
  createdAt:     string
}
