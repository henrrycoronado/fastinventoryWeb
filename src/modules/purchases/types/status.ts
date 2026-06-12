export type PurchaseStatus = 0 | 1;

export const PURCHASE_STATUS = {
  PENDING: 0 as PurchaseStatus,
  CONFIRMED: 1 as PurchaseStatus,
} as const;
