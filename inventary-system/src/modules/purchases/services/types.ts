export type PurchaseStatus = 0 | 1;

export const PURCHASE_STATUS = {
  PENDING: 0 as PurchaseStatus,
  CONFIRMED: 1 as PurchaseStatus,
} as const;

export interface Supplier {
  supplierCen: string
  name:        string
}

export interface SupplierManagement {
  cen:       string
  name:      string
  isActive:  boolean
  createdAt: string
}

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

export interface PagedResult<T> {
  items:       T[]
  totalCount:  number
  totalPages:  number
  currentPage: number
}
