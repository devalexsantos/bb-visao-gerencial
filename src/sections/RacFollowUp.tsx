import { useState } from "react"
import { ChevronLeft, ChevronRight, Eye, Info } from "lucide-react"
import { HintCard } from "../components/HintCard"
import type { Ans, Rac } from "../types/ans"

interface RacFollowUpProps {
  ans: Ans
  selectedRacId: string | null
  onSelectRac: (racId: string) => void
}

const PAGE_SIZE = 6

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

export function RacFollowUp({ ans, selectedRacId, onSelectRac }: RacFollowUpProps) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(ans.racs.length / PAGE_SIZE)
  const paginatedRacs = ans.racs.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-3">
        <h2 className="text-base font-bold text-text-blue">Acompanhamento do ANS</h2>
        <p className="text-xs text-soft mt-0.5">
          Selecione um periodo para explorar os indicadores detalhados.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 text-text-blue text-xs rounded-md px-3 py-2 mb-3 flex items-center gap-2">
        <Info size={14} className="text-brand-blue shrink-0" />
        Cada linha mostra o resultado geral do periodo. Clique para ver os indicadores.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Card detalhes do ANS */}
        <div className="bg-neutral rounded-lg p-4 space-y-3">
          <h3 className="font-bold text-text-blue text-base">{ans.nome}</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-soft">Vigencia:</span>{" "}
              <span className="text-text-black">{ans.vigenciaInicio} a {ans.vigenciaFim}</span>
            </div>
            <div>
              <span className="font-medium text-soft">Servico:</span>{" "}
              <span className="text-text-black">{ans.servico}</span>
            </div>
            <div>
              <span className="font-medium text-soft">Ofertas:</span>
              <ul className="mt-1 space-y-1">
                {ans.ofertas.map((oferta) => (
                  <li key={oferta} className="text-text-black pl-3 before:content-['•'] before:mr-2 before:text-brand-blue">
                    {oferta}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tabela RACs */}
        <div className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-bg-blue text-white">
                  <th className="text-left px-4 py-2 rounded-tl-lg">Periodo</th>
                  <th className="text-left px-4 py-2">Resultado</th>
                  <th className="px-4 py-2 rounded-tr-lg w-px"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedRacs.map((rac) => {
                  const isSelected = rac.id === selectedRacId
                  return (
                    <tr
                      key={rac.id}
                      onClick={() => onSelectRac(rac.id)}
                      className={[
                        "cursor-pointer border-b border-border transition-colors",
                        isSelected ? "bg-secondary" : "hover:bg-neutral",
                      ].join(" ")}
                    >
                      <td className="px-4 py-2 font-medium">{rac.periodo}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[rac.conformidade]}`}>
                          {statusLabels[rac.conformidade]}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectRac(rac.id)
                          }}
                          className="inline-flex items-center gap-1.5 border border-brand-blue text-brand-blue text-xs font-medium rounded-md px-2.5 py-1 hover:bg-brand-blue hover:text-white transition-colors cursor-pointer"
                        >
                          <Eye size={14} /> Visualizar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Paginacao */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 px-2">
              <span className="text-xs text-soft">
                Pagina {page + 1} de {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1 rounded hover:bg-neutral disabled:opacity-30 cursor-pointer disabled:cursor-default"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="p-1 rounded hover:bg-neutral disabled:opacity-30 cursor-pointer disabled:cursor-default"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card lateral de Dica */}
        <HintCard variant="dica" title="Dica">
          Clique em um periodo para ver os indicadores detalhados e, em seguida,
          em um indicador para abrir o historico de apuracao.
        </HintCard>
      </div>
    </section>
  )
}
