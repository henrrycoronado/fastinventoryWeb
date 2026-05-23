import axios from 'axios'
import toast from 'react-hot-toast'

type ApiErrorPayload = {
  status?: number
  title?: string
  detail?: string
  message?: string
  traceId?: string
  errors?: Record<string, unknown>
}

const TECHNICAL_MESSAGE_PATTERNS = [
  /cannot write datetimeoffset/i,
  /timestamp without time zone/i,
  /npgsql/i,
  /sqlstate/i,
  /postgres/i,
  /remote api error/i,
  /exception/i,
]

const getStatusFallbackMessage = (status?: number) => {
  switch (status) {
    case 400:
      return 'La solicitud no es válida.'
    case 401:
      return 'Tu sesión expiró. Vuelve a iniciar sesión.'
    case 403:
      return 'No tienes permisos para realizar esta acción.'
    case 404:
      return 'El recurso solicitado no fue encontrado.'
    case 409:
      return 'Ya existe un registro con esos datos.'
    case 422:
      return 'Revisa los campos del formulario.'
    case 500:
      return 'Ocurrió un error inesperado. Intenta nuevamente.'
    default:
      return 'Ocurrió un error inesperado.'
  }
}

const isTechnicalMessage = (value: string) =>
  TECHNICAL_MESSAGE_PATTERNS.some((pattern) => pattern.test(value))

const flattenValidationErrors = (errors: unknown): string | null => {
  if (!errors || typeof errors !== 'object') {
    return null
  }

  const messages = Object.values(errors)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)

  return messages.length > 0 ? messages[0] : null
}

const parseSerializedError = (value: string): unknown => {
  const jsonStart = value.indexOf('{')

  if (jsonStart >= 0) {
    try {
      return JSON.parse(value.slice(jsonStart))
    } catch {
      return value
    }
  }

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const extractFriendlyMessage = (payload: unknown, status?: number): string => {
  const normalizedPayload = typeof payload === 'string' ? parseSerializedError(payload) : payload

  if (typeof normalizedPayload === 'string') {
    return isTechnicalMessage(normalizedPayload)
      ? getStatusFallbackMessage(status)
      : normalizedPayload
  }

  if (!normalizedPayload || typeof normalizedPayload !== 'object') {
    return getStatusFallbackMessage(status)
  }

  const data = normalizedPayload as ApiErrorPayload

  const validationMessage = flattenValidationErrors(data.errors)
  if (validationMessage) {
    return validationMessage
  }

  const candidates = [data.detail, data.message, data.title]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)

  const friendlyCandidate = candidates.find((candidate) => !isTechnicalMessage(candidate))
  if (friendlyCandidate) {
    return friendlyCandidate
  }

  return candidates[0] ?? getStatusFallbackMessage(status)
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    const status = error.response?.status
    const msg = data
      ? extractFriendlyMessage(data, status)
      : error.message ?? 'Error de red'
    
    if (data?.traceId) {
      console.error(`[API Error] TraceId: ${data.traceId}`, data)
    }

    toast.error(msg)

    return Promise.reject(error)
  }
)