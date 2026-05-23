import axios from 'axios'
import toast from 'react-hot-toast'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    const msg =
      data?.detail ??      // Standard ProblemDetails detail
      data?.message ??     // Manual controller message fallback
      error.message ??     // Axios error message
      'Error de red'
    
    if (data?.traceId) {
      console.error(`[API Error] TraceId: ${data.traceId}`, data)
    }

    toast.error(msg)

    return Promise.reject(error)
  }
)