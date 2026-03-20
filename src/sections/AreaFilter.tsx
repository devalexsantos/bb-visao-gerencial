import { Select } from "../components/ui/Select"
import { areas } from "../mocks/data"

interface AreaFilterProps {
  selectedArea: string | null
  onAreaChange: (areaId: string) => void
}

export function AreaFilter({ selectedArea, onAreaChange }: AreaFilterProps) {
  const options = areas.map((a) => ({ value: a.id, label: a.nome }))

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-bold text-text-blue whitespace-nowrap">
          Area:
        </label>
        <div className="w-64">
          <Select
            options={options}
            placeholder="Selecione uma area"
            value={selectedArea ?? undefined}
            onValueChange={onAreaChange}
          />
        </div>
      </div>
    </section>
  )
}
