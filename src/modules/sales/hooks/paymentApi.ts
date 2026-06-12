import { salesClient } from '../../../core/networks/api/client'
import type { PaymentMethod } from '../types'

export const paymentApi = {
  list: () => salesClient.get<PaymentMethod[]>('/api/sales/payment-methods').then((r: any) => r.data),
}
