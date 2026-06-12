import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAppStore } from '../../../core/store/useAppStore'

export const useRestockNotifications = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  useEffect(() => {
    if (!companyCen) return

    const inventoryUrl = import.meta.env.VITE_INVENTORY_API_URL || 'http://localhost:5143'
    const baseUrl = inventoryUrl.endsWith('/') ? inventoryUrl.slice(0, -1) : inventoryUrl
    const url = `${baseUrl}/api/inventory/companies/${companyCen}/restock-events`
    console.log(`Connecting to SSE: ${url}`)
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        toast.success(`Restock: ${data.productName} +${data.quantity} unidades`, {
          duration: 5000,
          icon: '📦',
        })
      } catch (err) {
        console.error('Error parsing SSE message', err)
      }
    }

    eventSource.onopen = () => {
      console.log('SSE connection opened')
    }

    eventSource.onerror = (err) => {
      console.error('SSE error', err)
    }

    return () => {
      eventSource.close()
    }
  }, [companyCen])
}