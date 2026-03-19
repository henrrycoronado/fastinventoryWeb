export default function StatCard({ label, value, icon: Icon, variant = 'default', sub }: any) {
  const colors: Record<string, string> = {
    default: 'text-accent bg-accent/10',
    warn:    'text-yellow-400 bg-yellow-400/10',
    danger:  'text-red-400 bg-red-400/10',
  }
  return (
    <div className="card p-5 flex items-center gap-4">
      {Icon && <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors[variant]}`}><Icon size={18} /></div>}
      <div>
        <p className="text-xs text-ink-muted uppercase tracking-wider">{label}</p>
        <p className="font-display text-2xl font-bold text-ink-primary mt-1">{value}</p>
        {sub && <p className="text-xs text-ink-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}