import type { ReactNode } from "react"
import { Lightbulb } from "lucide-react"

interface HintCardProps {
  variant: "dica" | "passos"
  title: string
  children: ReactNode
}

export function HintCard({ variant, title, children }: HintCardProps) {
  if (variant === "dica") {
    return (
      <aside className="bg-amber-50 border border-amber-200 rounded-lg p-4 self-start">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={16} className="text-amber-500" />
          <h3 className="text-sm font-bold text-amber-900">{title}</h3>
        </div>
        <div className="text-xs text-amber-900 leading-relaxed">{children}</div>
      </aside>
    )
  }

  return (
    <aside className="bg-white border border-border rounded-lg p-4 self-start">
      <h3 className="text-sm font-bold text-text-blue mb-3">{title}</h3>
      <div className="text-sm text-text-black">{children}</div>
    </aside>
  )
}
