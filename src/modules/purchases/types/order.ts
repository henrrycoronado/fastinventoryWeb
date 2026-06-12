import type { PurchaseStatus } from './status'

export interface PurchaseOrderListItem {
  orderCen:    string
  status:      PurchaseStatus
  createdAt:   string
  confirmedAt?: string | null
  supplierCen: string
  itemCount:   number
}

export interface PurchaseOrderDetailItem {
  productCen: string
  quantity:   number
}

export interface PurchaseOrderDetail {
  orderCen:    string
  status:      PurchaseStatus
  createdAt:   string
  confirmedAt?: string | null
  supplierCen: string
  warehouseCen: string
  items:       PurchaseOrderDetailItem[]
}

export interface CreatePurchaseOrderItem {
  productCen: string
  quantity:   number
}

export interface CreatePurchaseOrder {
  supplierCen:  string
  warehouseCen: string
  items:        CreatePurchaseOrderItem[]
}

export interface PurchaseOrderSummary {
  orderCen: string
  status:   PurchaseStatus
}

export interface PurchaseOrderConfirmation {
  orderCen:    string
  status:      PurchaseStatus
  confirmedAt: string
}
