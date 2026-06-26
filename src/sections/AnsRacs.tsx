import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
} from "lucide-react"
import { useState } from "react"
import { HintCard } from "../components/HintCard"
import { useRacsDoAns } from "../hooks/usePortal"
import type { Ans } from "../types/portal"
import {
  normalizeResultado,
  resultadoBadgeClasses,
  resultadoLabels,
} from "../utils/conformidade"
import { toStringArray } from "../utils/normalize"

interface AnsRacsProps {
  ans: Ans
  selectedRacSysId: string | null
  onSelectRac: (racSysId: string) => void
}

const PAGE_SIZE = 6

function formatVigencia(ans: Ans): string | null {
  if (!ans.opened_at) return null
  const inicio = ans.opened_at.slice(0, 10)
  const fim = ans.closed_at ? ans.closed_at.slice(0, 10) : "—"
  return `${inicio} a ${fim}`
}

export function AnsRacs({ ans, selectedRacSysId, onSelectRac }: AnsRacsProps) {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError, error } = useRacsDoAns(ans.sys_id)

  const titulo = ans.apelido?.trim() || ans.servico
  const vigencia = formatVigencia(ans)
  const ofertas = toStringArray(ans.ofertas)

  const racs = Array.isArray(data?.result) ? data.result : []
  const totalPages = Math.ceil(racs.length / PAGE_SIZE)
  const paginated = racs.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-3">
        <h2 className="text-base font-bold text-text-blue">
          Acompanhamento do ANS
        </h2>
        <p className="text-xs text-soft mt-0.5">
          Resultado mensal (RAC) do ANS, do mês mais recente para o mais antigo.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 text-text-blue text-xs rounded-md px-3 py-2 mb-3 flex items-center gap-2">
        <Info size={14} className="text-brand-blue shrink-0" />
        Cada linha é um RAC (mês). Clique em "Visualizar" para ver os indicadores
        (RCOs) daquele período.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Card detalhes do ANS */}
        <div className="bg-neutral rounded-lg p-4 space-y-3">
          <h3 className="font-bold text-text-blue text-base">{titulo}</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-soft">Número ANS:</span>{" "}
              <span className="text-text-black">{ans.numero_ans}</span>
            </div>
            {vigencia && (
              <div>
                <span className="font-medium text-soft">Vigência:</span>{" "}
                <span className="text-text-black">{vigencia}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-soft">Serviço:</span>{" "}
              <span className="text-text-black">{ans.servico}</span>
            </div>
            {ofertas.length > 0 && (
              <div>
                <span className="font-medium text-soft">Ofertas:</span>
                <ul className="mt-1 space-y-1">
                  {ofertas.map((oferta) => (
                    <li
                      key={oferta}
                      className="text-text-black pl-3 before:content-['•'] before:mr-2 before:text-brand-blue"
                    >
                      {oferta}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tabela de RACs (meses) */}
        <div className="lg:col-span-2">
          {isLoading && (
            <p className="text-sm text-soft py-6 text-center">
              Carregando acompanhamento…
            </p>
          )}

          {isError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle size={16} className="text-danger mt-0.5 shrink-0" />
              <p className="text-sm text-red-800">
                {error?.message ?? "Erro ao carregar os RACs."}
              </p>
            </div>
          )}

          {!isLoading && !isError && racs.length === 0 && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <Info size={16} className="text-brand-blue mt-0.5 shrink-0" />
              <p className="text-sm text-text-blue">
                {data?.aviso ?? "Nenhum acompanhamento (RAC) para este ANS."}
              </p>
            </div>
          )}

          {!isLoading && !isError && racs.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-bg-blue text-white">
                      <th className="text-left px-4 py-2 rounded-tl-lg">
                        Período
                      </th>
                      <th className="text-left px-4 py-2">Resultado</th>
                      <th className="text-left px-4 py-2">Qtd. Indicadores</th>
                      <th className="px-4 py-2 rounded-tr-lg w-px" />
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((rac) => {
                      const status = normalizeResultado(rac.resultado)
                      const isSelected = rac.sys_id === selectedRacSysId
                      return (
                        <tr
                          key={rac.sys_id}
                          onClick={() => onSelectRac(rac.sys_id)}
                          className={[
                            "cursor-pointer border-b border-border transition-colors",
                            isSelected ? "bg-secondary" : "hover:bg-neutral",
                          ].join(" ")}
                        >
                          <td className="px-4 py-2 font-medium">
                            {rac.periodo_label}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${resultadoBadgeClasses[status]}`}
                            >
                              {resultadoLabels[status]}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-soft text-xs">
                            {String(rac.total_indicadores).padStart(2, "0")}
                          </td>
                          <td className="px-4 py-2 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onSelectRac(rac.sys_id)
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

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-3 px-2">
                  <span className="text-xs text-soft">
                    Página {page + 1} de {totalPages}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setPage((pg) => Math.max(0, pg - 1))}
                      disabled={page === 0}
                      className="p-1 rounded hover:bg-neutral disabled:opacity-30 cursor-pointer disabled:cursor-default"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPage((pg) => Math.min(totalPages - 1, pg + 1))
                      }
                      disabled={page === totalPages - 1}
                      className="p-1 rounded hover:bg-neutral disabled:opacity-30 cursor-pointer disabled:cursor-default"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Card lateral de Dica */}
        <HintCard variant="dica" title="Dica">
          Clique em "Visualizar" num período para ver os indicadores (RCOs)
          daquele mês e, em seguida, em um indicador para abrir o histórico.
        </HintCard>
      </div>
    </section>
  )
}
