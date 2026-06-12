import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Building2, ChevronRight, Plus } from 'lucide-react'
import { companyApi } from '../core/networks/hooks'
import { useAppStore } from '../core/store/useAppStore'
import { APP_NAME } from '../core/utils/constants'

import Spinner from '../core/components/atoms/Spinner'
import type { Company } from '../core/networks/types'
import CreateCompanyModal from '../core/components/CreateCompanyModal'

export default function CompanySelect() {
  const navigate    = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn:  companyApi.list,
  })

  const login = useAppStore(s => s.login)

  const handleSelect = (company: Company) => {
    login(company)
    navigate('/inventory/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center space-y-1">
          <h1 className="font-display text-3xl font-bold text-ink-primary">
            {APP_NAME}<span className="text-accent">.</span>
          </h1>
          <p className="text-sm text-ink-secondary">Selecciona una empresa para continuar</p>
        </div>

        <div className="card divide-y divide-surface-4">
          {isLoading ? (
            <div className="flex justify-center py-10"><Spinner size={20} /></div>
          ) : (companies as any[]).length === 0 ? (
            <div className="py-10 text-center text-sm text-ink-muted">
              No hay empresas registradas
            </div>
          ) : (companies as Company[]).map(company => (
            <button
              key={company.companyCen}
              onClick={() => handleSelect(company)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-3 transition-colors text-left first:rounded-t-xl last:rounded-b-xl"
            >

              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Building2 size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-primary">{company.name}</p>
                <p className="text-xs text-ink-muted">CEN: {company.companyCen}</p>
              </div>
              <ChevronRight size={15} className="text-ink-muted shrink-0" />
            </button>
          ))}
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary w-full justify-center"
        >
          <Plus size={14} /> Nueva empresa
        </button>

      </div>

      <CreateCompanyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
