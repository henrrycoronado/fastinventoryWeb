import { useState } from 'react'
import { ChefHat, Clock, CheckCircle2 } from 'lucide-react'
import { useKdsTeams, useKdsStatus } from '../services/salesHooks'
import { salesApi } from '../services/salesApi'
import { useAppStore } from '../../../store/useAppStore'
import type { KdsItem } from '../services/types'
import SectionHeader from '../../../components/SectionHeader'
import Badge from '../../../atoms/Badge'
import Button from '../../../atoms/Button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function KdsPage() {
  const { selectedWarehouse } = useAppStore()
  const { data: teams = [] } = useKdsTeams({ warehouseCen: selectedWarehouse?.warehouseCen })
  const { data: status } = useKdsStatus({ warehouseCen: selectedWarehouse?.warehouseCen })

  const [selectedTeamCen, setSelectedTeamCen] = useState('')

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Cocina (KDS)" 
        subtitle={selectedWarehouse?.name}
      />

      <div className="grid grid-cols-3 gap-4 px-6 mt-4">
        <div className="card p-4 text-center">
          <p className="text-xs text-ink-muted uppercase tracking-wider">Pendientes</p>
          <p className="font-display text-2xl font-bold text-yellow-400 mt-1">{status?.pendingCount ?? 0}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-ink-muted uppercase tracking-wider">Preparando</p>
          <p className="font-display text-2xl font-bold text-accent mt-1">{status?.preparingCount ?? 0}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-ink-muted uppercase tracking-wider">Listos</p>
          <p className="font-display text-2xl font-bold text-green-400 mt-1">{status?.readyCount ?? 0}</p>
        </div>
      </div>

      <div className="px-6 py-4 flex gap-2 overflow-x-auto">
        {teams.map(team => (
          <button 
            key={team.teamCen}
            onClick={() => setSelectedTeamCen(team.teamCen)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${
              selectedTeamCen === team.teamCen 
                ? 'bg-accent/10 border-accent text-accent' 
                : 'bg-surface-2 border-surface-4 text-ink-secondary hover:border-surface-5'
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>

      <div className="px-6 pb-8">
        {!selectedTeamCen ? (
          <div className="card p-10 flex flex-col items-center justify-center text-ink-muted gap-3">
            <ChefHat size={32} />
            <p className="text-sm">Selecciona una estación de cocina para ver los pedidos</p>
          </div>
        ) : (
          <TeamItemsList teamCen={selectedTeamCen} />
        )}
      </div>
    </div>
  )
}

function TeamItemsList({ teamCen }: { teamCen: string }) {
  const qc = useQueryClient()
  const { selectedCompany } = useAppStore()
  
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['kds-items', teamCen],
    queryFn: () => salesApi.kds.listTeamItems(selectedCompany!.companyCen, teamCen),
    refetchInterval: 10000,
  })

  const updateStatus = useMutation({
    mutationFn: ({ ticketItemCen, status }: { ticketItemCen: string, status: string }) => 
      salesApi.kds.updateItemStatus(selectedCompany!.companyCen, ticketItemCen, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kds-items', teamCen] })
      qc.invalidateQueries({ queryKey: ['kds-status'] })
    }
  })

  if (isLoading) return <div className="py-10 text-center text-sm text-ink-muted">Cargando pedidos...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.length === 0 ? (
        <div className="col-span-full py-10 text-center text-sm text-ink-muted bg-surface-1 rounded-xl border border-dashed border-surface-4">
          No hay pedidos pendientes en esta estación
        </div>
      ) : items.map((item: KdsItem) => (
        <div key={item.ticketItemCen} className="card p-4 space-y-3 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${
            item.status === 'PENDING' ? 'bg-yellow-400' : 
            item.status === 'PREPARING' ? 'bg-accent' : 'bg-green-400'
          }`} />
          
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-primary truncate">{item.productName}</p>
              <p className="text-[10px] font-mono text-ink-muted">Ticket: {item.ticketCen}</p>
            </div>
            <Badge variant={item.status === 'PENDING' ? 'yellow' : item.status === 'PREPARING' ? 'blue' : 'green'}>
              {item.status}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center font-bold text-accent">
              {item.quantity}
            </div>
            <div className="flex-1 min-w-0">
              {item.note && <p className="text-xs text-yellow-400 italic">"{item.note}"</p>}
              <p className="text-[10px] text-ink-muted flex items-center gap-1 mt-1">
                <Clock size={10} /> {new Date(item.createdAt).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-surface-4">
            {item.status === 'PENDING' && (
              <Button 
                variant="primary" 
                className="flex-1 justify-center text-xs"
                onClick={() => updateStatus.mutate({ ticketItemCen: item.ticketItemCen, status: 'PREPARING' })}
                loading={updateStatus.isPending}
              >
                Empezar
              </Button>
            )}
            {item.status === 'PREPARING' && (
              <Button 
                variant="primary" 
                className="flex-1 justify-center text-xs bg-green-500 hover:bg-green-600 shadow-green-500/20"
                onClick={() => updateStatus.mutate({ ticketItemCen: item.ticketItemCen, status: 'READY' })}
                loading={updateStatus.isPending}
              >
                <CheckCircle2 size={12} /> Listo
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
