import axios from 'axios'
import toast from 'react-hot-toast'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success) {
        const msg = body.message ?? 'Error desconocido'
        toast.error(msg)
        return Promise.reject(new Error(msg))
      }
      response.data = body.data
    }
    return response
  },
  (error) => {
    const msg =
      error.response?.data?.message ?? error.message ?? 'Error de red'
    toast.error(msg)
    return Promise.reject(error)
  }
)