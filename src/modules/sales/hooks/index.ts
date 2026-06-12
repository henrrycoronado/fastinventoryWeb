import { catalogApi } from './catalogApi'
import { dashboardApi } from './dashboardApi'
import { kdsApi } from './kdsApi'
import { ticketApi } from './ticketApi'
import { waiterApi } from './waiterApi'
import { taxApi } from './taxApi'
import { paymentApi } from './paymentApi'

export const salesApi = {
  catalog: catalogApi,
  dashboard: dashboardApi,
  kds: kdsApi,
  tickets: ticketApi,
  waiters: waiterApi,
  taxConfiguration: taxApi,
  paymentMethods: paymentApi,
}