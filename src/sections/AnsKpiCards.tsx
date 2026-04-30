import type { Ans } from "../types/ans"

interface AnsKpiCardsProps {
  ansList: Ans[]
  selectedAnsId: string | null
  onSelectAns: (ansId: string) => void
}

function calcularConformidade(ans: Ans): number {
  if (ans.racs.length === 0) return 0
  const emConformidade = ans.racs.filter((r) => r.conformidade === "conformidade").length
  return Math.round((emConformidade / ans.racs.length) * 100)
}

export function AnsKpiCards({ ansList, selectedAnsId, onSelectAns }: AnsKpiCardsProps) {
  if (ansList.length === 0) return null

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-sm font-bold text-text-blue mb-3">ANS Vigentes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ansList.map((ans) => {
          const isSelected = ans.id === selectedAnsId
          const pct = calcularConformidade(ans)

          const cardClasses = isSelected
            ? "bg-[#1E3A5F] text-white shadow-md border-2 border-[#1E3A5F]"
            : "bg-[#E5E7EB] text-[#374151] border-2 border-transparent hover:bg-[#D1D5DB]"

          return (
            <button
              key={ans.id}
              type="button"
              onClick={() => onSelectAns(ans.id)}
              className={`${cardClasses} rounded-xl p-5 text-left transition-colors cursor-pointer flex flex-col items-center`}
            >
              <p className="text-xs font-bold w-full text-center truncate">{ans.nome}</p>
              <p className="text-[10px] opacity-70 w-full text-center mb-2">{ans.id}</p>
              <span className="font-bb-titulos text-4xl font-bold leading-none">
                {pct}%
              </span>
              <span className="text-[11px] mt-1 opacity-80">de conformidade</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
