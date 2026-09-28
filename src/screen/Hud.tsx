import type { ReactNode } from 'react'

const pad2 = (n: number) => String(n).padStart(2, '0')

export function Hud({ items }: { items: [label: string, value: number][] }) {
  return (
    <dl className="text-lcd-2 mb-2.5 flex justify-between text-[8px]">
      {items.map(([label, value]) => (
        <div key={label} className="flex gap-1.5">
          <dt>{label}</dt>
          <dd className="text-lcd-3">{pad2(value)}</dd>
        </div>
      ))}
    </dl>
  )
}

export function StatusLine({
  children,
  icon,
}: {
  children: ReactNode
  icon?: ReactNode
}) {
  return (
    <p
      role="status"
      className="mt-2.5 flex min-h-5 items-center justify-center gap-2 text-center text-[9px] leading-relaxed whitespace-nowrap uppercase sm:text-[10px] @max-[15rem]:text-[8px]"
    >
      {icon}
      {children}
    </p>
  )
}

export function MessageScreen({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center-safe gap-4 px-2 text-center">
      <p className="text-xs leading-relaxed">{title}</p>
      {children && (
        <div className="text-lcd-2 text-[8px] leading-loose">{children}</div>
      )}
    </div>
  )
}
