import { useQuery } from '@tanstack/react-query'
import { salesApi } from '../hooks'
import type { PaymentMethod } from '../types'

export const usePaymentMethods = () =>
  useQuery<PaymentMethod[]>({
    queryKey: ['payment-methods'],
    queryFn:  () => salesApi.paymentMethods.list(),
  })