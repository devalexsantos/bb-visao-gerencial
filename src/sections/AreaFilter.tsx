import { AlertTriangle } from "lucide-react"
import { Select } from "../components/ui/Select"
import { useAreas } from "../hooks/usePortal"

interface AreaFilterProps {
  selectedArea: string | null
  onAreaChange: (area: string) => void
}

export function AreaFilter({ selectedArea, onAreaChange }: AreaFilterProps) {
  const areasQuery = useAreas()
  const options = areasQuery.data ?? []

  const placeholder = areasQuery.isLoading
    ? "Carregando areas…"
    : "Selecione uma area"

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-bold text-text-blue whitespace-nowrap">
          Area:
        </label>
        <div className="w-64">
          <Select
            options={options}
            placeholder={placeholder}
            value={selectedArea ?? undefined}
            onValueChange={onAreaChange}
          />
        </div>
      </div>

      {areasQuery.isError && (
        <div className="flex items-start gap-2 p-3 mt-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle size={16} className="text-danger mt-0.5 shrink-0" />
          <p className="text-sm text-red-800">
            {areasQuery.error?.message ?? "Erro ao carregar as areas."}
          </p>
        </div>
      )}

      {!areasQuery.isLoading && !areasQuery.isError && options.length === 0 && (
        <p className="text-sm text-soft mt-3">Nenhuma area encontrada.</p>
      )}
    </section>
  )
}
