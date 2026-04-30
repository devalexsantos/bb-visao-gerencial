import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  LabelList,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts"
import type { Indicador } from "../types/ans"

interface IndicatorHistoryProps {
  indicador: Indicador
}

const PAGE_SIZE = 6

const direcaoLabels: Record<Indicador["direcao"], string> = {
  ascendente: "Ascendente",
  descendente: "Descendente",
  bidirecional: "Bidirecional",
}

function getBarColor(
  apurado: number,
  meta: number,
  direcao: Indicador["direcao"],
): string {
  if (direcao === "bidirecional") {
    const diff = Math.abs(apurado - meta)
    return diff <= meta * 0.1 ? "#4ADE80" : "#F87171"
  }
  if (direcao === "ascendente") return apurado >= meta ? "#4ADE80" : "#F87171"
  return apurado <= meta ? "#4ADE80" : "#F87171"
}

export function IndicatorHistory({ indicador }: IndicatorHistoryProps) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(indicador.historico.length / PAGE_SIZE)
  const paginatedData = indicador.historico.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const maxValue = Math.max(
    ...indicador.historico.map((h) => Math.max(h.apurado, h.meta)),
  )
  const yMax = Math.ceil(maxValue * 1.2)

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-sm font-bold text-text-blue mb-4">Historico de Apuracao</h2>

      {/* Info do indicador */}
      <div className="bg-neutral rounded-lg p-3 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div>
          <span className="text-soft text-xs">Indicador</span>
          <p className="font-medium">{indicador.nome}</p>
        </div>
        <div>
          <span className="text-soft text-xs">ID</span>
          <p className="font-mono text-xs">{indicador.idIndicador}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Servico</span>
          <p className="font-medium">{indicador.servico}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Oferta de Servico</span>
          <p className="font-medium">{indicador.ofertaServico}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Meta</span>
          <p className="font-mono font-bold">{indicador.meta}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Periodicidade</span>
          <p className="font-medium">{indicador.periodicidade}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Direcao</span>
          <p className="font-medium">{direcaoLabels[indicador.direcao]}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Responsavel pela apuracao</span>
          <p className="font-mono text-xs">{indicador.responsavelApuracao}</p>
        </div>
        <div>
          <span className="text-soft text-xs">Responsavel pela performance</span>
          <p className="font-mono text-xs">{indicador.responsavelPerformance}</p>
        </div>
      </div>

      {/* Grafico */}
      <div className="bg-white border border-border rounded-lg p-4">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={paginatedData} margin={{ top: 30, right: 20, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="periodo"
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
              y={indicador.meta}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="6 3"
              label={{
                value: `Meta: ${indicador.meta}`,
                fill: "#b45309",
                fontSize: 11,
                position: "right",
              }}
            />
            <Bar dataKey="apurado" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {paginatedData.map((entry, index) => {
                const isCurrent = index === paginatedData.length - 1
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.apurado, entry.meta, indicador.direcao)}
                    fillOpacity={isCurrent ? 1.0 : 0.7}
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
    </section>
  )
}
