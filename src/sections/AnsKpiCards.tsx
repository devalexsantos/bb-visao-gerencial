import { useConformidadeDoAns } from "../hooks/usePortal"
import type { Ans } from "../types/portal"

interface AnsKpiCardsProps {
  ansList: Ans[]
  selectedAnsSysId: string | null
  onSelectAns: (sysId: string) => void
}

interface AnsCardProps {
  ans: Ans
  isSelected: boolean
  onSelect: (sysId: string) => void
}

function AnsCard({ ans, isSelected, onSelect }: AnsCardProps) {
  const { pct, isLoading } = useConformidadeDoAns(ans.sys_id)
  const titulo = ans.apelido?.trim() || ans.servico

  const cardClasses = isSelected
    ? "bg-[#1E3A5F] text-white shadow-md border-2 border-[#1E3A5F]"
    : "bg-[#E5E7EB] text-[#374151] border-2 border-transparent hover:bg-[#D1D5DB]"

  return (
    <button
      type="button"
      onClick={() => onSelect(ans.sys_id)}
      className={`${cardClasses} rounded-xl p-5 text-left transition-colors cursor-pointer flex flex-col items-center`}
    >
      <p className="text-xs font-bold w-full text-center truncate">{titulo}</p>
      <p className="text-[10px] opacity-70 w-full text-center mb-2">
        {ans.numero_ans}
      </p>
      <span className="font-bb-titulos text-4xl font-bold leading-none">
        {isLoading ? "…" : pct === null ? "—" : `${pct}%`}
      </span>
      <span className="text-[11px] mt-1 opacity-80">de conformidade</span>
    </button>
  )
}

export function AnsKpiCards({
  ansList,
  selectedAnsSysId,
  onSelectAns,
}: AnsKpiCardsProps) {
  if (ansList.length === 0) return null

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-sm font-bold text-text-blue mb-3">ANS Vigentes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ansList.map((ans) => (
          <AnsCard
            key={ans.sys_id}
            ans={ans}
            isSelected={ans.sys_id === selectedAnsSysId}
            onSelect={onSelectAns}
          />
        ))}
      </div>
    </section>
  )
}
