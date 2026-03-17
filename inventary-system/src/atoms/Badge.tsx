type BadgeVariant = 'green' | 'red' | 'yellow' | 'blue' | 'gray'

const styles: Record<BadgeVariant, string> = {
  green:  'bg-accent/10 text-accent',
  red:    'bg-red-500/10 text-red-400',
  yellow: 'bg-yellow-500/10 text-yellow-400',
  blue:   'bg-blue-500/10 text-blue-400',
  gray:   'bg-surface-4 text-ink-secondary',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
}

export default function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`badge ${styles[variant]}`}>
      {children}
    </span>
  )
}