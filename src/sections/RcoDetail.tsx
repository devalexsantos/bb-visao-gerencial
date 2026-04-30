import { AlertTriangle, Download } from "lucide-react"
import { HintCard } from "../components/HintCard"
import type { Indicador, Rac } from "../types/ans"

interface RcoDetailProps {
  rac: Rac
  ansNome: string
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
  ansNome,
  selectedIndicadorId,
  onSelectIndicador,
}: RcoDetailProps) {
  const selectedIndicador = rac.indicadores.find((i) => i.id === selectedIndicadorId)
  const total = rac.indicadores.length
  const foraMeta = rac.indicadores.filter((i) => i.resultado !== "conformidade").length

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Coluna principal */}
        <div className="lg:col-span-3 space-y-3">
          {/* Breadcrumb */}
          <nav className="text-xs text-brand-blue">
            ANS &gt; {ansNome} &gt; {rac.periodo}
          </nav>

          {/* Header com titulo, badge e exportar */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg font-bold text-text-blue">
                  Indicadores do periodo: {rac.periodo}
                </h2>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[rac.conformidade]}`}
                >
                  {statusLabels[rac.conformidade]}
                </span>
              </div>
              <p className="text-xs text-soft mt-1">
                {foraMeta} de {total} indicadores fora da meta
              </p>
            </div>
            <button
              type="button"
              className="text-sm border border-border rounded-md px-3 py-1.5 flex items-center gap-1.5 hover:bg-neutral cursor-pointer text-text-blue"
            >
              <Download size={14} /> Exportar
            </button>
          </div>

          {/* Tabela de indicadores */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-text-zinc text-white">
                  <th className="text-left px-3 py-2">Nome</th>
                  <th className="text-left px-3 py-2">Tipo</th>
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
                      <td className="px-3 py-2">{ind.nome}</td>
                      <td className="px-3 py-2 text-soft">{ind.tipo}</td>
                      <td className="px-3 py-2 text-soft">{direcaoLabels[ind.direcao]}</td>
                      <td className="px-3 py-2 text-right font-mono">{ind.meta}</td>
                      <td className="px-3 py-2 text-right font-mono">{ind.apurado}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ind.resultado]}`}
                        >
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
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-800 mb-1">Justificativa</p>
                <p className="text-sm text-amber-900">{selectedIndicador.justificativa}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card lateral Proximos passos */}
        <HintCard variant="passos" title="Proximos passos">
          <ol className="space-y-3">
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-brand-blue text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <span>Selecione um indicador para ver o historico de apuracao.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-brand-blue text-white text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              <span>Analise o grafico e os detalhes de cada apuracao.</span>
            </li>
          </ol>
        </HintCard>
      </div>
    </section>
  )
}
