import type { Ans } from "../types/portal"

interface AnsKpiCardsProps {
  ansList: Ans[]
  selectedAnsSysId: string | null
  onSelectAns: (sysId: string) => void
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
        {ansList.map((ans) => {
          const isSelected = ans.sys_id === selectedAnsSysId
          const titulo = ans.apelido?.trim() || ans.servico
          const temPct =
            ans.conformidade !== null && ans.conformidade !== undefined

          const cardClasses = isSelected
            ? "bg-[#1E3A5F] text-white shadow-md border-2 border-[#1E3A5F]"
            : "bg-[#E5E7EB] text-[#374151] border-2 border-transparent hover:bg-[#D1D5DB]"

          return (
            <button
              key={ans.sys_id}
              type="button"
              onClick={() => onSelectAns(ans.sys_id)}
              className={`${cardClasses} rounded-xl p-5 text-left transition-colors cursor-pointer flex flex-col items-center`}
            >
              <p className="text-xs font-bold w-full text-center truncate">
                {titulo}
              </p>
              <p className="text-[10px] opacity-70 w-full text-center mb-2">
                {ans.numero_ans}
              </p>
              <span className="font-bb-titulos text-4xl font-bold leading-none">
                {temPct ? `${ans.conformidade}%` : "—"}
              </span>
              <span className="text-[11px] mt-1 opacity-80">
                de conformidade
              </span>
              {ans.conformidade_total !== undefined && (
                <span className="text-[10px] mt-0.5 opacity-60">
                  {ans.conformidade_conformes ?? 0} de {ans.conformidade_total}{" "}
                  conformes
                </span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
