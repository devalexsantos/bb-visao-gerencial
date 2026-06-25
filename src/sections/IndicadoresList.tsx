import { AlertTriangle, Info } from "lucide-react"
import { HintCard } from "../components/HintCard"
import type { Ans, IndicadorDoAns } from "../types/portal"
import { toStringArray } from "../utils/normalize"

interface IndicadoresListProps {
  ans: Ans
  indicadores: IndicadorDoAns[]
  aviso?: string
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  selectedIndicadorSysId: string | null
  onSelectIndicador: (sysId: string) => void
}

function formatVigencia(ans: Ans): string | null {
  if (!ans.opened_at) return null
  const inicio = ans.opened_at.slice(0, 10)
  const fim = ans.closed_at ? ans.closed_at.slice(0, 10) : "—"
  return `${inicio} a ${fim}`
}

export function IndicadoresList({
  ans,
  indicadores,
  aviso,
  isLoading,
  isError,
  errorMessage,
  selectedIndicadorSysId,
  onSelectIndicador,
}: IndicadoresListProps) {
  const titulo = ans.apelido?.trim() || ans.servico
  const vigencia = formatVigencia(ans)
  const ofertas = toStringArray(ans.ofertas)

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-3">
        <h2 className="text-base font-bold text-text-blue">
          Indicadores do ANS
        </h2>
        <p className="text-xs text-soft mt-0.5">
          Selecione um indicador para ver o historico de apuracao.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Card detalhes do ANS */}
        <div className="bg-neutral rounded-lg p-4 space-y-3">
          <h3 className="font-bold text-text-blue text-base">{titulo}</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-soft">Numero ANS:</span>{" "}
              <span className="text-text-black">{ans.numero_ans}</span>
            </div>
            {vigencia && (
              <div>
                <span className="font-medium text-soft">Vigencia:</span>{" "}
                <span className="text-text-black">{vigencia}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-soft">Servico:</span>{" "}
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

        {/* Tabela de indicadores */}
        <div className="lg:col-span-2">
          {isLoading && (
            <p className="text-sm text-soft py-6 text-center">
              Carregando indicadores…
            </p>
          )}

          {isError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle size={16} className="text-danger mt-0.5 shrink-0" />
              <p className="text-sm text-red-800">
                {errorMessage ?? "Erro ao carregar os indicadores."}
              </p>
            </div>
          )}

          {!isLoading && !isError && indicadores.length === 0 && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <Info size={16} className="text-brand-blue mt-0.5 shrink-0" />
              <p className="text-sm text-text-blue">
                {aviso ?? "Nenhum indicador vinculado a este ANS."}
              </p>
            </div>
          )}

          {!isLoading && !isError && indicadores.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-text-zinc text-white">
                    <th className="text-left px-3 py-2">Nome</th>
                    <th className="text-left px-3 py-2">Tipo</th>
                    <th className="text-left px-3 py-2">Direcao</th>
                    <th className="text-right px-3 py-2">Meta</th>
                    <th className="text-left px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {indicadores.map((ind) => {
                    const isSelected = ind.sys_id === selectedIndicadorSysId
                    return (
                      <tr
                        key={ind.sys_id}
                        onClick={() => onSelectIndicador(ind.sys_id)}
                        className={[
                          "cursor-pointer border-b border-border transition-colors",
                          isSelected ? "bg-secondary" : "hover:bg-neutral",
                        ].join(" ")}
                      >
                        <td className="px-3 py-2">{ind.nome_indicador}</td>
                        <td className="px-3 py-2 text-soft">{ind.tipo}</td>
                        <td className="px-3 py-2 text-soft">{ind.direcao}</td>
                        <td className="px-3 py-2 text-right font-mono">
                          {ind.nivel_ofertado}
                        </td>
                        <td className="px-3 py-2 text-soft">{ind.status}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Card lateral de Dica */}
        <HintCard variant="dica" title="Dica">
          Clique em um indicador para abrir o grafico com a serie de apuracoes e,
          em seguida, em uma barra para ver o historico daquele periodo.
        </HintCard>
      </div>
    </section>
  )
}
