export default function SectionHeader({ title, subtitle, right }: any) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-surface-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-primary">{title}</h1>
        {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}