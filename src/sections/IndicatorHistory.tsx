import { AlertTriangle, ChevronLeft, ChevronRight, Undo2 } from "lucide-react"
import { useState } from "react"
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
import { useApuracoes, useHistoricoApuracao } from "../hooks/usePortal"
import type { ApuracaoPonto, IndicadorHeader } from "../types/portal"
import { conformeToStatus, statusBarColor } from "../utils/conformidade"

interface IndicatorHistoryProps {
  indicadorSysId: string
}

const PAGE_SIZE = 6
const MESES = Number(import.meta.env.VITE_HISTORICO_MESES) || 6

export function IndicatorHistory({ indicadorSysId }: IndicatorHistoryProps) {
  const [page, setPage] = useState(0)
  const [apuracaoSel, setApuracaoSel] = useState<string | null>(null)

  const apuracoesQuery = useApuracoes(indicadorSysId)
  const historicoQuery = useHistoricoApuracao(apuracaoSel, MESES)

  // Em modo "janela", mostra o histórico a partir da apuração clicada.
  const emJanela = !!apuracaoSel
  const header: IndicadorHeader | undefined = emJanela
    ? historicoQuery.data?.indicador
    : apuracoesQuery.data?.indicador
  const serie: ApuracaoPonto[] = emJanela
    ? (historicoQuery.data?.result ?? [])
    : (apuracoesQuery.data?.result ?? [])

  const isLoading = emJanela
    ? historicoQuery.isLoading
    : apuracoesQuery.isLoading
  const isError = apuracoesQuery.isError || historicoQuery.isError

  if (isError) {
    return (
      <section className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle size={16} className="text-danger mt-0.5 shrink-0" />
          <p className="text-sm text-red-800">
            {(apuracoesQuery.error ?? historicoQuery.error)?.message ??
              "Erro ao carregar as apuracoes."}
          </p>
        </div>
      </section>
    )
  }

  if (isLoading || !header) {
    return (
      <section className="bg-white rounded-lg shadow-sm p-4">
        <p className="text-sm text-soft py-6 text-center">
          Carregando apuracoes…
        </p>
      </section>
    )
  }

  const metaLinha = Number(header.meta) || serie.at(-1)?.meta || 0
  const totalPages = Math.ceil(serie.length / PAGE_SIZE)
  // No modo janela a série já é curta; mostra tudo. No modo completo, pagina.
  const paginatedData = emJanela
    ? serie
    : serie.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const valores = serie.flatMap((h) => [h.apurado ?? 0, h.meta ?? 0])
  const yMax = Math.ceil(Math.max(...valores, metaLinha) * 1.2) || 1

  function handleBarClick(entry: ApuracaoPonto) {
    setApuracaoSel(entry.sys_id || entry.number)
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-text-blue">
          {emJanela
            ? `Historico de Apuracao (ultimos ${MESES} meses)`
            : "Historico de Apuracao"}
        </h2>
        {emJanela && (
          <button
            type="button"
            onClick={() => setApuracaoSel(null)}
            className="inline-flex items-center gap-1.5 border border-brand-blue text-brand-blue text-xs font-medium rounded-md px-2.5 py-1 hover:bg-brand-blue hover:text-white transition-colors cursor-pointer"
          >
            <Undo2 size={14} /> Ver serie completa
          </button>
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
            data={paginatedData}
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
            <Bar
              dataKey="apurado"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
              className="cursor-pointer"
              onClick={(data) => handleBarClick(data as unknown as ApuracaoPonto)}
            >
              {paginatedData.map((entry) => {
                const status = conformeToStatus(entry.conforme)
                const destacada = emJanela && entry.selecionada
                return (
                  <Cell
                    key={entry.sys_id || entry.number}
                    fill={statusBarColor[status]}
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
        {!emJanela && (
          <p className="text-[11px] text-soft mt-2 text-center">
            Clique em uma barra para ver o historico dos ultimos {MESES} meses
            daquele periodo.
          </p>
        )}
      </div>

      {/* Paginacao (apenas na serie completa) */}
      {!emJanela && totalPages > 1 && (
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
    </section>
  )
}
