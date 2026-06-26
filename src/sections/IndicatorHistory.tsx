import { AlertTriangle } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useHistoricoDoRco } from "../hooks/usePortal"
import { pontoResultado, resultadoBarColor } from "../utils/conformidade"

interface IndicatorHistoryProps {
  rcoSysId: string
}

const MESES = Number(import.meta.env.VITE_HISTORICO_MESES) || 6

export function IndicatorHistory({ rcoSysId }: IndicatorHistoryProps) {
  const { data, isLoading, isError, error } = useHistoricoDoRco(rcoSysId, MESES)

  if (isError) {
    return (
      <section className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle size={16} className="text-danger mt-0.5 shrink-0" />
          <p className="text-sm text-red-800">
            {error?.message ?? "Erro ao carregar o histórico."}
          </p>
        </div>
      </section>
    )
  }

  if (isLoading || !data?.indicador) {
    return (
      <section className="bg-white rounded-lg shadow-sm p-4">
        <p className="text-sm text-soft py-6 text-center">
          Carregando histórico…
        </p>
      </section>
    )
  }

  const header = data.indicador
  const rco = data.rco
  const serie = Array.isArray(data.result) ? data.result : []

  const metaLinha = Number(header.meta) || serie.at(-1)?.meta || 0
  const valores = serie.flatMap((h) => [h.apurado ?? 0, h.meta ?? 0])
  const yMax = Math.ceil(Math.max(...valores, metaLinha) * 1.2) || 1

  // Detalhes textuais do RCO (só os preenchidos).
  const detalhesRco: { label: string; value: string }[] = [
    { label: "Motivo", value: rco?.motivo ?? "" },
    { label: "Ações preventivas", value: rco?.acoes_preventivas ?? "" },
    { label: "Parecer do aprovador", value: rco?.parecer_do_aprovador ?? "" },
    { label: "Situação", value: rco?.situacao ?? "" },
    { label: "Reiterações", value: rco?.reiteracoes ?? "" },
    { label: "Data de resposta", value: rco?.data_de_resposta ?? "" },
  ].filter((d) => d.value && d.value.trim() !== "")

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-text-blue">
          Histórico de Apuração (últimos {data.meses ?? MESES} meses)
        </h2>
        {rco?.id && (
          <span className="text-xs font-mono text-soft">RCO {rco.id}</span>
        )}
      </div>

      {/* Info do indicador */}
      <div className="bg-neutral rounded-lg p-3 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div>
          <span className="text-soft text-xs">Indicador</span>
          <p className="font-medium">{header.nome_indicador}</p>
        </div>
        <div>
          <span className="text-soft text-xs">ID</span>
          <p className="font-mono text-xs">{header.number}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Servico</span>
          <p className="font-medium">{header.servico}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Oferta de Servico</span>
          <p className="font-medium">{header.oferta_de_servico}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Meta</span>
          <p className="font-mono font-bold">{header.meta}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Periodicidade</span>
          <p className="font-medium">{header.periodicidade}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Direcao</span>
          <p className="font-medium">{header.direcao}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Unidade de Medida</span>
          <p className="font-medium">{header.unidade_de_medida}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Tipo</span>
          <p className="font-medium">{header.tipo}</p>
        </div>
      </div>

      {/* Grafico */}
      <div className="bg-white border border-border rounded-lg p-4">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={serie}
            margin={{ top: 30, right: 20, left: 20, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="periodo_label"
              tick={{ fill: "#374151", fontSize: 11 }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              domain={[0, yMax]}
              tick={{ fill: "#374151", fontSize: 11 }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                color: "#111214",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "#374151", fontWeight: 600 }}
              itemStyle={{ color: "#111214" }}
            />
            <ReferenceLine
              y={metaLinha}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="6 3"
              label={{
                value: `Meta: ${header.meta}`,
                fill: "#b45309",
                fontSize: 11,
                position: "right",
              }}
            />
            <Bar dataKey="apurado" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {serie.map((entry) => {
                const status = pontoResultado(entry)
                const destacada = entry.selecionada
                return (
                  <Cell
                    key={entry.rco_id}
                    fill={resultadoBarColor[status]}
                    fillOpacity={destacada ? 1 : 0.8}
                    stroke={destacada ? "#1E3A5F" : undefined}
                    strokeWidth={destacada ? 2 : 0}
                  />
                )
              })}
              <LabelList
                dataKey="apurado"
                position="top"
                fill="#111214"
                fontSize={11}
                fontWeight={600}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detalhe do RCO selecionado */}
      {detalhesRco.length > 0 && (
        <div className="mt-4 bg-neutral rounded-lg p-4">
          <h3 className="text-sm font-bold text-text-blue mb-3">
            Detalhe do registro (RCO {rco?.id})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {detalhesRco.map((d) => (
              <div key={d.label}>
                <span className="text-soft text-xs">{d.label}</span>
                <p className="text-text-black whitespace-pre-wrap">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
