import { AlertTriangle, Info } from "lucide-react"
import { HintCard } from "../components/HintCard"
import { useRcosDoRac } from "../hooks/usePortal"
import {
  normalizeResultado,
  resultadoBadgeClasses,
  resultadoLabels,
} from "../utils/conformidade"

interface RacRcosProps {
  racSysId: string
  ansNome: string
  selectedRcoSysId: string | null
  onSelectRco: (rcoSysId: string) => void
}

export function RacRcos({
  racSysId,
  ansNome,
  selectedRcoSysId,
  onSelectRco,
}: RacRcosProps) {
  const { data, isLoading, isError, error } = useRcosDoRac(racSysId)

  const rcos = Array.isArray(data?.result) ? data.result : []
  const periodoLabel = data?.periodo_label ?? ""
  const consolidado = normalizeResultado(data?.resultado)
  const total = data?.total_indicadores ?? rcos.length
  const foraMeta =
    data?.fora_da_meta ??
    rcos.filter((r) => normalizeResultado(r.resultado) !== "conformidade").length

  const selecionado = rcos.find((r) => r.sys_id === selectedRcoSysId)

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-3">
          {/* Breadcrumb */}
          <nav className="text-xs text-brand-blue">
            ANS &gt; {ansNome} &gt; {periodoLabel}
          </nav>

          {/* Header com título e badge consolidado */}
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-text-blue">
              Indicadores do período: {periodoLabel}
            </h2>
            {!isLoading && !isError && rcos.length > 0 && (
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${resultadoBadgeClasses[consolidado]}`}
              >
                {resultadoLabels[consolidado]}
              </span>
            )}
          </div>
          {!isLoading && !isError && rcos.length > 0 && (
            <p className="text-xs text-soft -mt-1">
              {foraMeta} de {total} indicadores fora da meta
            </p>
          )}

          {isLoading && (
            <p className="text-sm text-soft py-6 text-center">
              Carregando indicadores do período…
            </p>
          )}

          {isError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle size={16} className="text-danger mt-0.5 shrink-0" />
              <p className="text-sm text-red-800">
                {error?.message ?? "Erro ao carregar os indicadores do período."}
              </p>
            </div>
          )}

          {!isLoading && !isError && rcos.length === 0 && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <Info size={16} className="text-brand-blue mt-0.5 shrink-0" />
              <p className="text-sm text-text-blue">
                {data?.aviso ?? "Nenhum indicador apurado neste período."}
              </p>
            </div>
          )}

          {!isLoading && !isError && rcos.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-text-zinc text-white">
                    <th className="text-left px-3 py-2">RCO</th>
                    <th className="text-left px-3 py-2">Nome</th>
                    <th className="text-left px-3 py-2">Tipo</th>
                    <th className="text-left px-3 py-2">Direcao</th>
                    <th className="text-right px-3 py-2">Meta</th>
                    <th className="text-right px-3 py-2">Apurado</th>
                    <th className="text-center px-3 py-2">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {rcos.map((rco) => {
                    const status = normalizeResultado(rco.resultado)
                    const isSelected =
                      rco.sys_id === selectedRcoSysId &&
                      selectedRcoSysId !== null
                    return (
                      <tr
                        key={rco.sys_id}
                        onClick={() => onSelectRco(rco.sys_id)}
                        className={[
                          "cursor-pointer border-b border-border transition-colors",
                          isSelected ? "bg-secondary" : "hover:bg-neutral",
                        ].join(" ")}
                      >
                        <td className="px-3 py-2 font-mono text-xs text-brand-blue">
                          {rco.rco_id}
                        </td>
                        <td className="px-3 py-2">{rco.nome_indicador ?? "—"}</td>
                        <td className="px-3 py-2 text-soft">
                          {rco.tipo ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-soft">
                          {rco.direcao ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {rco.meta ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {rco.apurado ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${resultadoBadgeClasses[status]}`}
                          >
                            {resultadoLabels[status]}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Motivo do RCO selecionado */}
          {selecionado?.motivo && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-800 mb-1">
                  Motivo ({selecionado.rco_id})
                </p>
                <p className="text-sm text-amber-900">{selecionado.motivo}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card lateral Próximos passos */}
        <HintCard variant="passos" title="Próximos passos">
          <ol className="space-y-3">
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-brand-blue text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <span>
                Selecione um indicador (RCO) para ver o histórico de apuração.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-brand-blue text-white text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              <span>Analise o gráfico e os detalhes do registro.</span>
            </li>
          </ol>
        </HintCard>
      </div>
    </section>
  )
}
