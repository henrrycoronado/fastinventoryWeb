import axios from 'axios'
import toast from 'react-hot-toast'
import type { ProblemDetails } from '../types'

const getStatusFallbackMessage = (status?: number) => {
  switch (status) {
    case 400: return 'La solicitud no es válida.'
    case 401: return 'Tu sesión expiró. Vuelve a iniciar sesión.'
    case 403: return 'No tienes permisos para realizar esta acción.'
    case 404: return 'El recurso solicitado no fue encontrado.'
    case 409: return 'Conflicto: El registro ya existe o la operación no es válida en este estado.'
    case 500: return 'Ocurrió un error inesperado en el servidor.'
    default:  return 'Ocurrió un error inesperado.'
  }
}

const extractFriendlyMessage = (error: any): string => {
  const data = error.response?.data as ProblemDetails & { errors?: Record<string, string[]> }
  const status = error.response?.status

  if (!data) return error.message ?? getStatusFallbackMessage(status)

  if (data.detail && data.detail.trim().length > 0) return data.detail

  if (data.errors && typeof data.errors === 'object') {
    const firstError = Object.values(data.errors).flat()[0]
    if (firstError) return firstError
  }

  if (data.title && data.title.trim().length > 0) return data.title

  return getStatusFallbackMessage(status)
}

const createClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const data = error.response?.data as ProblemDetails
      const msg = extractFriendlyMessage(error)
      
      if (data?.traceId) {
        console.error(`[API Error] TraceId: ${data.traceId}`, {
          status: data.status,
          title:  data.title,
          instance: data.instance,
          detail: data.detail,
          errors: (data as any).errors
        })
      }

      toast.error(msg)
      return Promise.reject(error)
    }
  )

  return client
}

export const inventoryClient = createClient(import.meta.env.VITE_INVENTORY_API_URL ?? 'http://localhost:5143')
export const purchasesClient = createClient(import.meta.env.VITE_PURCHASE_API_URL ?? 'http://localhost:5229')
export const salesClient     = createClient(import.meta.env.VITE_SALE_API_URL     ?? 'http://localhost:5074')