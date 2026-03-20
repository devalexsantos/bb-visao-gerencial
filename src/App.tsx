import { useCallback, useEffect, useRef, useState } from "react"
import { Layout } from "./components/Layout"
import { ansList } from "./mocks/data"
import { AnsKpiCards } from "./sections/AnsKpiCards"
import { AreaFilter } from "./sections/AreaFilter"
import { RacFollowUp } from "./sections/RacFollowUp"
import { RcoDetail } from "./sections/RcoDetail"
import { IndicatorHistory } from "./sections/IndicatorHistory"

export function App() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [selectedAnsId, setSelectedAnsId] = useState<string | null>(null)
  const [selectedRacId, setSelectedRacId] = useState<string | null>(null)
  const [selectedIndicadorId, setSelectedIndicadorId] = useState<string | null>(null)

  const ansRef = useRef<HTMLDivElement>(null)
  const followUpRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  const scrollTo = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }, [])

  const handleAreaChange = useCallback((areaId: string) => {
    setSelectedArea(areaId)
    setSelectedAnsId(null)
    setSelectedRacId(null)
    setSelectedIndicadorId(null)
  }, [])

  const handleAnsSelect = useCallback((ansId: string) => {
    setSelectedAnsId(ansId)
    setSelectedRacId(null)
    setSelectedIndicadorId(null)
  }, [])

  const handleRacSelect = useCallback((racId: string) => {
    setSelectedRacId(racId)
    setSelectedIndicadorId(null)
  }, [])

  const handleIndicadorSelect = useCallback((indicadorId: string) => {
    setSelectedIndicadorId(indicadorId)
  }, [])

  // Scroll effects
  useEffect(() => {
    if (selectedAnsId) scrollTo(followUpRef)
  }, [selectedAnsId, scrollTo])

  useEffect(() => {
    if (selectedRacId) scrollTo(detailRef)
  }, [selectedRacId, scrollTo])

  useEffect(() => {
    if (selectedIndicadorId) scrollTo(historyRef)
  }, [selectedIndicadorId, scrollTo])

  // Derived data
  const filteredAns = selectedArea
    ? ansList.filter((a) => a.areaId === selectedArea)
    : []

  const selectedAns = filteredAns.find((a) => a.id === selectedAnsId)

  const selectedRac = selectedAns?.racs.find(
    (r) => r.id === selectedRacId,
  )

  const selectedIndicador = selectedRac?.indicadores.find(
    (i) => i.id === selectedIndicadorId,
  )

  return (
    <Layout>
      <div className="space-y-4">
        <AreaFilter selectedArea={selectedArea} onAreaChange={handleAreaChange} />

        {selectedArea && (
          <div ref={ansRef}>
            <AnsKpiCards
              ansList={filteredAns}
              selectedAnsId={selectedAnsId}
              onSelectAns={handleAnsSelect}
            />
          </div>
        )}

        {selectedAns && (
          <div ref={followUpRef}>
            <RacFollowUp
              ans={selectedAns}
              selectedRacId={selectedRacId}
              onSelectRac={handleRacSelect}
            />
          </div>
        )}

        {selectedRac && (
          <div ref={detailRef}>
            <RcoDetail
              rac={selectedRac}
              selectedIndicadorId={selectedIndicadorId}
              onSelectIndicador={handleIndicadorSelect}
            />
          </div>
        )}

        {selectedIndicador && (
          <div ref={historyRef}>
            <IndicatorHistory indicador={selectedIndicador} />
          </div>
        )}
      </div>
    </Layout>
  )
}
