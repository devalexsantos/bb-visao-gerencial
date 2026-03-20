import { AlertTriangle } from "lucide-react"
import type { Indicador, Rac } from "../types/ans"

interface RcoDetailProps {
  rac: Rac
  selectedIndicadorId: string | null
  onSelectIndicador: (indicadorId: string) => void
}

const statusColors: Record<Rac["conformidade"], string> = {
  conformidade: "bg-success text-white",
  nao_conformidade: "bg-danger text-white",
  indicio: "bg-warning text-text-black",
}

const statusLabels: Record<Rac["conformidade"], string> = {
  conformidade: "Conformidade",
  nao_conformidade: "Nao Conformidade",
  indicio: "Indicio",
}

const direcaoLabels: Record<Indicador["direcao"], string> = {
  ascendente: "Ascendente",
  descendente: "Descendente",
  bidirecional: "Bidirecional",
}

export function RcoDetail({
  rac,
  selectedIndicadorId,
  onSelectIndicador,
}: RcoDetailProps) {
  const selectedIndicador = rac.indicadores.find((i) => i.id === selectedIndicadorId)

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      {/* Header com periodo e resultado */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-bold text-text-blue">Periodo: {rac.periodo} — Resultado:</h2>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[rac.conformidade]}`}>
          {statusLabels[rac.conformidade]}
        </span>
      </div>

      {/* Tabela de indicadores (RCOs) */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-text-zinc text-white">
              <th className="text-left px-3 py-2">ID RCO</th>
              <th className="text-left px-3 py-2">ID Indicador</th>
              <th className="text-left px-3 py-2">Nome</th>
              <th className="text-left px-3 py-2">Direcao</th>
              <th className="text-right px-3 py-2">Meta</th>
              <th className="text-right px-3 py-2">Apurado</th>
              <th className="text-center px-3 py-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {rac.indicadores.map((ind) => {
              const isSelected = ind.id === selectedIndicadorId
              return (
                <tr
                  key={ind.id}
                  onClick={() => onSelectIndicador(ind.id)}
                  className={[
                    "cursor-pointer border-b border-border transition-colors",
                    isSelected ? "bg-secondary" : "hover:bg-neutral",
                  ].join(" ")}
                >
                  <td className="px-3 py-2 font-mono text-xs">{ind.idRco}</td>
                  <td className="px-3 py-2 font-mono text-xs">{ind.idIndicador}</td>
                  <td className="px-3 py-2">{ind.nome}</td>
                  <td className="px-3 py-2 text-soft">{direcaoLabels[ind.direcao]}</td>
                  <td className="px-3 py-2 text-right font-mono">{ind.meta}</td>
                  <td className="px-3 py-2 text-right font-mono">{ind.apurado}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ind.resultado]}`}>
                      {statusLabels[ind.resultado]}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Justificativa */}
      {selectedIndicador?.justificativa && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-800 mb-1">Justificativa</p>
            <p className="text-sm text-amber-900">{selectedIndicador.justificativa}</p>
          </div>
        </div>
      )}
    </section>
  )
}
