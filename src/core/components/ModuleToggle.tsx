import { ToggleLeft, ToggleRight } from 'lucide-react'

interface ModuleToggleProps {
  icon:        React.ReactNode
  label:       string
  description: string
  enabled:     boolean
  disabled?:   boolean
  onToggle:    () => void
}

export default function ModuleToggle({ icon, label, description, enabled, disabled = false, onToggle }: ModuleToggleProps) {
  return (
    <div className={`card p-4 flex items-center gap-4 ${disabled ? 'opacity-60' : ''}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${enabled ? 'bg-accent/10' : 'bg-surface-4'}`}>
        <span className={enabled ? 'text-accent' : 'text-ink-muted'}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink-primary">{label}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <button onClick={onToggle} disabled={disabled} className="shrink-0 transition-colors" title={disabled ? 'Este módulo no puede desactivarse' : undefined}>
        {enabled ? <ToggleRight size={28} className="text-accent" /> : <ToggleLeft size={28} className="text-ink-muted" />}
      </button>
    </div>
  )
}
